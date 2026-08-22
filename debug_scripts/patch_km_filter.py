import re

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf8') as f:
    content = f.read()

search = """          let _km = 0;
          if (row.kmDiff) {
              let rawNum = typeof parseVietnameseNumber === 'function' ? parseVietnameseNumber(row.kmDiff) : parseInt(row.kmDiff);
              if (!isNaN(rawNum) && rawNum > 0) _km = rawNum;
          }
          if (_km === 0 && row.kmStart && row.kmEnd) {
              let s = typeof parseVietnameseNumber === 'function' ? parseVietnameseNumber(row.kmStart) : parseInt(row.kmStart);
              let e = typeof parseVietnameseNumber === 'function' ? parseVietnameseNumber(row.kmEnd) : parseInt(row.kmEnd);
              if (!isNaN(s) && !isNaN(e) && e > s) _km = e - s;
          }"""

replace = """          let _km = 0;
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

if search in content:
    content = content.replace(search, replace)
    with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf8') as f:
        f.write(content)
    print("Patched!")
else:
    print("Search string not found!")
