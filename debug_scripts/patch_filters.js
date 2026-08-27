const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const target1 = `// 5. Lọc bỏ đơn giá tăng ca (35k/h) và đơn giá KM (4k/km) bị nhận nhầm làm tổng phí
        const otFeeNum = parseVietnameseNumber(otFee);
        if (otFeeNum > 0 && otFeeNum <= 100000) otFee = '';
        
        const kmOverNum = parseVietnameseNumber(kmOverFee);
        if (kmOverNum > 0 && kmOverNum <= 10000) kmOverFee = '';`;

const replacement = `// Removed fake filters that were destroying valid daily fees`;

code = code.replace(target1, replacement);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Filters removed.');
