import re

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf8') as f:
    content = f.read()

# Remove the quotes around Calibri
content = content.replace("font-family:'Calibri', sans-serif", "font-family:Calibri, sans-serif")
content = content.replace("font-family: 'Calibri', sans-serif", "font-family:Calibri, sans-serif")

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf8') as f:
    f.write(content)
print("Font syntax fixed!")
