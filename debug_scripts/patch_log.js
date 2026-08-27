const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

let lines = code.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('console.log("DEBUG NAK:"')) {
        lines[i] = '                // ' + lines[i].trim();
    }
}

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', lines.join('\n'));
console.log('Log removed');
