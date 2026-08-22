# -*- coding: utf-8 -*-
with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf-8') as f:
    code = f.read()

import re

lines = [
    (r"pivotData\[khoGroup\]\[bienSo\]\.chiPhi \+= Number\(String\(r\.totalCost \|\| '0'\)\.replace\(/\[\^\\\\d\\\\\.-\]/g, ''\)\);", 
     "pivotData[khoGroup][bienSo].chiPhi += (typeof parseVietnameseNumber === 'function' ? parseVietnameseNumber(r.totalCost) : Number(String(r.totalCost || '0').replace(/[^\\\\d\\\\.-]/g, '')));"),
    (r"pivotData\[khoGroup\]\[bienSo\]\.kmPhatSinh \+= Number\(String\(r\.kmOver \|\| '0'\)\.replace\(/\[\^\\\\d\\\\\.-\]/g, ''\)\);",
     "pivotData[khoGroup][bienSo].kmPhatSinh += (typeof parseVietnameseNumber === 'function' ? parseVietnameseNumber(r.kmOver) : Number(String(r.kmOver || '0').replace(/[^\\\\d\\\\.-]/g, '')));"),
    (r"pivotData\[khoGroup\]\[bienSo\]\.phiVuotKm \+= Number\(String\(r\.kmOverFee \|\| '0'\)\.replace\(/\[\^\\\\d\\\\\.-\]/g, ''\)\);",
     "pivotData[khoGroup][bienSo].phiVuotKm += (typeof parseVietnameseNumber === 'function' ? parseVietnameseNumber(r.kmOverFee) : Number(String(r.kmOverFee || '0').replace(/[^\\\\d\\\\.-]/g, '')));"),
    (r"pivotData\[khoGroup\]\[bienSo\]\.thoiGianTangCa \+= Number\(String\(r\.otHours \|\| '0'\)\.replace\(/\[\^\\\\d\\\\\.-\]/g, ''\)\);",
     "pivotData[khoGroup][bienSo].thoiGianTangCa += (typeof parseVietnameseNumber === 'function' ? parseVietnameseNumber(r.otHours) : Number(String(r.otHours || '0').replace(/[^\\\\d\\\\.-]/g, '')));"),
    (r"pivotData\[khoGroup\]\[bienSo\]\.phiTangCa \+= Number\(String\(r\.otFee \|\| '0'\)\.replace\(/\[\^\\\\d\\\\\.-\]/g, ''\)\);",
     "pivotData[khoGroup][bienSo].phiTangCa += (typeof parseVietnameseNumber === 'function' ? parseVietnameseNumber(r.otFee) : Number(String(r.otFee || '0').replace(/[^\\\\d\\\\.-]/g, '')));"),
    (r"pivotData\[khoGroup\]\[bienSo\]\.phiCauDuong \+= Number\(String\(r\.tollFee \|\| '0'\)\.replace\(/\[\^\\\\d\\\\\.-\]/g, ''\)\);",
     "pivotData[khoGroup][bienSo].phiCauDuong += (typeof parseVietnameseNumber === 'function' ? parseVietnameseNumber(r.tollFee) : Number(String(r.tollFee || '0').replace(/[^\\\\d\\\\.-]/g, '')));")
]

for search, replace in lines:
    code = re.sub(search, replace, code)

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf-8') as f:
    f.write(code)

print("Done")
