import re

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf8') as f:
    content = f.read()

search_str = """          let statusHtml = '';
          if (isGhnOff) {
              statusHtml = '<span style="color:#a78bfa; font-weight:700;">📴 GHN OFF</span>';
          } else if (isNccOff) {
              statusHtml = '<span style="color:#94a3b8; font-weight:700;">📴 NCC OFF</span>';
          } else if (isPhat) {
              statusHtml = '<span style="color:#ef4444; font-weight:700;">🛑 Phạt</span>';
          } else if (hasMatch) {
                const codes = String(r.ghnTripCode).split('|').map(c => c.trim()).filter(c => c);
                ghnHtml = `<div style="display:flex; gap: 6px; align-items:center; flex-wrap:wrap;">`;
                codes.forEach((c, idx) => {
                    ghnHtml += `<a href="https://nhanh.ghn.vn/lastmile/trip-detail/${c}" target="_blank" style="color:var(--success);text-decoration:underline;"><strong>${c}</strong></a>`;
                    if (idx < codes.length - 1) ghnHtml += `<span style="color:#64748b;">|</span>`;
                });
                if (r.isManualMatch) {
                  ghnHtml += `<span class="badge" style="background:rgba(251,191,36,0.15);color:#f59e0b;font-size:10px;padding:2px 4px;border:1px solid rgba(251,191,36,0.3);" title="Được khớp bằng tay">📝 Khớp tay</span>`;
              }
              ghnHtml += `</div>`;
          } else {
              ghnHtml = `<div style="display:flex; gap: 4px; align-items:center;">
                  <input type="text" class="form-control" style="background:#fff3cd; color:#856404; width:75px; font-size:11px; padding: 2px 4px; height: 24px;" placeholder="Nhập mã..." onchange="updateNccTripCode(${r.originalIndex}, this.value)" value="${r.ghnTripCode || ''}">
                  <button class="btn btn-secondary" style="padding: 2px 4px; font-size: 10px; height: 24px; background:#f59e0b; color:#000; border:none; border-radius:4px; cursor:pointer; font-weight:bold;" onclick="showSuggestionPopup(${r.originalIndex}, this)" title="Gợi ý chuyến Lastmile">💡</button>
                  <select class="form-control" style="background:#1e293b; color:#cbd5e1; width:75px; font-size:10px; padding: 0px 2px; height: 24px; border:1px solid #334155; border-radius:4px; cursor:pointer;" onchange="if(this.value) updateNccTripCode(${r.originalIndex}, this.value); this.value='';">
                        <option value="">Trạng thái</option>
                        <option value="GHN OFF">GHN OFF</option>
                        <option value="NCC OFF">NCC OFF</option>
                        <option value="Phạt">Phạt</option>
                    </select>
              </div>`;
          }"""

replace_str = """          let statusHtml = '';
          let ghnHtml = `<div style="display:flex; gap: 4px; align-items:center;">
                  <input type="text" class="form-control" style="background:#fff3cd; color:#856404; width:75px; font-size:11px; padding: 2px 4px; height: 24px;" placeholder="Nhập mã..." onchange="updateNccTripCode(${r.originalIndex}, this.value)" value="${r.ghnTripCode || ''}">
                  <button class="btn btn-secondary" style="padding: 2px 4px; font-size: 10px; height: 24px; background:#f59e0b; color:#000; border:none; border-radius:4px; cursor:pointer; font-weight:bold;" onclick="showSuggestionPopup(${r.originalIndex}, this)" title="Gợi ý chuyến Lastmile">💡</button>
                  <select class="form-control" style="background:#1e293b; color:#cbd5e1; width:75px; font-size:10px; padding: 0px 2px; height: 24px; border:1px solid #334155; border-radius:4px; cursor:pointer;" onchange="if(this.value) updateNccTripCode(${r.originalIndex}, this.value); this.value='';">
                        <option value="">Trạng thái</option>
                        <option value="GHN OFF">GHN OFF</option>
                        <option value="NCC OFF">NCC OFF</option>
                        <option value="Phạt">Phạt</option>
                    </select>
              </div>`;

          if (isGhnOff) {
              statusHtml = '<span style="color:#a78bfa; font-weight:700;">📴 GHN OFF</span>';
          } else if (isNccOff) {
              statusHtml = '<span style="color:#94a3b8; font-weight:700;">📴 NCC OFF</span>';
          } else if (isPhat) {
              statusHtml = '<span style="color:#ef4444; font-weight:700;">🛑 Phạt</span>';
          } else if (hasMatch) {
                const codes = String(r.ghnTripCode).split('|').map(c => c.trim()).filter(c => c);
                ghnHtml = `<div style="display:flex; gap: 6px; align-items:center; flex-wrap:wrap;">`;
                codes.forEach((c, idx) => {
                    ghnHtml += `<a href="https://nhanh.ghn.vn/lastmile/trip-detail/${c}" target="_blank" style="color:var(--success);text-decoration:underline;"><strong>${c}</strong></a>`;
                    if (idx < codes.length - 1) ghnHtml += `<span style="color:#64748b;">|</span>`;
                });
                if (r.isManualMatch) {
                  ghnHtml += `<span class="badge" style="background:rgba(251,191,36,0.15);color:#f59e0b;font-size:10px;padding:2px 4px;border:1px solid rgba(251,191,36,0.3);" title="Được khớp bằng tay">🤲 Khớp tay</span>`;
              }
              ghnHtml += `</div>`;
          }"""

if search_str in content:
    content = content.replace(search_str, replace_str)
    with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf8') as f:
        f.write(content)
    print("Patched!")
else:
    print("Search string not found!")
