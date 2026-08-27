const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const regex1 = /\/\/\ 5\.\ Lọc bỏ đơn giá tăng ca[\s\S]*?if \(kmOverNum > 0 && kmOverNum <= 10000\) kmOverFee = '';/g;
code = code.replace(regex1, '// 5. Filters removed');

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Filters removed via regex.');
