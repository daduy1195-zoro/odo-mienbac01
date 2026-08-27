const fs = require('fs');
let code = fs.readFileSync('test_parse4.js', 'utf8');
code = code.replace(/results\.push/g, 'console.log("PUSHING!"); results.push');
fs.writeFileSync('test_parse10.js', code);
