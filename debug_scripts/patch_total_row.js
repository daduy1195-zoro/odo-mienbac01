const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const regexTotals = /let grandTotalCost = 0;[\s\S]*?if \(minCost === Infinity\) minCost = 0;/;

const replacementTotals = `let grandTotalCost = 0, grandKm = 0, grandPhiVuot = 0, grandTgOt = 0, grandPhiOt = 0, grandPhiCau = 0;
    let minCost = Infinity, maxCost = -Infinity;
    let maxKm = 0, maxPhiVuot = 0, maxTgOt = 0, maxPhiOt = 0, maxPhiCau = 0;

    pivotData.forEach(d => {
        grandTotalCost += d.chiPhi;
        grandKm += d.kmPhatSinh;
        grandPhiVuot += d.phiVuotKm;
        grandTgOt += d.thoiGianTangCa;
        grandPhiOt += d.phiTangCa;
        grandPhiCau += d.phiCauDuong;

        if (d.chiPhi < minCost) minCost = d.chiPhi;
        if (d.chiPhi > maxCost) maxCost = d.chiPhi;
        if (d.kmPhatSinh > maxKm) maxKm = d.kmPhatSinh;
        if (d.phiVuotKm > maxPhiVuot) maxPhiVuot = d.phiVuotKm;
        if (d.thoiGianTangCa > maxTgOt) maxTgOt = d.thoiGianTangCa;
        if (d.phiTangCa > maxPhiOt) maxPhiOt = d.phiTangCa;
        if (d.phiCauDuong > maxPhiCau) maxPhiCau = d.phiCauDuong;
    });

    if (minCost === Infinity) minCost = 0;`;

if (code.match(regexTotals)) {
    code = code.replace(regexTotals, replacementTotals);
} else {
    console.log('regexTotals not found');
}

const regexRender = /\/\/ Sắp xếp: Kho -> NCC -> Biển số[\s\S]*?pivotData\.sort\(\(a, b\) => \{/;
const replacementRender = `// Thêm dòng tổng vào HTML
    html += '<tr style="background: rgba(20, 184, 166, 0.15); border-bottom: 2px solid rgba(20, 184, 166, 0.3);">' +
                '<td colspan="3" style="font-weight: bold; color: var(--accent); font-size: 14px; text-align: center; letter-spacing: 1px;">TỔNG CỘNG</td>' +
                '<td style="text-align:right; font-weight: bold; color:var(--text-primary); font-size: 14px;">' + Math.round(grandTotalCost).toLocaleString('vi-VN') + '</td>' +
                '<td style="text-align:right; font-weight: bold; color:var(--text-primary);">' + Math.round(grandKm).toLocaleString('vi-VN') + '</td>' +
                '<td style="text-align:right; font-weight: bold; color:var(--text-primary);">' + Math.round(grandPhiVuot).toLocaleString('vi-VN') + '</td>' +
                '<td style="text-align:right; font-weight: bold; color:var(--text-primary);">' + Number(grandTgOt.toFixed(2)).toLocaleString('vi-VN') + '</td>' +
                '<td style="text-align:right; font-weight: bold; color:var(--text-primary);">' + Math.round(grandPhiOt).toLocaleString('vi-VN') + '</td>' +
                '<td style="text-align:right; font-weight: bold; color:var(--text-primary);">' + Math.round(grandPhiCau).toLocaleString('vi-VN') + '</td>' +
            '</tr>\\n';

    // Sắp xếp: Kho -> NCC -> Biển số
    pivotData.sort((a, b) => {`;

if (code.match(regexRender)) {
    code = code.replace(regexRender, replacementRender);
    fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
    console.log('Total row added.');
} else {
    console.log('regexRender not found');
}
