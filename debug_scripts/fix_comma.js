const fs = require('fs');
let code = fs.readFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'utf8');

code = code.replace("ARCHIVE_API_URL: '' // Tạm tắt do API đang bị chặn quyền 401 (domain ghn.vn),", "ARCHIVE_API_URL: '', // Tạm tắt do API đang bị chặn quyền 401 (domain ghn.vn)");

fs.writeFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', code);
console.log("Fixed");
