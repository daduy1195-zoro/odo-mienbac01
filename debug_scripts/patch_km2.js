const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

code = code.replace(/parseFloat\(String\(r\.kmDiff\)\.replace\(\/\[\^\\\\d\.\]\/g, ''\)\)/g, 'parseVietnameseNumber(r.kmDiff)');
code = code.replace(/parseFloat\(String\(r\.kmStart\)\.replace\(\/\[\^\\\\d\.\]\/g, ''\)\)/g, 'parseVietnameseNumber(r.kmStart)');
code = code.replace(/parseFloat\(String\(r\.kmEnd\)\.replace\(\/\[\^\\\\d\.\]\/g, ''\)\)/g, 'parseVietnameseNumber(r.kmEnd)');

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('km fixed 2');
