const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const targetStr = `'<td style="font-family:Calibri, sans-serif; font-weight:600; color: var(--text-primary);">' + escapeHtml(data.bienSo) + '</td>\\n' +`;
const replacementStr = `'<td style="font-family:Calibri, sans-serif; font-weight:700; font-size:15px; letter-spacing: 0.8px; color: var(--text-primary);">' + escapeHtml(data.bienSo) + '</td>\\n' +`;

if (code.includes(targetStr)) {
    code = code.replace(targetStr, replacementStr);
    fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
    console.log('Replaced successfully');
} else {
    console.log('Target string not found');
}
