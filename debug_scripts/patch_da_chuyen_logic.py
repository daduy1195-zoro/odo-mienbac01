# -*- coding: utf-8 -*-
with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update filterNccStatus logic
search_ncc_logic = "if (filterStatus === 'phat' && !isPhat) return;"
replace_ncc_logic = "if (filterStatus === 'phat' && !isPhat) return;\n        if (filterStatus === 'da_chuyen' && (!row.ghnTripCode || !String(row.ghnTripCode).includes('|'))) return;"
code = code.replace(search_ncc_logic, replace_ncc_logic)

# 2. Update filterLastmileStatus logic
search_lm_logic = "if (filterStatus === 'thieu' && isMatched) continue;"
replace_lm_logic = "if (filterStatus === 'thieu' && isMatched) continue;\n            if (filterStatus === 'da_chuyen') { let c = (typeof nccTripData !== 'undefined') ? nccTripData.find(x => x.ghnTripCode && String(x.ghnTripCode).includes(row.tripCode) && String(x.ghnTripCode).includes('|')) : null; if (!c) continue; }"
code = code.replace(search_lm_logic, replace_lm_logic)

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf-8') as f:
    f.write(code)

print("Done")
