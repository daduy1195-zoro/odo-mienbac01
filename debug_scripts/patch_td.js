const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const tdPatch = `                <td style="font-weight:bold;">\${statusHtml}</td>
                <td style="text-align:center; cursor:pointer;" title="\${r.actionLogs && r.actionLogs.length > 0 ? escapeHtml(r.actionLogs.map(l => l.time + ': ' + l.action + ' - ' + l.details).join('\\n')) : 'Chưa có thao tác nào'}">
                    \${r.actionLogs && r.actionLogs.length > 0 ? '🕒' : '<span style="opacity:0.2">🕒</span>'}
                </td>
                <td><input type="text"`;
code = code.replace(/                <td style="font-weight:bold;">\$\{statusHtml\}<\/td>\r?\n                <td><input type="text"/g, tdPatch);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('TD patched.');
