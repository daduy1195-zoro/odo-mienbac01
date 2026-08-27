const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

code = code.replace(
    /Math\.round\(data\.chiPhi\)\.toLocaleString\('vi-VN'\) \+ '<\/td>\\n'/g,
    "Math.round(data.chiPhi).toLocaleString('vi-VN') + ' đ</td>\\n'"
);
code = code.replace(
    /Math\.round\(data\.phiVuotKm\)\.toLocaleString\('vi-VN'\) \+ '<\/td>\\n'/g,
    "Math.round(data.phiVuotKm).toLocaleString('vi-VN') + ' đ</td>\\n'"
);
code = code.replace(
    /Math\.round\(data\.phiTangCa\)\.toLocaleString\('vi-VN'\) \+ '<\/td>\\n'/g,
    "Math.round(data.phiTangCa).toLocaleString('vi-VN') + ' đ</td>\\n'"
);
code = code.replace(
    /Math\.round\(data\.phiCauDuong\)\.toLocaleString\('vi-VN'\) \+ '<\/td>\\n'/g,
    "Math.round(data.phiCauDuong).toLocaleString('vi-VN') + ' đ</td>\\n'"
);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Currency patched again.');
