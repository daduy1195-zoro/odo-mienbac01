const fs = require('fs');
const lines = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8').split('\n');
const idx = lines.findIndex(l => l.includes('let ghnHtml = `<div style="display:flex; gap: 4px; align-items:center;">'));

const replaceLines = [
'          let ghnHtml = `<div style="display:flex; gap: 4px; align-items:center;">',
'                  <button class="btn btn-secondary" style="padding: 2px 4px; font-size: 10px; height: 24px; background:#f59e0b; color:#000; border:none; border-radius:4px; cursor:pointer; font-weight:bold;" onclick="showSuggestionPopup(${r.originalIndex}, this)" title="Gợi ý chuyến Lastmile">💡</button>',
'                  <div id="manualInput_${r.originalIndex}" style="display:none; gap: 4px; align-items:center;">',
'                      <input type="text" class="form-control" style="background:#fff3cd; color:#856404; width:85px; font-size:11px; padding: 2px 4px; height: 24px;" placeholder="Nhập mã..." onchange="updateNccTripCode(${r.originalIndex}, this.value)" value="${r.ghnTripCode || \'\'}">',
'                      <button style="background:transparent;border:none;color:#ef4444;cursor:pointer;font-size:14px;padding:0 2px;" onclick="document.getElementById(\'manualInput_${r.originalIndex}\').style.display=\'none\'; document.getElementById(\'statusSelect_${r.originalIndex}\').style.display=\'block\'; this.previousElementSibling.value=\'\'; document.getElementById(\'statusSelect_${r.originalIndex}\').value=\'\';" title="Hủy">✖</button>',
'                  </div>',
'                  <select id="statusSelect_${r.originalIndex}" class="form-control" style="background:#1e293b; color:#cbd5e1; width:105px; font-size:11px; padding: 0px 4px; height: 24px; border:1px solid #334155; border-radius:4px; cursor:pointer;" onchange="if(this.value === \'MANUAL\') { this.style.display=\'none\'; document.getElementById(\'manualInput_${r.originalIndex}\').style.display=\'flex\'; } else { updateNccTripCode(${r.originalIndex}, this.value); }">',
'                        <option value="">Trạng thái</option>',
'                        <option value="MANUAL">✏️ Nhập mã...</option>',
'                        <option value="GHN OFF" ${isGhnOff ? \'selected\' : \'\'}>GHN OFF</option>',
'                        <option value="NCC OFF" ${isNccOff ? \'selected\' : \'\'}>NCC OFF</option>',
'                        <option value="Phạt" ${isPhat ? \'selected\' : \'\'}>Phạt</option>',
'                    </select>',
'              </div>`;'
];

lines.splice(idx, 14, ...replaceLines);
fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', lines.join('\n'));
console.log('Patched with splice!');
