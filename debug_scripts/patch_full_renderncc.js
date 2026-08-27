const fs = require('fs');

const code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const startStr = 'function renderNcc(pivotData) {';
const endStr = '// PROXY FETCH - Đọc sheet qua Google Apps Script proxy khi bị ACCESS_DENIED';

const startIndex = code.indexOf(startStr);
const endIndex = code.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
    const before = code.substring(0, startIndex);
    
    // We need to keep the exact comment that is before PROXY FETCH
    // In the code, there's a delimiter line:
    // // ═══════════════════════════════════════
    // // PROXY FETCH
    
    // Let's find the exact delimiter
    const delimIndex = code.lastIndexOf('// ═', endIndex);
    const after = code.substring(delimIndex !== -1 ? delimIndex : endIndex);
    
    const newRenderNcc = `function renderNcc(pivotData) {
    const container = document.getElementById('nccTableContainer');
    if(!container) return;
    
    if(Object.keys(pivotData).length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="icon">📭</div><p>Không có dữ liệu NCC</p></div>';
        document.getElementById('nccTotalCost').innerText = '0 đ';
        return;
    }
    
    let html = \`<table>
        <thead>
            <tr>
                <th>Kho / Biển số xe</th>
                <th style="text-align:right;color:#fbbf24;">Tổng chi phí<br>(trước thuế)</th>
                <th style="text-align:right;color:#fbbf24;">Số KM phát sinh</th>
                <th style="text-align:right;color:#fbbf24;">Phí vượt KM</th>
                <th style="text-align:right;color:#fbbf24;">TG tăng ca<br>(h)</th>
                <th style="text-align:right;color:#fbbf24;">Phí tăng ca</th>
                <th style="text-align:right;color:#fbbf24;">Phí cầu đường</th>
            </tr>
        </thead>
        <tbody>\`;
        
    let grandTotalCost = 0;
    
    let minCost = Infinity, maxCost = -Infinity;
    let maxKm = 0, maxPhiVuot = 0, maxTgOt = 0, maxPhiOt = 0, maxPhiCau = 0;
    const khoSubCost = {};
    for (const k of Object.keys(pivotData)) {
        khoSubCost[k] = 0;
        for (const b of Object.keys(pivotData[k])) {
            const d = pivotData[k][b];
            khoSubCost[k] += d.chiPhi;
            if (d.chiPhi < minCost) minCost = d.chiPhi;
            if (d.chiPhi > maxCost) maxCost = d.chiPhi;
            if (d.kmPhatSinh > maxKm) maxKm = d.kmPhatSinh;
            if (d.phiVuotKm > maxPhiVuot) maxPhiVuot = d.phiVuotKm;
            if (d.thoiGianTangCa > maxTgOt) maxTgOt = d.thoiGianTangCa;
            if (d.phiTangCa > maxPhiOt) maxPhiOt = d.phiTangCa;
            if (d.phiCauDuong > maxPhiCau) maxPhiCau = d.phiCauDuong;
        }
    }
    if (minCost === Infinity) minCost = 0;
    if (maxCost === -Infinity) maxCost = 0;

    function getColor(value, min, max) {
        if (!value || value <= 0) return 'var(--text-muted)';
        if (max <= min) return '#fcd34d'; // yellow-300
        let ratio = (value - min) / (max - min);
        // From Yellow (#fcd34d: 252, 211, 77) to Red (#ef4444: 239, 68, 68)
        const r1 = 252, g1 = 211, b1 = 77;
        const r2 = 239, g2 = 68, b2 = 68;
        const r = Math.round(r1 + (r2 - r1) * ratio);
        const g = Math.round(g1 + (g2 - g1) * ratio);
        const b = Math.round(b1 + (b2 - b1) * ratio);
        return \`rgb(\${r}, \${g}, \${b})\`;
    }

    const sortedKho = Object.keys(pivotData).sort((a, b) => khoSubCost[b] - khoSubCost[a]);

    for(const kho of sortedKho) {
        const xeList = pivotData[kho];
        let subCost = 0, subKm = 0, subPhiVuot = 0, subTgOt = 0, subPhiOt = 0, subPhiCau = 0;
        
        let carRows = '';
        const sortedPlates = Object.keys(xeList).sort((a, b) => xeList[b].chiPhi - xeList[a].chiPhi);
        let rowIndex = 0;
        
        for(const bienSo of sortedPlates) {
            const data = xeList[bienSo];
            subCost += data.chiPhi;
            subKm += data.kmPhatSinh;
            subPhiVuot += data.phiVuotKm;
            subTgOt += data.thoiGianTangCa;
            subPhiOt += data.phiTangCa;
            subPhiCau += data.phiCauDuong;
            
            let bg = rowIndex % 2 === 0 ? 'background: rgba(255, 255, 255, 0.02);' : 'background: transparent;';
            rowIndex++;

            carRows += \`
                <tr style="\${bg}">
                    <td style="padding-left: 32px; font-family:Calibri, sans-serif; font-weight:600; color: #cbd5e1;">\${escapeHtml(bienSo)}</td>
                    <td style="text-align:right;color:\${getColor(data.chiPhi, minCost, maxCost)};font-weight:600;">\${Math.round(data.chiPhi).toLocaleString('vi-VN')}</td>
                    <td style="text-align:right;color:\${getColor(data.kmPhatSinh, 0, maxKm)};font-weight:500;">\${Math.round(data.kmPhatSinh).toLocaleString('vi-VN')}</td>
                    <td style="text-align:right;color:\${getColor(data.phiVuotKm, 0, maxPhiVuot)};font-weight:500;">\${Math.round(data.phiVuotKm).toLocaleString('vi-VN')}</td>
                    <td style="text-align:right;color:\${getColor(data.thoiGianTangCa, 0, maxTgOt)};font-weight:500;">\${Number(data.thoiGianTangCa.toFixed(2)).toLocaleString('vi-VN')}</td>
                    <td style="text-align:right;color:\${getColor(data.phiTangCa, 0, maxPhiOt)};font-weight:500;">\${Math.round(data.phiTangCa).toLocaleString('vi-VN')}</td>
                    <td style="text-align:right;color:\${getColor(data.phiCauDuong, 0, maxPhiCau)};font-weight:500;">\${Math.round(data.phiCauDuong).toLocaleString('vi-VN')}</td>
                </tr>
            \`;
        }
        
        grandTotalCost += subCost;
        
        html += \`
            <tr style="background: rgba(20, 184, 166, 0.15); border-bottom: 2px solid rgba(20, 184, 166, 0.3);">
                <td style="font-weight: bold; color: var(--accent); font-size: 14px;">\${escapeHtml(kho)}</td>
                <td style="text-align:right; font-weight: bold; color:#f59e0b; font-size: 14px;">\${Math.round(subCost).toLocaleString('vi-VN')}</td>
                <td style="text-align:right; font-weight: bold; color:#fbbf24;">\${Math.round(subKm).toLocaleString('vi-VN')}</td>
                <td style="text-align:right; font-weight: bold; color:#fbbf24;">\${Math.round(subPhiVuot).toLocaleString('vi-VN')}</td>
                <td style="text-align:right; font-weight: bold; color:#fbbf24;">\${Number(subTgOt.toFixed(2)).toLocaleString('vi-VN')}</td>
                <td style="text-align:right; font-weight: bold; color:#fbbf24;">\${Math.round(subPhiOt).toLocaleString('vi-VN')}</td>
                <td style="text-align:right; font-weight: bold; color:#fbbf24;">\${Math.round(subPhiCau).toLocaleString('vi-VN')}</td>
            </tr>
            \${carRows}
        \`;
    }
    
    html += \`</tbody></table>\`;
    container.innerHTML = html;
    
    document.getElementById('nccTotalCost').innerText = Math.round(grandTotalCost).toLocaleString('vi-VN') + ' đ';
}

`;

    fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', before + newRenderNcc + after);
    console.log("Patched successfully");
} else {
    console.log("Could not find start or end index.");
}
