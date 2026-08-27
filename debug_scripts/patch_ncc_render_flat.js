const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const targetLoad = code.substring(code.indexOf('let pivotData = {};'), code.indexOf('renderNcc(pivotData);') + 21);
const replacementLoad = `
    let pivotMap = new Map();
    let hasData = false;

    nccTripData.forEach(r => {
        const parts = String(r.dateStr || '').split('/');
        if (parts.length === 3) {
            const rowDateObj = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
            if (month && typeof isInCycle === 'function' && !isInCycle(rowDateObj, month)) return;
        } else if (month) {
            return;
        }

        let kho = String(r.warehouse || '').trim();
        const bienSo = String(r.plate || '').trim();
        const ncc = String(r.ncc || '').trim();
        if(!kho || !bienSo) return;

        const shortWH = shortWarehouse(kho);
        if(filterWarehouse && shortWH !== filterWarehouse && filterWarehouse !== '') return;

        let khoGroup = kho;
        const khoUpper = khoGroup.toUpperCase();
        if(khoUpper.includes('HẢI DƯƠNG') || khoUpper.includes('HAI DUONG')) khoGroup = 'Kho GXT Hải Dương';
        else if(khoUpper.includes('HẢI PHÒNG') || khoUpper.includes('HAI PHONG')) khoGroup = 'Kho GXT Hải Phòng';
        else if(khoUpper.includes('HƯNG YÊN') || khoUpper.includes('MIỀN BẮC') || khoUpper.includes('MIEN BAC')) khoGroup = 'Kho GXT Hưng Yên';
        else if(khoUpper.includes('THÁI BÌNH') || khoUpper.includes('THAI BINH')) khoGroup = 'Kho GXT Thái Bình';

        const key = `${khoGroup}|${ncc}|${bienSo}`;
        if (!pivotMap.has(key)) {
            pivotMap.set(key, {
                kho: khoGroup,
                ncc: ncc,
                bienSo: bienSo,
                chiPhi: 0, kmPhatSinh: 0, phiVuotKm: 0,
                thoiGianTangCa: 0, phiTangCa: 0, phiCauDuong: 0
            });
        }
        
        const data = pivotMap.get(key);

        const tong = parseVietnameseNumber(r.totalCost);
        const km = parseVietnameseNumber(r.kmOver);
        const phiKm = parseVietnameseNumber(r.kmOverFee);
        const tgOt = parseVietnameseNumber(r.otHours);
        const phiOt = parseVietnameseNumber(r.otFee);
        const phiCau = parseVietnameseNumber(r.tollFee);

        data.chiPhi += tong;
        data.kmPhatSinh += km;
        data.phiVuotKm += phiKm;
        data.thoiGianTangCa += tgOt;
        data.phiTangCa += phiOt;
        data.phiCauDuong += phiCau;
        
        hasData = true;
    });

    const pivotData = Array.from(pivotMap.values());
    renderNcc(pivotData);
`;

code = code.replace(targetLoad, replacementLoad.trim());

