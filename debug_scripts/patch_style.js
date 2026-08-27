const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

// 1. Trạng thái header
code = code.replace(
    '<th style="width: 100px; text-align: center;">Trạng thái</th>',
    '<th style="width: 120px; min-width: 120px; white-space: nowrap; text-align: center;">Trạng thái</th>'
);

// 2. Ghi chú header
code = code.replace(
    '<th style="min-width:150px">Ghi chú</th>',
    '<th style="width:100px">Ghi chú</th>'
);

// 3. Trạng thái body
code = code.replace(
    '<td style="font-weight:bold;">${statusHtml}</td>',
    '<td style="font-weight:bold; white-space: nowrap; text-align: center;">${statusHtml}</td>'
);

// 4. Ghi chú body
code = code.replace(
    'width:150px;" placeholder="Ghi chú..." onchange="updateNccTripNote(${r.originalIndex}, this.value)" value="${escapeHtml(r.note || \'\')}"></td>',
    'width:100px;" title="${escapeHtml(r.note || \'\')}" placeholder="Ghi chú..." onchange="updateNccTripNote(${r.originalIndex}, this.value)" value="${escapeHtml(r.note || \'\')}"></td>'
);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Style updated');
