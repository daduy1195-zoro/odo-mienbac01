const fs = require('fs');
let code = fs.readFileSync('test_parse4.js', 'utf8');
let out = [];
let lines = code.split('\n');
for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (i >= 170 && i < 450) {
        if (line.includes('if (') && !line.includes('else if')) {
            out.push(`console.log("EXEC IF LINE", ${i});`);
        }
        if (line.includes('continue;')) {
            line = line.replace('continue;', `console.log("CONTINUED AT", ${i}); continue;`);
        }
    }
    out.push(line);
}
fs.writeFileSync('test_parse9.js', out.join('\n'));
