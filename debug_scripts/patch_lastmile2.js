const fs = require('fs');
let code = fs.readFileSync('C:\\\\Users\\\\MSI\\\\Desktop\\\\AI\\\\Odo\\\\index.html', 'utf8');

const search = "var isMatched = r.tripCode && matchedTripCodes.has(r.tripCode);";
const start = code.indexOf(search);

if (start !== -1) {
    const end = code.indexOf("</td>';", start) + 8;
    const oldBlock = code.substring(start, end);
    console.log("Found:", oldBlock);
    
    const replace = ar isMatched = r.tripCode && matchedTripCodes.has(r.tripCode);
        var isManual = r.tripCode && typeof manualTripCodes !== 'undefined' && manualTripCodes.has(r.tripCode);
        
        let statusHtml = '<span style="color:var(--warning);">⚠️ Chưa ĐS</span>';
        if (isMatched) {
            if (isManual) {
                statusHtml = '<span class="badge" style="background:rgba(251,191,36,0.15);color:#f59e0b;font-size:10px;padding:2px 4px;border:1px solid rgba(251,191,36,0.3);" title="Được khớp bằng tay">🖐️ Khớp tay</span>';
            } else {
                statusHtml = '<span style="color:var(--success);">✅ Đã ĐS</span>';
            }
        }
        html += '<td style="text-align:center;font-weight:bold;">' + statusHtml + '</td>';;
        
    code = code.substring(0, start) + replace + code.substring(end);
    fs.writeFileSync('C:\\\\Users\\\\MSI\\\\Desktop\\\\AI\\\\Odo\\\\index.html', code);
    console.log("Replaced successfully.");
} else {
    console.log("Not found.");
}
