const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Update headerRowIdx detection
const regex1 = /for \(let i = 0; i < Math\.min\(5, rawData\.length\); i\+\+\) \{\s+const row = rawData\[i\];\s+const textContent = row\.join\(' '\)\.toLowerCase\(\);\s+if \(textContent\.includes\('ngày'\) && textContent\.includes\('biển số'\) && textContent\.includes\('kho'\)\) \{/g;
const replace1 = `for (let i = 0; i < Math.min(25, rawData.length); i++) {
            const row = rawData[i];
            const textContent = row.join(' ').toLowerCase();
            if ((textContent.includes('ngày') || textContent.includes('ngay')) && 
                (textContent.includes('biển số') || textContent.includes('xe')) && 
                (textContent.includes('lộ trình') || textContent.includes('kho') || textContent.includes('stt'))) {`;

// Update scanEnd fallback
const regex2 = /let scanEnd = headerRowIdx > -1 \? headerRowIdx : Math\.min\(5, rawData\.length - 1\);/g;
const replace2 = `let scanEnd = headerRowIdx > -1 ? headerRowIdx + 1 : Math.min(20, rawData.length - 1);`;

let matchCount = 0;
if (content.match(regex1)) {
    content = content.replace(regex1, replace1);
    matchCount++;
}
if (content.match(regex2)) {
    content = content.replace(regex2, replace2);
    matchCount++;
}

fs.writeFileSync('index.html', content, 'utf8');
console.log(`Updated ${matchCount} patterns in index.html`);
