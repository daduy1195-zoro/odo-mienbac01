# -*- coding: utf-8 -*-
with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf-8') as f:
    code = f.read()

import re

# Add colKho
search1 = r"let colKmStart = -1, colKmEnd = -1, colKmDiff = -1, colRoute = -1, colDate = 1, colPlate = 2, colVehicle = 3, colNcc = -1;"
replace1 = "let colKmStart = -1, colKmEnd = -1, colKmDiff = -1, colRoute = -1, colDate = 1, colPlate = 2, colVehicle = 3, colNcc = -1, colKho = -1;"
code = code.replace(search1, replace1)

# Scan for Kho
search2 = r"if \(h === 'xe' \|\| h\.includes\('loại xe'\)\) colVehicle = ci;"
replace2 = "if (h === 'xe' || h.includes('loại xe')) colVehicle = ci;\n                  if (h === 'kho' || h.includes('kho trạm') || h.includes('trạm')) colKho = ci;"
code = re.sub(search2, replace2, code)

# Assign warehouse using colKho
search3 = r"const warehouse = inferredWH \|\| '';"
replace3 = "const actualKho = (colKho > -1 && row[colKho]) ? String(row[colKho]).trim() : inferredWH;\n          const warehouse = actualKho || '';"
code = code.replace(search3, replace3)

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf-8') as f:
    f.write(code)

print("Done")
