# -*- coding: utf-8 -*-
with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace(r"let kmOverFee = \(colKmOverFee > -1 \? row\[colKmOverFee\] : ''\)\.toString\(\)\.trim\(\);", "let kmOverFee = (colKmOverFee > -1 ? row[colKmOverFee] : '').toString().trim();")

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf-8') as f:
    f.write(code)
