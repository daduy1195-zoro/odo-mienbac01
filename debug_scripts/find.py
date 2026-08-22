import re
with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', encoding='utf-8') as f:
    code = f.read()
m = re.search(r'<select id="filterMonth"[^>]*>', code)
print(m.group(0))