const targetRender = code.substring(code.indexOf('function renderNcc(pivotData) {'), code.indexOf('container.innerHTML = html;', code.indexOf('function renderNcc(pivotData) {')) + 27);
const replacementRender = `
function renderNcc(pivotData) {
    const container = document.getElementById('nccTableContainer');
    if(!container) return;

    if(!pivotData || pivotData.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="icon">📭</div><p>Không có dữ liệu NCC</p></div>';
        document.getElementById('nccTotalCost').innerText = '0 đ';
        return;
    }

    let html = \`<table>
        <thead>
            <tr>
                <th>Kho</th>
                <th>NCC</th>
                <th>Biển số xe</th>
                <th style="text-align:right;color:var(--accent);">Tổng chi phí<br>(trước thuế)</th>
                <th style="text-align:right;color:var(--accent);">Số KM phát sinh</th>
                <th style="text-align:right;color:var(--accent);">Phí vượt KM</th>
                <th style="text-align:right;color:var(--accent);">TG tăng ca<br>(h)</th>
                <th style="text-align:right;color:var(--accent);">Phí tăng ca</th>
                <th style="text-align:right;color:var(--accent);">Phí cầu đường</th>
            </tr>
        </thead>
        <tbody>\`;

    let grandTotalCost = 0;
    let minCost = Infinity, maxCost = -Infinity;
    let maxKm = 0, maxPhiVuot = 0, maxTgOt = 0, maxPhiOt = 0, maxPhiCau = 0;

    pivotData.forEach(d => {
        grandTotalCost += d.chiPhi;
        if (d.chiPhi < minCost) minCost = d.chiPhi;
        if (d.chiPhi > maxCost) maxCost = d.chiPhi;
        if (d.kmPhatSinh > maxKm) maxKm = d.kmPhatSinh;
        if (d.phiVuotKm > maxPhiVuot) maxPhiVuot = d.phiVuotKm;
        if (d.thoiGianTangCa > maxTgOt) maxTgOt = d.thoiGianTangCa;
        if (d.phiTangCa > maxPhiOt) maxPhiOt = d.phiTangCa;
        if (d.phiCauDuong > maxPhiCau) maxPhiCau = d.phiCauDuong;
    });

    if (minCost === Infinity) minCost = 0;
    if (maxCost === -Infinity) maxCost = 0;

    function getColor(value, min, max) {
        if (!value || value <= 0) return 'var(--text-muted)';
        if (max <= min) return 'var(--text-primary)';
        let ratio = (value - min) / (max - min);
        const r1 = 20, g1 = 184, b1 = 166;
        const r2 = 239, g2 = 68, b2 = 68;
        const r = Math.round(r1 + (r2 - r1) * ratio);
        const g = Math.round(g1 + (g2 - g1) * ratio);
        const b = Math.round(b1 + (b2 - b1) * ratio);
        return \`rgb(\${r}, \${g}, \${b})\`;
    }

    // Sắp xếp: Kho -> NCC -> Biển số
    pivotData.sort((a, b) => {
        if (a.kho !== b.kho) return a.kho.localeCompare(b.kho);
        if (a.ncc !== b.ncc) return a.ncc.localeCompare(b.ncc);
        return a.bienSo.localeCompare(b.bienSo);
    });

    pivotData.forEach((data, index) => {
        let bg = index % 2 === 0 ? 'background: rgba(255, 255, 255, 0.02);' : 'background: transparent;';
        
        let khoBadge = \`<span style="\${typeof warehouseColor === 'function' ? warehouseColor(shortWarehouse(data.kho)) : ''} padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">\${escapeHtml(data.kho)}</span>\`;

        html += \`
            <tr style="\${bg}">
                <td>\${khoBadge}</td>
                <td style="font-weight:600; color:var(--text-primary);">\${escapeHtml(data.ncc)}</td>
                <td style="font-family:Calibri, sans-serif; font-weight:600; color: var(--text-primary);">\${escapeHtml(data.bienSo)}</td>
                <td style="text-align:right;color:\${getColor(data.chiPhi, minCost, maxCost)};font-weight:600;">\${Math.round(data.chiPhi).toLocaleString('vi-VN')}</td>
                <td style="text-align:right;color:\${getColor(data.kmPhatSinh, 0, maxKm)};font-weight:500;">\${Math.round(data.kmPhatSinh).toLocaleString('vi-VN')}</td>
                <td style="text-align:right;color:\${getColor(data.phiVuotKm, 0, maxPhiVuot)};font-weight:500;">\${Math.round(data.phiVuotKm).toLocaleString('vi-VN')}</td>
                <td style="text-align:right;color:\${getColor(data.thoiGianTangCa, 0, maxTgOt)};font-weight:500;">\${Number(data.thoiGianTangCa.toFixed(2)).toLocaleString('vi-VN')}</td>
                <td style="text-align:right;color:\${getColor(data.phiTangCa, 0, maxPhiOt)};font-weight:500;">\${Math.round(data.phiTangCa).toLocaleString('vi-VN')}</td>
                <td style="text-align:right;color:\${getColor(data.phiCauDuong, 0, maxPhiCau)};font-weight:500;">\${Math.round(data.phiCauDuong).toLocaleString('vi-VN')}</td>
            </tr>
        \`;
    });

    html += \`</tbody></table>\`;
    container.innerHTML = html;
`;

code = code.replace(targetRender, replacementRender.trim());

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Flat rendering applied.');
