const fs = require('fs');
let code = fs.readFileSync('test_parse4.js', 'utf8');
let lc = 1;
code = code.split('\n').map((line, i) => {
    if (i >= 170 && i < 450) {
        if (line.includes('if (') || line.includes('let ') || line.includes('const ') || line.includes('=')) {
            return `console.log("EXEC LINE", ${i});\n` + line;
        }
    }
    return line;
}).join('\n');
fs.writeFileSync('test_parse8.js', code);
