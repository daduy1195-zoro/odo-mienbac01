import re

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf8') as f:
    content = f.read()

# Currently: const finalEmpList = empList.filter(e => e && !(e.isSupport && e.myExpectedDays === 0));
# We want to add: && !e.isResigned

search = """const finalEmpList = empList.filter(e => e && !(e.isSupport && e.myExpectedDays === 0));"""
replace = """const finalEmpList = empList.filter(e => e && !(e.isSupport && e.myExpectedDays === 0) && !e.isResigned);"""

if search in content:
    content = content.replace(search, replace)
    with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf8') as f:
        f.write(content)
    print("Patched filter successfully!")
else:
    print("Filter not found!")
