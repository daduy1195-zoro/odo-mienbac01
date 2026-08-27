const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const regex = /escapeHtml\(r\.actionLogs\.map\(l => l\.time \+ ': ' \+ l\.action \+ ' - ' \+ l\.details\)\.join\('\\n'\)\)/g;
const replacement = "escapeHtml(r.actionLogs.map(l => l.time + ' (' + (l.user||'Ẩn danh') + '): ' + l.action + ' - ' + l.details).join('\\n'))";

code = code.replace(regex, replacement);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Tooltip patched.');
