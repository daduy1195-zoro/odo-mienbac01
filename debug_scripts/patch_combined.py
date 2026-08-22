# -*- coding: utf-8 -*-
with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf-8') as f:
    code = f.read()

import re

# 1. Update NCC_TRIP_SHEETS to include the new sheet for 26/06 - 25/07
search_ncc_trip_sheets = r"NCC_TRIP_SHEETS:\s*\[\s*\{"
replace_ncc_trip_sheets = "NCC_TRIP_SHEETS: [\n        { id: '1jFaJutdZD8uhBYa9Hy9fH6tHVaSnEf-iyg4VUMniXl8', gid: '1482895796', ncc: 'ALL' },\n        {"
code = re.sub(search_ncc_trip_sheets, replace_ncc_trip_sheets, code, count=1)

# 2. Update normalizeSupplierName
search_norm_supplier = r"if \(standardNames\[noTones\]\) return standardNames\[noTones\];"
replace_norm_supplier = "for (const key in standardNames) { if (noTones.includes(key)) return standardNames[key]; }\n    if (standardNames[noTones]) return standardNames[noTones];"
code = re.sub(search_norm_supplier, replace_norm_supplier, code)

# 3. Update parseNccTabData to find colDate, colPlate, colVehicle, colNcc
search_cols = r"let colKmStart = -1, colKmEnd = -1, colKmDiff = -1, colRoute = -1;"
replace_cols = "let colKmStart = -1, colKmEnd = -1, colKmDiff = -1, colRoute = -1, colDate = 1, colPlate = 2, colVehicle = 3, colNcc = -1;"
code = code.replace(search_cols, replace_cols)

search_hdr_scan = r"if \(h === 'lộ trình' \|\| h === 'tuyến đường' \|\| h\.includes\('điểm giao'\) \|\| h === 'tuyến'\) colRoute = ci;"
replace_hdr_scan = "if (h === 'lộ trình' || h === 'tuyến đường' || h.includes('điểm giao') || h === 'tuyến') colRoute = ci;\n                if (h.includes('ngày') && h.includes('thực hiện')) colDate = ci;\n                if (h.includes('biển số')) colPlate = ci;\n                if (h === 'xe' || h.includes('loại xe')) colVehicle = ci;\n                if (h === 'chi' || h.includes('nhà cung cấp') || h === 'ncc') colNcc = ci;"
code = code.replace(search_hdr_scan, replace_hdr_scan)

# Update row processing
search_row_vars = r"const stt = \(row\[0\] \|\| ''\)\.toString\(\)\.trim\(\);\n\s*const dateStr = \(row\[1\] \|\| ''\)\.toString\(\)\.trim\(\);\n\s*let plate = \(row\[2\] \|\| ''\)\.toString\(\)\.trim\(\);"
replace_row_vars = "const stt = (row[0] || '').toString().trim();\n        const dateStr = (row[colDate] || '').toString().trim();\n        let plate = (row[colPlate] || '').toString().trim();\n        let actualNcc = nccName;\n        if (colNcc > -1 && row[colNcc]) actualNcc = normalizeSupplierName(row[colNcc].toString().trim());\n        else actualNcc = normalizeSupplierName(nccName);"
code = re.sub(search_row_vars, replace_row_vars, code)

# Update vehicleCode
search_vehicle = r"const vehicleCode = \(row\[3\] \|\| ''\)\.toString\(\)\.trim\(\);"
replace_vehicle = "const vehicleCode = (row[colVehicle] || '').toString().trim();"
code = code.replace(search_vehicle, replace_vehicle)

# Update ncc: nccName to ncc: actualNcc
search_push_ncc = r"ncc: nccName,\n\s*dateStr,"
replace_push_ncc = "ncc: actualNcc,\n              dateStr,"
code = re.sub(search_push_ncc, replace_push_ncc, code)


with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf-8') as f:
    f.write(code)

print("Done part 1")
