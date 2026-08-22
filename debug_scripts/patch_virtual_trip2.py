import re

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf8') as f:
    content = f.read()

# 3. Add column data
lines = content.split('\n')
for i in range(len(lines)):
    if 'html += \'<td style="font-size:12px; max-width:150px; white-space:normal;">\' + (r.route ? escapeHtml(r.route) :' in lines[i]:
        lines[i] = lines[i] + "\n        let isVirtual = r.tripCode && virtualTrips[r.tripCode];\n        html += '<td style=\"text-align:center;\"><input type=\"checkbox\" ' + (isVirtual ? 'checked' : '') + ' onchange=\"toggleVirtualTrip(\\'' + r.tripCode + '\\', this.checked)\" style=\"cursor:pointer; width:16px; height:16px;\"></td>';"
        break

content = '\n'.join(lines)
with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf8') as f:
    f.write(content)

print("Patched!")
