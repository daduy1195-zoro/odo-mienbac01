import re

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf8') as f:
    content = f.read()

lines = content.split('\n')
for i in range(len(lines)):
    if 'let statusHtml = \'\';' in lines[i]:
        lines[i] = """          let statusHtml = '';
          let ghnHtml = `<div style="display:flex; gap: 4px; align-items:center;">
                  <input type="text" class="form-control" style="background:#fff3cd; color:#856404; width:75px; font-size:11px; padding: 2px 4px; height: 24px;" placeholder="Nhập mã..." onchange="updateNccTripCode(${r.originalIndex}, this.value)" value="${r.ghnTripCode || ''}">
                  <button class="btn btn-secondary" style="padding: 2px 4px; font-size: 10px; height: 24px; background:#f59e0b; color:#000; border:none; border-radius:4px; cursor:pointer; font-weight:bold;" onclick="showSuggestionPopup(${r.originalIndex}, this)" title="Gợi ý chuyến Lastmile">💡</button>
                  <select class="form-control" style="background:#1e293b; color:#cbd5e1; width:75px; font-size:10px; padding: 0px 2px; height: 24px; border:1px solid #334155; border-radius:4px; cursor:pointer;" onchange="if(this.value) updateNccTripCode(${r.originalIndex}, this.value); this.value='';">
                        <option value="">Trạng thái</option>
                        <option value="GHN OFF">GHN OFF</option>
                        <option value="NCC OFF">NCC OFF</option>
                        <option value="Phạt">Phạt</option>
                    </select>
              </div>`;"""
        break

# Then remove the `else { ghnHtml = ... }` block
for i in range(len(lines)):
    if '} else {' in lines[i] and 'ghnHtml = `<div style="display:flex; gap: 4px; align-items:center;">' in lines[i+1]:
        # found the else block
        for j in range(i, i+15):
            if '</div>`;' in lines[j] and '}' in lines[j+1]:
                # replace lines[i] to lines[j+1] with empty string
                for k in range(i, j+2):
                    lines[k] = ""
                break
        break

content = '\n'.join(lines)
with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf8') as f:
    f.write(content)
print("Patched!")
