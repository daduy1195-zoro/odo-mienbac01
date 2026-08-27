const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

let lines = code.split('\n');
let newLines = [];
for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    // Remove the newly added header and body cell lines, EXCEPT for the Lastmile table!
    // But how to distinguish Lastmile from others?
    // Lastmile header was added after '<th style="min-width:150px">Tuyến đường (Từ - Đến)</th>'
    // Lastmile body was added after '<td>${escapeHtml(String(e["Tuyến đường (Từ - Đến)"] || ""))}</td>'
    // Let's just remove ALL dummy 🕒 and then add back to Lastmile? No, Lastmile has opacity:0.2.
    // Wait, the action log column in "Ghép chuyến đi NCC" is NOT dummy, it has real action logs.
    // The dummy ones have opacity:0.2 or title="Lịch sử thao tác".
    
    // We only want to remove it from ODO, Unreported, Warning, WarningKm.
    // We just remove the lines that are exactly `<th style="width:40px; text-align:center;" title="Lịch sử thao tác">🕒</th>`
    // OR `<td style="text-align:center;"><span style="opacity:0.2">🕒</span></td>`
    // EXCEPT if they follow Lastmile elements.
    
    if (l.trim() === '<th style="width:40px; text-align:center;" title="Lịch sử thao tác">🕒</th>') {
        const prev = lines[i-1].trim();
        // Keep if it's after Lastmile header, or if it's the real one in NCC Trip
        if (prev !== '<th style="min-width:150px">Tuyến đường (Từ - Đến)</th>' && prev !== '<th style="min-width:150px">Ghi chú</th>') {
            continue; // skip this line
        }
    }
    
    if (l.trim() === '<td style="text-align:center;"><span style="opacity:0.2">🕒</span></td>') {
        const prev = lines[i-1].trim();
        // Keep if it's after Lastmile body
        if (prev !== '<td>${escapeHtml(String(e["Tuyến đường (Từ - Đến)"] || ""))}</td>') {
            continue; // skip this line
        }
    }
    
    newLines.push(l);
}

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', newLines.join('\n'));
console.log('Undo done 2');
