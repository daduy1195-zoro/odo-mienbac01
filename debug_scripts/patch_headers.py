import re

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf8') as f:
    lines = f.read().split('\n')

patched = False
for i in range(len(lines)):
    if "colKmOverFee = ci;" in lines[i] and "vuot km" in lines[i]:
        # found the line, let's insert otHours and otFee detection after this
        lines.insert(i+1, "                  if (h.includes('thời gian tăng ca') || h.includes('tg tăng ca') || h.includes('giờ tăng ca')) colOtHours = ci;")
        lines.insert(i+2, "                  if (h.includes('phí tăng ca') || h.includes('tiền tăng ca')) colOtFee = ci;")
        lines.insert(i+3, "                  if (h.includes('đơn giá tăng ca') || h.includes('giá tăng ca')) colOtRate = ci;")
        patched = True
        break

for i in range(len(lines)):
    if "if (colOtHours === -1) colOtHours = 9;" in lines[i]:
        # Replace the hardcoded fallback with the new unified format
        lines[i] = "      if (colOtHours === -1) colOtHours = 10;"
        lines[i+1] = "      if (colOtRate === -1) colOtRate = 11;"
        lines[i+2] = "      if (colOtFee === -1) colOtFee = 12;"
        lines[i+3] = "      if (colKmOverFee === -1) colKmOverFee = 17;"
        lines[i+4] = "      if (colKmOver === -1) colKmOver = 16;"
        break

if patched:
    with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf8') as f:
        f.write('\n'.join(lines))
    print("Patched successfully!")
else:
    print("Not found!")
