const fs = require('fs');
let code = fs.readFileSync('test_parse4.js', 'utf8');
code = code.replace(/const row = rawData\[i\];/g, 'const row = rawData[i]; console.log("PROCESSING ROW", row);');
fs.writeFileSync('test_parse7.js', code);
