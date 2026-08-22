import re

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf8') as f:
    content = f.read()

search = """const backupStr = (r[10] || '').trim().toUpperCase(); // Cột K = Biển số xe tăng cường"""
replace = """const backupStr = ((r[10] || '') + ' ' + (r[7] || '')).trim().toUpperCase(); // Lấy cả cột K và cột H (đề phòng Proxy API bị giới hạn 10 cột A-J)"""

if search in content:
    content = content.replace(search, replace)
    with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf8') as f:
        f.write(content)
    print("Patched backup plates!")
else:
    print("Not found backupStr!")
