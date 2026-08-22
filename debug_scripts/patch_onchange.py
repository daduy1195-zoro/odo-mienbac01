import re

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf8') as f:
    content = f.read()

search = """} else if (this.value) { updateNccTripCode(${r.originalIndex}, this.value); }">"""
replace = """} else { updateNccTripCode(${r.originalIndex}, this.value); }">"""

if search in content:
    content = content.replace(search, replace)
    with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf8') as f:
        f.write(content)
    print("Patched onchange successfully!")
else:
    print("Not found!")
