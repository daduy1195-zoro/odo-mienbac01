import re

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf8') as f:
    content = f.read()

lines = content.split('\n')
for i in range(len(lines)):
    if 'let _km = 0;' in lines[i]:
        # we found it, it's followed by `if (row.kmDiff) {`
        lines[i] = """        let _km = 0;
        if (row.kmDiff !== undefined && row.kmDiff !== null && String(row.kmDiff).trim() !== '') {
            let diffVal = parseFloat(String(row.kmDiff).replace(/[^\\d.]/g, ''));
            if (!isNaN(diffVal) && diffVal > 0) _km = diffVal;
        }
        if (_km === 0) {
            let s = parseFloat(String(row.kmStart || '').replace(/[^\\d.]/g, ''));
            let e = parseFloat(String(row.kmEnd || '').replace(/[^\\d.]/g, ''));
            if (!isNaN(s) && !isNaN(e) && s > 1000 && e >= s) {
                _km = e - s;
            } else if (!isNaN(e) && e > 0 && e < 1000) {
                _km = e;
            } else if (!isNaN(s) && s > 0 && s < 1000) {
                _km = s;
            }
        }"""
        
        # remove the old lines
        for j in range(i+1, i+12):
            if 'let _cost =' in lines[j]:
                # delete lines from i+1 to j-1
                for k in range(i+1, j):
                    lines[k] = ""
                break
        break

content = '\n'.join(lines)
with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf8') as f:
    f.write(content)
print("Patched!")
