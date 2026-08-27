const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

// The replacement logic:
const linesToReplace = [
    '<th style="width:60px;">Sửa</th>',
    '<th>Sửa</th>',
    '<th style="width:80px;">Sửa</th>',
    '<th>Chi tiết ngày chưa báo cáo</th>',
    '<th style="min-width:150px">Tuyến đường (Từ - Đến)</th>',
    '<td><a href="${sheetUrl}" target="_blank" style="color:var(--primary);text-decoration:underline;font-size:12px;white-space:nowrap;">Dòng ${e.sheetRow}</a></td>',
    '                            </div>\r\n                            </td>',
    '                            </div>\n                            </td>',
    '<td>${escapeHtml(String(e["Tuyến đường (Từ - Đến)"] || ""))}</td>'
];

let lines = code.split(/\r?\n/);

for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (l === '<th style="width:60px;">Sửa</th>' || l === '<th>Sửa</th>' || l === '<th style="width:80px;">Sửa</th>' || l === '<th>Chi tiết ngày chưa báo cáo</th>' || l === '<th style="min-width:150px">Tuyến đường (Từ - Đến)</th>') {
        lines[i] = lines[i] + '\n<th style="width:40px; text-align:center;" title="Lịch sử thao tác">🕒</th>';
    }
    
    if (l === '<td><a href="${sheetUrl}" target="_blank" style="color:var(--primary);text-decoration:underline;font-size:12px;white-space:nowrap;">Dòng ${e.sheetRow}</a></td>') {
        lines[i] = lines[i] + '\n<td style="text-align:center;"><span style="opacity:0.2">🕒</span></td>';
    }
    
    if (l === '</div>' && lines[i+1].trim() === '</td>' && lines[i+2].trim() === '</tr>`;') {
        lines[i+1] = lines[i+1] + '\n<td style="text-align:center;"><span style="opacity:0.2">🕒</span></td>';
    }
    
    if (l === '<td>${escapeHtml(String(e["Tuyến đường (Từ - Đến)"] || ""))}</td>') {
        lines[i] = lines[i] + '\n<td style="text-align:center;"><span style="opacity:0.2">🕒</span></td>';
    }
}

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', lines.join('\n'));
console.log('Done4');
