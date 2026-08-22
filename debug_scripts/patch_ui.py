import re

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf8') as f:
    content = f.read()

search = """                  <input type="text" class="form-control" style="background:#fff3cd; color:#856404; width:75px; font-size:11px; padding: 2px 4px; height: 24px;" placeholder="Nhập mã..." onchange="updateNccTripCode(${r.originalIndex}, this.value)" value="${r.ghnTripCode || ''}">
                  <button class="btn btn-secondary" style="padding: 2px 4px; font-size: 10px; height: 24px; background:#f59e0b; color:#000; border:none; border-radius:4px; cursor:pointer; font-weight:bold;" onclick="showSuggestionPopup(${r.originalIndex}, this)" title="Gợi ý chuyến Lastmile">💡</button>
                  <select class="form-control" style="background:#1e293b; color:#cbd5e1; width:75px; font-size:10px; padding: 0px 2px; height: 24px; border:1px solid #334155; border-radius:4px; cursor:pointer;" onchange="if(this.value) updateNccTripCode(${r.originalIndex}, this.value); this.value='';">
                        <option value="">Trạng thái</option>
                        <option value="GHN OFF">GHN OFF</option>
                        <option value="NCC OFF">NCC OFF</option>
                        <option value="Phạt">Phạt</option>
                    </select>"""

replace = """                  <div id="manualInput_${r.originalIndex}" style="display:none; gap: 4px; align-items:center;">
                      <input type="text" class="form-control" style="background:#fff3cd; color:#856404; width:85px; font-size:11px; padding: 2px 4px; height: 24px;" placeholder="Nhập mã..." onchange="updateNccTripCode(${r.originalIndex}, this.value)" value="${r.ghnTripCode || ''}">
                      <button class="btn btn-secondary" style="padding: 2px 4px; font-size: 10px; height: 24px; background:#f59e0b; color:#000; border:none; border-radius:4px; cursor:pointer; font-weight:bold;" onclick="showSuggestionPopup(${r.originalIndex}, this)" title="Gợi ý chuyến Lastmile">💡</button>
                      <button style="background:transparent;border:none;color:#ef4444;cursor:pointer;font-size:14px;padding:0 2px;" onclick="document.getElementById('manualInput_${r.originalIndex}').style.display='none'; document.getElementById('statusSelect_${r.originalIndex}').style.display='block'; this.previousElementSibling.previousElementSibling.value=''; document.getElementById('statusSelect_${r.originalIndex}').value='';" title="Hủy">×</button>
                  </div>
                  <select id="statusSelect_${r.originalIndex}" class="form-control" style="background:#1e293b; color:#cbd5e1; width:105px; font-size:11px; padding: 0px 4px; height: 24px; border:1px solid #334155; border-radius:4px; cursor:pointer;" onchange="if(this.value === 'MANUAL') { this.style.display='none'; document.getElementById('manualInput_${r.originalIndex}').style.display='flex'; } else if (this.value) { updateNccTripCode(${r.originalIndex}, this.value); }">
                        <option value="">Trạng thái</option>
                        <option value="MANUAL">✏️ Nhập mã...</option>
                        <option value="GHN OFF">GHN OFF</option>
                        <option value="NCC OFF">NCC OFF</option>
                        <option value="Phạt">Phạt</option>
                    </select>"""

if search in content:
    content = content.replace(search, replace)
    with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf8') as f:
        f.write(content)
    print("Patched UI successfully!")
else:
    print("Not found!")
