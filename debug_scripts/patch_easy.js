const fs = require('fs');
let code = fs.readFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'utf8');

const targetStr = `let ghnHtml = \`<div style="display:flex; gap: 4px; align-items:center;">
                    <div id="manualInput_\${r.originalIndex}" style="display:none; gap: 4px; align-items:center;">
                        <input type="text" class="form-control" style="background:#fff3cd; color:#856404; width:85px; font-size:11px; padding: 2px 4px; height: 24px;" placeholder="Nhập mã..." onchange="updateNccTripCode(\${r.originalIndex}, this.value)" value="\${r.ghnTripCode || ''}">
                        <button class="btn btn-secondary" style="padding: 2px 4px; font-size: 10px; height: 24px; background:#f59e0b; color:#000; border:none; border-radius:4px; cursor:pointer; font-weight:bold;" onclick="showSuggestionPopup(\${r.originalIndex}, this)" title="Gợi ý chuyến Lastmile">💡</button>
                        <button style="background:transparent;border:none;color:#ef4444;cursor:pointer;font-size:14px;padding:0 2px;" onclick="document.getElementById('manualInput_\${r.originalIndex}').style.display='none'; document.getElementById('statusSelect_\${r.originalIndex}').style.display='block'; this.previousElementSibling.previousElementSibling.value=''; document.getElementById('statusSelect_\${r.originalIndex}').value='';" title="Hủy">✖</button>
                    </div>`;

const replaceStr = `let ghnHtml = \`<div style="display:flex; gap: 4px; align-items:center;">
                    <button class="btn btn-secondary" style="padding: 2px 4px; font-size: 10px; height: 24px; background:#f59e0b; color:#000; border:none; border-radius:4px; cursor:pointer; font-weight:bold;" onclick="showSuggestionPopup(\${r.originalIndex}, this)" title="Gợi ý chuyến Lastmile">💡</button>
                    <div id="manualInput_\${r.originalIndex}" style="display:none; gap: 4px; align-items:center;">
                        <input type="text" class="form-control" style="background:#fff3cd; color:#856404; width:85px; font-size:11px; padding: 2px 4px; height: 24px;" placeholder="Nhập mã..." onchange="updateNccTripCode(\${r.originalIndex}, this.value)" value="\${r.ghnTripCode || ''}">
                        <button style="background:transparent;border:none;color:#ef4444;cursor:pointer;font-size:14px;padding:0 2px;" onclick="document.getElementById('manualInput_\${r.originalIndex}').style.display='none'; document.getElementById('statusSelect_\${r.originalIndex}').style.display='block'; this.previousElementSibling.value=''; document.getElementById('statusSelect_\${r.originalIndex}').value='';" title="Hủy">✖</button>
                    </div>`;

if (code.includes(targetStr)) {
    code = code.replace(targetStr, replaceStr);
    fs.writeFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', code);
    console.log("Patched exact string");
} else {
    console.log("Exact string not found. Trying regex...");
    
    // Normalize newlines to \n and spaces
    let normalizedCode = code.replace(/\r\n/g, '\n');
    let normalizedTarget = targetStr.replace(/\r\n/g, '\n');
    
    if (normalizedCode.includes(normalizedTarget)) {
        normalizedCode = normalizedCode.replace(normalizedTarget, replaceStr.replace(/\r\n/g, '\n'));
        fs.writeFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', normalizedCode);
        console.log("Patched with normalized string");
    } else {
        console.log("Still not found!");
    }
}
