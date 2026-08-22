import re

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf8') as f:
    content = f.read()

# 1. Add column header
header_search = r'<th style="min-width:200px;">Tuyến đường</th><th style="width:130px; white-space:nowrap;">Đối soát NCC</th>'
header_replace = r'<th style="min-width:200px;">Tuyến đường</th><th style="width:80px; text-align:center;">Chuyến ảo</th><th style="width:130px; white-space:nowrap;">Đối soát NCC</th>'
content = content.replace(header_search, header_replace)

# 2. Extract state in renderLastmile
state_search = r"var manualTripCodes = new Set();"
state_replace = r"""var manualTripCodes = new Set();
      var virtualTrips = {};
      try { virtualTrips = JSON.parse(localStorage.getItem('GHN_VIRTUAL_TRIPS') || '{}'); } catch(e){}"""
content = content.replace(state_search, state_replace)

# 3. Add column data
row_search = r"html += '<td style=\"font-size:12px; max-width:150px; white-space:normal;\">' \+ \(r.route \? escapeHtml\(r.route\) : '<span style=\"color:var\(--text-muted\);\">—</span>'\) \+ '</td>';"
row_replace = r"""html += '<td style="font-size:12px; max-width:150px; white-space:normal;">' + (r.route ? escapeHtml(r.route) : '<span style="color:var(--text-muted);">—</span>') + '</td>';
          
          let isVirtual = r.tripCode && virtualTrips[r.tripCode];
          html += '<td style="text-align:center;"><input type="checkbox" ' + (isVirtual ? 'checked' : '') + ' onchange="toggleVirtualTrip(\'' + r.tripCode + '\', this.checked)" style="cursor:pointer; width:16px; height:16px;"></td>';"""
content = re.sub(row_search, row_replace, content)

# 4. Add the toggle function
func_injection = r"""
  window.toggleVirtualTrip = function(tripCode, isChecked) {
      if (!tripCode) return;
      try {
          var virtuals = JSON.parse(localStorage.getItem('GHN_VIRTUAL_TRIPS') || '{}');
          if (isChecked) virtuals[tripCode] = true;
          else delete virtuals[tripCode];
          localStorage.setItem('GHN_VIRTUAL_TRIPS', JSON.stringify(virtuals));
          showToast('success', (isChecked ? 'Đã đánh dấu chuyến ảo: ' : 'Đã bỏ chuyến ảo: ') + tripCode);
      } catch(e) {
          console.error('Error saving virtual trip:', e);
      }
  };
"""
if "window.toggleVirtualTrip" not in content:
    content = content.replace("function renderLastmile() {", func_injection + "\n  function renderLastmile() {")

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf8') as f:
    f.write(content)

print("Patched!")
