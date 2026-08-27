const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');
let lines = code.split('\n');

for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (l === '<th style="min-width:150px">Tuyến đường (Từ - Đến)</th>') {
        lines[i] = lines[i] + '\n<th style="width:40px; text-align:center;" title="Lịch sử thao tác">🕒</th>';
    }
    
    if (l === '<td>${escapeHtml(String(e["Tuyến đường (Từ - Đến)"] || ""))}</td>') {
        lines[i] = lines[i] + '\n<td style="text-align:center;"><span style="opacity:0.2">🕒</span></td>';
    }
}

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', lines.join('\n'));
console.log('Lastmile updated');
