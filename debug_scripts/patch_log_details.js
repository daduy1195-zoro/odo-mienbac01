const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

// 1. Add user field to pushes
code = code.replace(
    /nccTripData\[index\]\.actionLogs\.push\(\{ time: new Date\(\)\.toLocaleString\('vi-VN'\), action: 'Sửa ghi chú', details: value \|\| 'Xóa ghi chú' \}\);/g,
    "nccTripData[index].actionLogs.push({ time: new Date().toLocaleString('vi-VN'), action: 'Sửa ghi chú', details: value || 'Xóa ghi chú', user: (typeof currentUser !== 'undefined' && currentUser ? currentUser.name : 'Ẩn danh') });"
);

code = code.replace(
    /nccTripData\[index\]\.actionLogs\.push\(\{ time: new Date\(\)\.toLocaleString\('vi-VN'\), action: 'Chốt mã chuyến', details: value \|\| 'Xóa mã' \}\);/g,
    "nccTripData[index].actionLogs.push({ time: new Date().toLocaleString('vi-VN'), action: 'Chốt mã chuyến', details: value || 'Xóa mã', user: (typeof currentUser !== 'undefined' && currentUser ? currentUser.name : 'Ẩn danh') });"
);

// 2. Format tooltip map function
code = code.replace(
    /l\.time \+ ' \(' \+ \(l\.user\|\|'Ẩn danh'\) \+ '\): ' \+ l\.action \+ ' - ' \+ l\.details/g,
    "'- ' + l.time + ' (' + (l.user||'Ẩn danh') + '): ' + l.action + ' - ' + l.details"
);

// 3. Make global tooltip wider
code = code.replace(
    'max-width:400px; white-space:pre-wrap;',
    'max-width:600px; min-width:300px; white-space:pre-wrap;'
);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Log details patched');
