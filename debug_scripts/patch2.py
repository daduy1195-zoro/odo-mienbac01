# -*- coding: utf-8 -*-
with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start = -1
end = -1
for i, l in enumerate(lines):
    if "let matchedTripCode = ghnTripMap.get(matchKey) || null;" in l:
        start = i
    if start != -1 and i > start and "const sourceRow = sourceRowsArray ? sourceRowsArray[i] : (i + 1);" in l:
        end = i
        break

if start != -1 and end != -1:
    replace = '''          let matchedTripCode = ghnTripMap.get(matchKey) || null;
          
          const routeLower = (route || '').toLowerCase();
          const kmStartLower = kmStart.toLowerCase();
          const kmEndLower = kmEnd.toLowerCase();
          const kmDiffLower = kmDiff.toLowerCase();
          
          const isOffStr = (str) => {
              return str === 'off' || str.includes('ncc off') || str.includes('nghỉ') || str === 'nghi';
          };
          
          if (isOffByPlate || isOffStr(routeLower) || routeLower.includes(' off ') || routeLower.startsWith('off ') || isOffStr(kmStartLower) || isOffStr(kmEndLower) || isOffStr(kmDiffLower)) {
              if (routeLower.includes('ghn off')) {
                  matchedTripCode = 'GHN OFF';
              } else {
                  matchedTripCode = 'NCC OFF';
              }
          } else if (!matchedTripCode) {
              if (routeLower.includes('phát') || routeLower.includes('phat')) {
                  matchedTripCode = 'Phát';
              }
          }\n'''
    lines[start:end] = [replace]

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Done")
