const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');
const lines = code.split('\n');

for (let i = 0; i < lines.length; i++) {
    // 1. renderTable headers
    if (lines[i].includes('<th style="width:60px;">Sửa</th>') && lines[i+1].includes('</tr>')) {
        lines[i] = lines[i] + '\n<th style="width:40px; text-align:center;" title="Lịch sử thao tác">🕒</th>';
    }
    // 1. renderTable + renderWarning + renderWarningKm body
    if (lines[i].includes('>Dòng ${e.sheetRow}</a></td>') && lines[i+1].includes('</tr>`;')) {
        lines[i] = lines[i] + '\n<td style="text-align:center;"><span style="opacity:0.2">🕒</span></td>';
    }
    
    // 2. renderUnreported headers
    if (lines[i].includes('<th>Chi tiết ngày chưa báo cáo</th>') && lines[i+1].includes('</tr>')) {
        lines[i] = lines[i] + '\n<th style="width:40px; text-align:center;" title="Lịch sử thao tác">🕒</th>';
    }
    // 2. renderUnreported body
    if (lines[i].includes('</div>') && lines[i+1].includes('</td>') && lines[i+2].includes('</tr>`;')) {
        lines[i+1] = lines[i+1] + '\n<td style="text-align:center;"><span style="opacity:0.2">🕒</span></td>';
    }
    
    // 3. renderLastmile headers
    if (lines[i].includes('<th style="min-width:150px">Tuyến đường (Từ - Đến)</th>') && lines[i+1].includes('</tr>')) {
        lines[i] = lines[i] + '\n<th style="width:40px; text-align:center;" title="Lịch sử thao tác">🕒</th>';
    }
    // 3. renderLastmile body
    if (lines[i].includes('<td>${escapeHtml(String(e["Tuyến đường (Từ - Đến)"] || ""))}</td>') && lines[i+1].includes('</tr>`;')) {
        lines[i] = lines[i] + '\n<td style="text-align:center;"><span style="opacity:0.2">🕒</span></td>';
    }
}

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', lines.join('\n'));
console.log('Done3');
