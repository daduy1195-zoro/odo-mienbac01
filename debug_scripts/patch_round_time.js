const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

code = code.replace(/Number\(data\.thoiGianTangCa\.toFixed\(2\)\)\.toLocaleString\('vi-VN'\)/g, "Math.round(data.thoiGianTangCa).toLocaleString('vi-VN')");
code = code.replace(/Number\(grandTgOt\.toFixed\(2\)\)\.toLocaleString\('vi-VN'\)/g, "Math.round(grandTgOt).toLocaleString('vi-VN')");

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Time rounded.');
