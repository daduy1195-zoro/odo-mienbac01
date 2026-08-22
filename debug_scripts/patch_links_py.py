# -*- coding: utf-8 -*-
with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf-8') as f:
    code = f.read()

import re

search = r"\} else if \(hasMatch\) \{\s*ghnHtml = <div style=\"display:flex; gap: 6px; align-items:center;\">\s*<a href=\"https://nhanh\.ghn\.vn/lastmile/trip-detail/\$\{r\.ghnTripCode\}\" target=\"_blank\" style=\"color:var\(--success\);text-decoration:underline;\"><strong>\$\{r\.ghnTripCode\}</strong></a>;\s*if \(r\.isManualMatch\) \{"

replace = r"""} else if (hasMatch) {
              const codes = String(r.ghnTripCode).split('|').map(c => c.trim()).filter(c => c);
              ghnHtml = <div style="display:flex; gap: 6px; align-items:center; flex-wrap:wrap;">;
              codes.forEach((c, idx) => {
                  ghnHtml += <a href="https://nhanh.ghn.vn/lastmile/trip-detail/" target="_blank" style="color:var(--success);text-decoration:underline;"><strong></strong></a>;
                  if (idx < codes.length - 1) ghnHtml += <span style="color:#64748b;">|</span>;
              });
              if (r.isManualMatch) {"""

if re.search(search, code):
    code = re.sub(search, replace, code)
    with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Success")
else:
    print("Not found")
