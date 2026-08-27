const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

// 1. Update filter logic
code = code.replace(
    /if \(filterStatus === 'thieu' && isMatched\) continue;/g,
    "if (filterStatus === 'thieu' && (isMatched || isVirtualTrip)) continue;"
);

// 2. Update statusHtml logic
const oldStatusHtmlStr = `        let statusHtml = '<span style="color:var(--warning);">⚠️ Chưa ĐS</span>';
        if (isMatched) {
            const nccIdx = typeof tripToNccIndex !== 'undefined' ? tripToNccIndex.get(r.tripCode) : null;
            let unmatchBtn = '';
            if (nccIdx !== null && nccIdx !== undefined) {
                unmatchBtn = \` <span style="color:var(--danger); cursor:pointer; padding:0 4px; font-weight:bold; user-select:none;" onclick="unmatchFromLastmile(\${nccIdx}, '\${r.tripCode}')" title="Gỡ đối soát">✖ </span>\`;
            }
            if (isManual) {
                statusHtml = \`<div style="display:flex;align-items:center;justify-content:center;gap:4px;"><span class="badge" style="background:rgba(251,191,36,0.15);color:#f59e0b;font-size:10px;padding:2px 4px;border:1px solid rgba(251,191,36,0.3);" title="Được khớp bằng tay">🤝 Khớp tay</span>\${unmatchBtn}</div>\`;
            } else {
                statusHtml = \`<div style="display:flex;align-items:center;justify-content:center;gap:4px;"><span style="color:var(--success);">✅ Đã ĐS</span>\${unmatchBtn}</div>\`;
            }
        }`;

const newStatusHtmlStr = `        let statusHtml = '<span style="color:var(--warning);">⚠️ Chưa ĐS</span>';
        if (isMatched) {
            const nccIdx = typeof tripToNccIndex !== 'undefined' ? tripToNccIndex.get(r.tripCode) : null;
            let unmatchBtn = '';
            if (nccIdx !== null && nccIdx !== undefined) {
                unmatchBtn = \` <span style="color:var(--danger); cursor:pointer; padding:0 4px; font-weight:bold; user-select:none;" onclick="unmatchFromLastmile(\${nccIdx}, '\${r.tripCode}')" title="Gỡ đối soát">✖ </span>\`;
            }
            if (isManual) {
                statusHtml = \`<div style="display:flex;align-items:center;justify-content:center;gap:4px;"><span class="badge" style="background:rgba(251,191,36,0.15);color:#f59e0b;font-size:10px;padding:2px 4px;border:1px solid rgba(251,191,36,0.3);" title="Được khớp bằng tay">🤝 Khớp tay</span>\${unmatchBtn}</div>\`;
            } else {
                statusHtml = \`<div style="display:flex;align-items:center;justify-content:center;gap:4px;"><span style="color:var(--success);">✅ Đã ĐS</span>\${unmatchBtn}</div>\`;
            }
        } else if (isVirtualTrip) {
            statusHtml = '<span style="color:#a78bfa; font-weight:700;">👻 Chuyến ảo</span>';
        }`;

let normalizedCode = code.replace(/\r\n/g, '\n');
let normalizedOld = oldStatusHtmlStr.replace(/\r\n/g, '\n');

if (normalizedCode.includes(normalizedOld)) {
    normalizedCode = normalizedCode.replace(normalizedOld, newStatusHtmlStr);
    console.log("Status HTML updated successfully.");
} else {
    console.log("Could not find status HTML block.");
}

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', normalizedCode);
