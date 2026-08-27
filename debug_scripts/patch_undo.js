const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');
let lines = code.split('\n');

for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    
    // 1. renderTable (Bảng theo dõi NV báo cáo ODO)
    if (l.includes('<th style="width:60px;">Sửa</th><th style="width:40px; text-align:center;" title="Lịch sử thao tác">🕒</th>')) {
        lines[i] = l.replace('<th style="width:60px;">Sửa</th><th style="width:40px; text-align:center;" title="Lịch sử thao tác">🕒</th>', '<th style="width:60px;">Sửa</th>');
    }
    
    // 2. renderUnreported (Danh sách NV chưa báo cáo)
    if (l.includes('<th>Chi tiết ngày chưa báo cáo</th><th style="width:40px; text-align:center;" title="Lịch sử thao tác">🕒</th>')) {
        lines[i] = l.replace('<th>Chi tiết ngày chưa báo cáo</th><th style="width:40px; text-align:center;" title="Lịch sử thao tác">🕒</th>', '<th>Chi tiết ngày chưa báo cáo</th>');
    }
    
    // 4. & 5. renderWarning and renderWarningKm
    if (l.includes('<th>Sửa</th><th style="width:40px; text-align:center;" title="Lịch sử thao tác">🕒</th>')) {
        lines[i] = l.replace('<th>Sửa</th><th style="width:40px; text-align:center;" title="Lịch sử thao tác">🕒</th>', '<th>Sửa</th>');
    }
    if (l.includes('<th style="width:80px;">Sửa</th><th style="width:40px; text-align:center;" title="Lịch sử thao tác">🕒</th>')) {
        lines[i] = l.replace('<th style="width:80px;">Sửa</th><th style="width:40px; text-align:center;" title="Lịch sử thao tác">🕒</th>', '<th style="width:80px;">Sửa</th>');
    }

    // Body rows
    if (l.includes('>Dòng ${e.sheetRow}</a></td><td style="text-align:center;"><span style="opacity:0.2">🕒</span></td>')) {
        lines[i] = l.replace('>Dòng ${e.sheetRow}</a></td><td style="text-align:center;"><span style="opacity:0.2">🕒</span></td>', '>Dòng ${e.sheetRow}</a></td>');
    }
    
    if (l.trim() === '</td><td style="text-align:center;"><span style="opacity:0.2">🕒</span></td>' && lines[i+1].trim() === '</tr>`;') {
        lines[i] = l.replace('</td><td style="text-align:center;"><span style="opacity:0.2">🕒</span></td>', '</td>');
    }
}

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', lines.join('\n'));
console.log('Undo done');
