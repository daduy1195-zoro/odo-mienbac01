const fs = require('fs');
let code = fs.readFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'utf8');

const s5 = `        var isMatched = r.tripCode && matchedTripCodes.has(r.tripCode);
        var isManual = r.tripCode && typeof manualTripCodes !== 'undefined' && manualTripCodes.has(r.tripCode);
        
        let statusHtml = '<span style="color:var(--warning);">⚠️ Chưa ĐS</span>';
        if (isMatched) {
            if (isManual) {
                statusHtml = '<span class="badge" style="background:rgba(251,191,36,0.15);color:#f59e0b;font-size:10px;padding:2px 4px;border:1px solid rgba(251,191,36,0.3);" title="Được khớp bằng tay">🤲 Khớp tay</span>';
            } else {
                statusHtml = '<span style="color:var(--success);">✅ Đã ĐS</span>';
            }
        }`;

const r5 = `        var isMatched = r.tripCode && matchedTripCodes.has(r.tripCode);
        var isManual = r.tripCode && typeof manualTripCodes !== 'undefined' && manualTripCodes.has(r.tripCode);
        
        let statusHtml = '<span style="color:var(--warning);">⚠️ Chưa ĐS</span>';
        if (isMatched) {
            const nccIdx = typeof tripToNccIndex !== 'undefined' ? tripToNccIndex.get(r.tripCode) : null;
            let unmatchBtn = '';
            if (nccIdx !== null && nccIdx !== undefined) {
                unmatchBtn = \` <span style="color:var(--danger); cursor:pointer; padding:0 4px; font-weight:bold; user-select:none;" onclick="unmatchFromLastmile(\${nccIdx}, '\${r.tripCode}')" title="Gỡ đối soát">✕</span>\`;
            }
            if (isManual) {
                statusHtml = \`<div style="display:flex;align-items:center;justify-content:center;gap:4px;"><span class="badge" style="background:rgba(251,191,36,0.15);color:#f59e0b;font-size:10px;padding:2px 4px;border:1px solid rgba(251,191,36,0.3);" title="Được khớp bằng tay">🤲 Khớp tay</span>\${unmatchBtn}</div>\`;
            } else {
                statusHtml = \`<div style="display:flex;align-items:center;justify-content:center;gap:4px;"><span style="color:var(--success);">✅ Đã ĐS</span>\${unmatchBtn}</div>\`;
            }
        }`;

code = code.replace(s5, r5);
if (code.indexOf('unmatchFromLastmile(${nccIdx}') === -1) {
    // try to match with regex
    code = code.replace(/let statusHtml = '<span[^>]+>.*?Chưa ĐS<\/span>';\s*if \(isMatched\) \{\s*if \(isManual\) \{\s*statusHtml = '<span[^>]+>.*?Khớp tay<\/span>';\s*\} else \{\s*statusHtml = '<span[^>]+>.*?Đã ĐS<\/span>';\s*\}\s*\}/, r5);
}
fs.writeFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', code);
