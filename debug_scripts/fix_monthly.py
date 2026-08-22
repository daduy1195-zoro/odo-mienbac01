import re

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf8') as f:
    content = f.read()

search = "      if (colKmOver === -1) colKmOver = 16;"
replace = "      if (colKmOver === -1) colKmOver = 16;\n      if (colMonthlyRate === -1) colMonthlyRate = 20;" # just assigning something safe

if search in content:
    content = content.replace(search, replace)
    with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf8') as f:
        f.write(content)
    print("Fixed monthly rate!")
