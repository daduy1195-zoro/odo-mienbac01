const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const attachLogsPatch = `            const notes = JSON.parse(localStorage.getItem("GHN_NCC_TRIP_NOTES") || "{}");
            if (notes[finalKey] !== undefined) {
                tripNote = notes[finalKey];
            }
            let actionLogs = [];
            try {
                const logs = JSON.parse(localStorage.getItem('GHN_ACTION_LOGS') || '{}');
                if (logs[finalKey]) actionLogs = logs[finalKey];
            } catch(e) {}
`;
code = code.replace(/            const notes = JSON\.parse\(localStorage\.getItem\("GHN_NCC_TRIP_NOTES"\) \|\| "\{\}"\);\r?\n            if \(notes\[finalKey\] !== undefined\) \{\r?\n                tripNote = notes\[finalKey\];\r?\n            \}/g, attachLogsPatch);

const pushResultPatch = `            isManualMatch: isManualMatch,
            note: tripNote,
            actionLogs: actionLogs,
            sheetId: sheetId || '',`;
code = code.replace(/            isManualMatch: isManualMatch,\r?\n            note: tripNote,\r?\n            sheetId: sheetId \|\| '',/g, pushResultPatch);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Done parse');
