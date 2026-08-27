const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const s1 = `statusHtml = '<span style="color:var(--info); font-weight:700;">🔄 Đa chuyến</span>';`;
const r1 = `statusHtml = r.isManualMatch ? '<span style="color:var(--info); font-weight:700;">🔄 Đa chuyến <small style="color:#f59e0b">(Khớp tay)</small></span>' : '<span style="color:var(--info); font-weight:700;">🔄 Đa chuyến</span>';`;

code = code.replace(s1, r1);
fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('DONE');
