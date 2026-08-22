# -*- coding: utf-8 -*-
with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf-8') as f:
    code = f.read()

import re

# 1. Add <option value="khop_tay">🖐️ Khớp tay</option> to the filter dropdown
search1 = r'<option value="khop">✅ Đã đối soát</option>\s*<option value="thieu">⚠️ Chưa đối soát</option>'
replace1 = '<option value="khop">✅ Đã đối soát</option>\n                    <option value="khop_tay">🖐️ Khớp tay</option>\n                    <option value="thieu">⚠️ Chưa đối soát</option>'
code = re.sub(search1, replace1, code)

# 2. Update logic in renderLastmile
search2 = r"if \(filterStatus === 'khop' && !isMatched\) continue;\n\s*if \(filterStatus === 'thieu' && isMatched\) continue;"
replace2 = "var isManual = typeof manualTripCodes !== 'undefined' && manualTripCodes.has(row.tripCode);\n            if (filterStatus === 'khop' && !isMatched) continue;\n            if (filterStatus === 'khop_tay' && !isManual) continue;\n            if (filterStatus === 'thieu' && isMatched) continue;"
code = re.sub(search2, replace2, code)

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf-8') as f:
    f.write(code)

print("Done")
