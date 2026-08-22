import re

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf8') as f:
    lines = f.read().split('\n')

patched = False
for i in range(len(lines)):
    if "if (colTollFee === -1) colTollFee = 21;" in lines[i]:
        lines[i] = "      if (colTollFee === -1) colTollFee = 18;"
        lines[i+1] = "      if (colHolidayFee === -1) colHolidayFee = 19;"
        lines[i+2] = "      if (colTotalCost === -1) colTotalCost = 24;"
        patched = True
        break

if patched:
    with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf8') as f:
        f.write('\n'.join(lines))
    print("Patched toll fee successfully!")
else:
    print("Not found!")
