const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const thPatch = `    html += '</select>';
    html += '</th>';
    html += '<th style="width:40px; text-align:center;" title="Lịch sử thao tác">🕒</th>';
    html += '<th style="min-width:150px">Ghi chú</th>';`;
code = code.replace(/    html \+= '<\/select>';\r?\n    html \+= '<\/th>';\r?\n    html \+= '<th style="min-width:150px">Ghi chú<\/th>';/g, thPatch);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Headers patched.');
