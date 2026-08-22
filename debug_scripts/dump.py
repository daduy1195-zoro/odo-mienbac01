import re
with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', encoding='utf-8') as f:
    code = f.read()
m = re.search(r'\} else if \(hasMatch\) \{.*?(?=if \(r\.isManualMatch\))', code, re.DOTALL)
print(m.group(0) if m else "None")
