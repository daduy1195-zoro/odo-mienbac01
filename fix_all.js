const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');
let changes = 0;

// FIX 1: tripNote declaration
const tripNoteBefore = `        const finalKey = \`\${nccName}_\${plate}_\${dateStr}_\${sourceRow}\`;
        try {`;
const tripNoteAfter = `        const finalKey = \`\${nccName}_\${plate}_\${dateStr}_\${sourceRow}\`;
        let tripNote = '';
        try {`;
if (content.includes(tripNoteBefore)) {
    content = content.replace(tripNoteBefore, tripNoteAfter);
    changes++;
    console.log('FIX 1: tripNote declaration - OK');
} else {
    console.log('FIX 1: tripNote - SKIPPED (already applied or not found)');
}

// FIX 2: JSONP timeout - replace delete window[callbackName] in setTimeout/onerror with safe stub
// This needs to be more targeted - only in setTimeout and onerror callbacks, NOT in the main success callback
const timeoutDeleteRegex = /setTimeout\(\(\) => \{\s*delete window\[callbackName\];/g;
const timeoutReplace = `setTimeout(() => {\n              window[callbackName] = function(){ delete window[callbackName]; };`;
const count2a = (content.match(timeoutDeleteRegex) || []).length;
content = content.replace(timeoutDeleteRegex, timeoutReplace);
console.log(`FIX 2a: JSONP timeout callbacks - ${count2a} replacements`);
changes += count2a;

const onerrorDeleteRegex = /script\.onerror = \(\) => \{\s*delete window\[callbackName\];/g;
const onerrorReplace = `script.onerror = () => {\n              window[callbackName] = function(){ delete window[callbackName]; };`;
const count2b = (content.match(onerrorDeleteRegex) || []).length;
content = content.replace(onerrorDeleteRegex, onerrorReplace);
console.log(`FIX 2b: JSONP onerror callbacks - ${count2b} replacements`);
changes += count2b;

// FIX 3: offDays filter - add firstActiveIndex check
const offDaysRegex = /let offDays = allDatesInCycle\.filter\(\(d, index\) => \{\s*return isTrackedInTrips && syncedDates\.has\(d\) && !e\.workedDays\.has\(d\);\s*\}\);/;
const offDaysReplace = `let offDays = allDatesInCycle.filter((d, index) => {
                if (firstActiveIndex !== -1 && index < firstActiveIndex) return false;
                return isTrackedInTrips && syncedDates.has(d) && !e.workedDays.has(d);
            });`;
if (offDaysRegex.test(content)) {
    content = content.replace(offDaysRegex, offDaysReplace);
    changes++;
    console.log('FIX 3: offDays firstActiveIndex filter - OK');
} else {
    console.log('FIX 3: offDays - SKIPPED');
}

// FIX 4: myExpectedDays - add firstActiveIndex deduction for days before start
const expectedRegex = /if\s*\(isTrackedInTrips\)\s*\{\s*allDatesInCycle\.forEach\(\(d,\s*idx\)\s*=>\s*\{\s*\/\/[^\n]*\n\s*if\s*\(syncedDates\.has\(d\)\s*&&\s*!e\.workedDays\.has\(d\)\)\s*\{\s*myExpectedDays--;\s*\}\s*\}\);\s*\}/;
const expectedReplace = `if (isTrackedInTrips) {
                allDatesInCycle.forEach((d, idx) => {
                    if (firstActiveIndex !== -1 && idx < firstActiveIndex) {
                        myExpectedDays--;
                        return;
                    }
                    if (syncedDates.has(d) && !e.workedDays.has(d)) {
                        myExpectedDays--;
                    }
                });
            }`;
if (expectedRegex.test(content)) {
    content = content.replace(expectedRegex, expectedReplace);
    changes++;
    console.log('FIX 4: myExpectedDays firstActiveIndex - OK');
} else {
    console.log('FIX 4: myExpectedDays - SKIPPED');
}

fs.writeFileSync('index.html', content, 'utf8');
console.log(`\nTotal changes: ${changes}`);
