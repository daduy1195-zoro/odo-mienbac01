const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const targetStr = `
        // 5. Filters removed
`;

const replacementStr = `
        // 5. Filters removed
        
        // --- SANITY CHECKS ---
        // Lọc bỏ lỗi nhập liệu từ các file NCC cá nhân (Ví dụ: nhập Phí tăng ca vào cột Thời gian tăng ca, hoặc nhập ODO vào KM phát sinh)
        let otHoursNum = parseVietnameseNumber(otHours);
        if (otHoursNum > 24) otHours = ''; 
        
        let kmOverSanity = parseVietnameseNumber(kmOver);
        if (kmOverSanity > 2000) kmOver = '';
`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Sanity checks applied.');
