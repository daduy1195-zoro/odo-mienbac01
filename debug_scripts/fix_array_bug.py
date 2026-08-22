# -*- coding: utf-8 -*-
with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf-8') as f:
    code = f.read()

import re

search = r"if \(!ghnTripMap\.has\(key\)\) ghnTripMap\.set\(key, \[tripCode\]\);\s*else \{ let arr = ghnTripMap\.get\(key\); if \(!arr\.includes\(tripCode\)\) arr\.push\(tripCode\); \}"

replace = """const codesToAdd = Array.isArray(tripCode) ? tripCode : [tripCode];
                    if (!ghnTripMap.has(key)) ghnTripMap.set(key, [...codesToAdd]);
                    else { let arr = ghnTripMap.get(key); codesToAdd.forEach(c => { if (!arr.includes(c)) arr.push(c); }); }"""

code = re.sub(search, replace, code)

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf-8') as f:
    f.write(code)

print("Done")
