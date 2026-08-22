# -*- coding: utf-8 -*-
with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf-8') as f:
    code = f.read()

import re

# 1. Update filterNccStatus options (main select)
search_ncc_select = r"(<option value=\"khop_tay\">[^<]+</option>)"
replace_ncc_select = r"\1\n                    <option value=\"da_chuyen\">🔄 Đa chuyến</option>"
code = re.sub(search_ncc_select, replace_ncc_select, code, count=1)

# 2. Update inline filterNccStatus options (th select)
search_th_select = r"(<option value=\"khop_tay\" style=\"color: #000;\" ' \+ \(filterStatus === 'khop_tay' \? 'selected' : ''\) \+ '>[^<]+</option>';)"
replace_th_select = r"\1\n    html += '<option value=\"da_chuyen\" style=\"color: #000;\" ' + (filterStatus === 'da_chuyen' ? 'selected' : '') + '>🔄 Đa chuyến</option>';"
code = re.sub(search_th_select, replace_th_select, code)

# 3. Update filterNccStatus logic
search_ncc_logic = r"if \(filterStatus === 'phat' && !isPhat\) return;"
replace_ncc_logic = "if (filterStatus === 'phat' && !isPhat) return;\n        if (filterStatus === 'da_chuyen' && (!row.ghnTripCode || !String(row.ghnTripCode).includes('|'))) return;"
code = code.replace(search_ncc_logic, replace_ncc_logic)

# 4. Update filterLastmileStatus options (main select)
search_lm_select = r"(<option value=\"khop_tay\">[^<]+</option>)"
replace_lm_select = r"\1\n                    <option value=\"da_chuyen\">🔄 Đa chuyến</option>"
code = re.sub(search_lm_select, replace_lm_select, code, count=1)

# 5. Update filterLastmileStatus logic
search_lm_logic = r"if \(filterStatus === 'thieu' && isMatched\) continue;"
replace_lm_logic = "if (filterStatus === 'thieu' && isMatched) continue;\n            if (filterStatus === 'da_chuyen') { let c = (typeof nccTripData !== 'undefined') ? nccTripData.find(x => x.ghnTripCode && x.ghnTripCode.includes(row.tripCode) && x.ghnTripCode.includes('|')) : null; if (!c) continue; }"
code = code.replace(search_lm_logic, replace_lm_logic)

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf-8') as f:
    f.write(code)

print("Done filter patch")
