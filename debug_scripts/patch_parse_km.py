# -*- coding: utf-8 -*-
with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf-8') as f:
    code = f.read()

import re

# 1. Add colKmOver
search_cols = r"let colOtHours = -1, colOtRate = -1, colOtFee = -1, colKmOverFee = -1"
replace_cols = "let colOtHours = -1, colOtRate = -1, colOtFee = -1, colKmOver = -1, colKmOverFee = -1"
code = code.replace(search_cols, replace_cols)

# 2. Add header scan for colKmOver
search_hdr = r"if \(h\.includes\('phí vượt km'\) \|\| h\.includes\('phí vượt'\) \|\| h\.includes\('tiền vượt km'\)\) colKmOverFee = ci;"
replace_hdr = search_hdr + "\n                if (h.includes('số km phát sinh tăng') || h.includes('km phát sinh tăng')) colKmOver = ci;"
code = code.replace(search_hdr, replace_hdr)

# 3. Extract kmOver
search_extract = r"let kmOverFee = \(colKmOverFee > -1 \? row\[colKmOverFee\] : ''\)\.toString\(\)\.trim\(\);"
replace_extract = "let kmOver = (colKmOver > -1 ? row[colKmOver] : '').toString().trim();\n        " + search_extract
code = code.replace(search_extract, replace_extract)

# 4. Push kmOver
search_push = r"kmOverFee, monthlyRate, dailyRate,"
replace_push = "kmOver, kmOverFee, monthlyRate, dailyRate,"
code = code.replace(search_push, replace_push)

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf-8') as f:
    f.write(code)

print("Done part 2")
