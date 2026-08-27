const fs = require('fs');
let code = fs.readFileSync('test_parse4.js', 'utf8');
let lc = 1;
code = code.split('\n').map((line, i) => {
    if (line.includes('continue;')) {
        return line.replace('continue;', `console.log("CONTINUED AT LINE", ${i}); continue;`);
    }
    return line;
}).join('\n');
fs.writeFileSync('test_parse6.js', code);
