# -*- coding: utf-8 -*-
with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace("routeLower.includes('phát') || routeLower.includes('phat')", "routeLower.includes('phạt') || routeLower.includes('phat')")
code = code.replace("matchedTripCode = 'Phát'", "matchedTripCode = 'Phạt'")

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf-8') as f:
    f.write(code)
