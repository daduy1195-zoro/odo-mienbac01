const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

// Replace in renderNccTrip
code = code.replace(/<th style="text-align:right; color:#fbbf24;">Tổng chi phí<\/th>/g, '<th style="text-align:right; color:var(--accent);">Tổng chi phí</th>');
code = code.replace(/<td style="text-align:right; font-family:Calibri, sans-serif; font-weight:bold; color:#fbbf24;">\$\{formatMoneyCell\(r\.totalCost\)\}<\/td>/g, '<td style="text-align:right; font-family:Calibri, sans-serif; font-weight:bold; color:var(--text-primary);">${formatMoneyCell(r.totalCost)}</td>');

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Colors patched for nccTrip.');
