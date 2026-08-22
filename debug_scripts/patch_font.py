import re

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf8') as f:
    content = f.read()

# Replace all occurrences of font-family:monospace with font-family:'Calibri', sans-serif
content = content.replace("font-family:monospace", "font-family:'Calibri', sans-serif")
# Also handle cases with spaces
content = content.replace("font-family: monospace", "font-family: 'Calibri', sans-serif")

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf8') as f:
    f.write(content)
print("Font patched!")
