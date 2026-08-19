const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// I will remove the hardcoded fallbacks that assume row[21] and row[22]
const regex = /\/\/ 1\. Nếu dailyRate rỗng nhưng col 21 chứa Đơn giá ngày[\s\S]*?(?=\/\/ 3\. Xóa bỏ trùng lặp Phí cầu đường)/;
const replace = ``;

if (content.match(regex)) {
    content = content.replace(regex, replace);
    console.log("Removed hardcoded fallbacks");
}

fs.writeFileSync('index.html', content, 'utf8');
