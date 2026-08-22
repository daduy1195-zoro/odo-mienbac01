import re

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf8') as f:
    lines = f.read().split('\n')

patched = False
for i in range(len(lines)):
    if "if (h.includes('đơn giá tăng ca') || h.includes('giá tăng ca')) colOtRate = ci;" in lines[i]:
        # found the line, let's insert kmOver
        lines.insert(i+1, "                  if (h.includes('số km phát sinh tăng') || h.includes('km phát sinh tăng') || (h.includes('km') && h.includes('phát sinh'))) colKmOver = ci;")
        patched = True
        break

if patched:
    with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf8') as f:
        f.write('\n'.join(lines))
    print("Patched kmOver successfully!")
else:
    print("Not found!")
