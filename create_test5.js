const fs = require('fs');
let code = fs.readFileSync('test_parse4.js', 'utf8');
code = code.replace(/continue;/g, 'console.log("CONTINUED"); continue;');
fs.writeFileSync('test_parse5.js', code);
