const fs = require('fs');
let code = fs.readFileSync('test_parse4.js', 'utf8');
code = code.replace(/for \(let i = startRow; i < rawData\.length; i\+\+\) \{/, 'for (let i = startRow; i < rawData.length; i++) { try {');
code = code.replace(/results\.push\(/, '} catch (e) { console.error("ERROR AT ROW", i, e.stack); } results.push(');
fs.writeFileSync('test_parse11.js', code);
