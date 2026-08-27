const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

code = code.replace(
    /        let tripNote = '';\r?\n        let isManualMatch = false;\r?\n        try \{/g,
    "        let tripNote = '';\n        let isManualMatch = false;\n        let actionLogs = [];\n        try {"
);

code = code.replace(
    /            let actionLogs = \[\];\r?\n            try \{\r?\n                const logs/g,
    "            try {\n                const logs"
);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Done scope');
