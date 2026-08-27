const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

code = code.replace(/'Đào Trọng An'/g, "'Đạo Trường An'");
fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Fixed to Đạo Trường An in CONFIG');
