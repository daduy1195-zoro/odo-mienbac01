# -*- coding: utf-8 -*-
with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf-8') as f:
    code = f.read()

import re

# 1. Update matchedTripCodes loop in renderLastmile
search1 = r"matchedTripCodes\.add\(nccTripData\[n\]\.ghnTripCode\);\s*tripNccMap\.set\(nccTripData\[n\]\.ghnTripCode, nccTripData\[n\]\.ncc\);\s*if \(nccTripData\[n\]\.isManualMatch\) manualTripCodes\.add\(nccTripData\[n\]\.ghnTripCode\);"
replace1 = "const codes = String(nccTripData[n].ghnTripCode).split('|').map(x => x.trim()).filter(x => x);\n                      codes.forEach(c => {\n                          matchedTripCodes.add(c);\n                          tripNccMap.set(c, nccTripData[n].ncc);\n                          if (nccTripData[n].isManualMatch) manualTripCodes.add(c);\n                      });"
code = re.sub(search1, replace1, code)

# 2. Update links in renderNccTrip
search2 = r"ghnHtml = <div style=\"display:flex; gap: 6px; align-items:center;\">\n\s*<a href=\"https://nhanh\.ghn\.vn/lastmile/trip-detail/\$\{r\.ghnTripCode\}\" target=\"_blank\" style=\"color:var\(--success\);text-decoration:underline;\"><strong>\$\{r\.ghnTripCode\}</strong></a>;"
replace2 = """const codes = r.ghnTripCode.split('|').map(c => c.trim()).filter(c => c);
              ghnHtml = <div style="display:flex; gap: 6px; align-items:center; flex-wrap:wrap;">;
              codes.forEach((c, idx) => {
                  ghnHtml += <a href="https://nhanh.ghn.vn/lastmile/trip-detail/" target="_blank" style="color:var(--success);text-decoration:underline;"><strong></strong></a>;
                  if (idx < codes.length - 1) ghnHtml += <span style="color:#64748b;">|</span>;
              });"""
code = code.replace(search2, replace2)
code = re.sub(r"ghnHtml = <div style=\"display:flex; gap: 6px; align-items:center;\">\\s*<a href=\"https://nhanh\.ghn\.vn/lastmile/trip-detail/\$\{r\.ghnTripCode\}\" target=\"_blank\" style=\"color:var\(--success\);text-decoration:underline;\"><strong>\$\{r\.ghnTripCode\}</strong></a>;", replace2, code)


with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf-8') as f:
    f.write(code)

print("Done part 1")
