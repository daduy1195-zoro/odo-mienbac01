const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const oldCode = `    let cycleMonth = now.getMonth(); // 0-indexed
    if (now.getDate() < 26) {
        cycleMonth -= 1;
        if (cycleMonth < 0) { cycleMonth = 11; cycleYear -= 1; }
    }`;

const oldCodeCRLF = `    let cycleMonth = now.getMonth(); // 0-indexed\r
    if (now.getDate() < 26) {\r
        cycleMonth -= 1;\r
        if (cycleMonth < 0) { cycleMonth = 11; cycleYear -= 1; }\r
    }`;

const newCode = `    let cycleMonth = now.getMonth() - 1; // 0-indexed
    if (cycleMonth < 0) { cycleMonth = 11; cycleYear -= 1; }`;

if (code.includes(oldCodeCRLF)) {
    code = code.replace(oldCodeCRLF, newCode);
} else {
    code = code.replace(oldCode, newCode);
}

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Fixed cycle logic');
