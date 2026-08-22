# -*- coding: utf-8 -*-
with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf-8') as f:
    code = f.read()

import re

search1 = r"var matchedTripCodes = new Set\(\);\n\s*var tripNccMap = new Map\(\);"
replace1 = "var matchedTripCodes = new Set();\n      var manualTripCodes = new Set();\n      var tripNccMap = new Map();"
code = re.sub(search1, replace1, code)

search2 = r"matchedTripCodes\.add\(nccTripData\[n\]\.ghnTripCode\);\n\s*tripNccMap\.set\(nccTripData\[n\]\.ghnTripCode, nccTripData\[n\]\.ncc\);"
replace2 = "matchedTripCodes.add(nccTripData[n].ghnTripCode);\n                      tripNccMap.set(nccTripData[n].ghnTripCode, nccTripData[n].ncc);\n                      if (nccTripData[n].isManualMatch) manualTripCodes.add(nccTripData[n].ghnTripCode);"
code = re.sub(search2, replace2, code)

search3 = r"var isMatched = r\.tripCode && matchedTripCodes\.has\(r\.tripCode\);\n\s*html \+= '<td style=\"text-align:center;font-weight:bold;\">' \+ \(isMatched \? '<span style=\"color:var\(--success\);\">✅ Đã ĐS</span>' : '<span style=\"color:var\(--warning\);\">⚠️ Chưa ĐS</span>'\) \+ '</td>';"
replace3 = """var isMatched = r.tripCode && matchedTripCodes.has(r.tripCode);
          var isManual = r.tripCode && typeof manualTripCodes !== 'undefined' && manualTripCodes.has(r.tripCode);
          let statusHtml = '<span style="color:var(--warning);">⚠️ Chưa ĐS</span>';
          if (isMatched) {
              if (isManual) {
                  statusHtml = '<span class="badge" style="background:rgba(251,191,36,0.15);color:#f59e0b;font-size:10px;padding:2px 4px;border:1px solid rgba(251,191,36,0.3);" title="Được khớp bằng tay">🖐️ Khớp tay</span>';
              } else {
                  statusHtml = '<span style="color:var(--success);">✅ Đã ĐS</span>';
              }
          }
          html += '<td style="text-align:center;font-weight:bold;">' + statusHtml + '</td>';"""
code = code.replace("var isMatched = r.tripCode && matchedTripCodes.has(r.tripCode);\n          html += '<td style=\"text-align:center;font-weight:bold;\">' + (isMatched ? '<span style=\"color:var(--success);\">✅ Đã ĐS</span>' : '<span style=\"color:var(--warning);\">⚠️ Chưa ĐS</span>') + '</td>';", replace3)


with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf-8') as f:
    f.write(code)

print("Done")
