const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const hoistPatch = `
    let overridesCache = {};
    let notesCache = {};
    let logsCache = {};
    try {
        overridesCache = JSON.parse(localStorage.getItem('GHN_NCC_TRIP_OVERRIDES') || '{}');
        notesCache = JSON.parse(localStorage.getItem('GHN_NCC_TRIP_NOTES') || '{}');
        logsCache = JSON.parse(localStorage.getItem('GHN_ACTION_LOGS') || '{}');
    } catch(e) {}
    
    for (let i = startRow; i < rawData.length; i++) {`;
code = code.replace(/    for \(let i = startRow; i < rawData\.length; i\+\+\) \{/, hoistPatch);

const innerPatch = `            if (overridesCache[finalKey] !== undefined) {
                matchedTripCode = overridesCache[finalKey];
                if (matchedTripCode && !['GHN OFF', 'NCC OFF', 'OFF', 'Phạt', 'PHẠT', 'GHN_OFF', 'NCC_OFF'].includes(String(matchedTripCode).toUpperCase())) {
                    isManualMatch = true;
                }
            }
            if (notesCache[finalKey] !== undefined) {
                tripNote = notesCache[finalKey];
            }
            try {
                if (logsCache[finalKey]) actionLogs = logsCache[finalKey];
            } catch(e) {}`;

// Dòng 4388-4402
const regexToReplace = /            const overrides = JSON\.parse\(localStorage\.getItem\('GHN_NCC_TRIP_OVERRIDES'\) \|\| '\{\}'\);\r?\n            if \(overrides\[finalKey\] !== undefined\) \{\r?\n                matchedTripCode = overrides\[finalKey\];\r?\n                if \(matchedTripCode && \!\['GHN OFF', 'NCC OFF', 'OFF', 'Phạt', 'PHẠT', 'GHN_OFF', 'NCC_OFF'\]\.includes\(String\(matchedTripCode\)\.toUpperCase\(\)\)\) \{\r?\n                    isManualMatch = true;\r?\n                \}\r?\n            \}\r?\n            const notes = JSON\.parse\(localStorage\.getItem\("GHN_NCC_TRIP_NOTES"\) \|\| "\{\}"\);\r?\n            if \(notes\[finalKey\] !== undefined\) \{\r?\n                tripNote = notes\[finalKey\];\r?\n            \}\r?\n            try \{\r?\n                const logs = JSON\.parse\(localStorage\.getItem\('GHN_ACTION_LOGS'\) \|\| '\{\}'\);\r?\n                if \(logs\[finalKey\]\) actionLogs = logs\[finalKey\];\r?\n            \} catch\(e\) \{\}/g;

code = code.replace(regexToReplace, innerPatch);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Perf patched.');
