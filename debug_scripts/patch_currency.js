const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

// TỔNG CỘNG row replacements
code = code.replace(
    /Math\.round\(grandTotalCost\)\.toLocaleString\('vi-VN'\) \+ '<\/td>'/g,
    "Math.round(grandTotalCost).toLocaleString('vi-VN') + ' đ</td>'"
);
code = code.replace(
    /Math\.round\(grandPhiVuot\)\.toLocaleString\('vi-VN'\) \+ '<\/td>'/g,
    "Math.round(grandPhiVuot).toLocaleString('vi-VN') + ' đ</td>'"
);
code = code.replace(
    /Math\.round\(grandPhiOt\)\.toLocaleString\('vi-VN'\) \+ '<\/td>'/g,
    "Math.round(grandPhiOt).toLocaleString('vi-VN') + ' đ</td>'"
);
code = code.replace(
    /Math\.round\(grandPhiCau\)\.toLocaleString\('vi-VN'\) \+ '<\/td>'/g,
    "Math.round(grandPhiCau).toLocaleString('vi-VN') + ' đ</td>'"
);

// Data rows replacements
code = code.replace(
    /Math\.round\(data\.chiPhi\)\.toLocaleString\('vi-VN'\) \+ '<\/td>'/g,
    "Math.round(data.chiPhi).toLocaleString('vi-VN') + ' đ</td>'"
);
code = code.replace(
    /Math\.round\(data\.phiVuotKm\)\.toLocaleString\('vi-VN'\) \+ '<\/td>'/g,
    "Math.round(data.phiVuotKm).toLocaleString('vi-VN') + ' đ</td>'"
);
code = code.replace(
    /Math\.round\(data\.phiTangCa\)\.toLocaleString\('vi-VN'\) \+ '<\/td>'/g,
    "Math.round(data.phiTangCa).toLocaleString('vi-VN') + ' đ</td>'"
);
code = code.replace(
    /Math\.round\(data\.phiCauDuong\)\.toLocaleString\('vi-VN'\) \+ '<\/td>'/g,
    "Math.round(data.phiCauDuong).toLocaleString('vi-VN') + ' đ</td>'"
);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Currency patched.');
