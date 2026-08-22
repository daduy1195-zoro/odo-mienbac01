import re
with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', encoding='utf-8') as f:
    code = f.read()
for m in re.finditer(r'document\.getElementById\(\'filterMonth\'\)\.addEventListener', code):
    print("Found addEventListener")
