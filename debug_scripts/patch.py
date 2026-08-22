# -*- coding: utf-8 -*-
import re

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf-8') as f:
    code = f.read()

search = r"""          const matchKey = \$\{normPlate\}_\$\{dateStr\};
          let matchedTripCode = ghnTripMap\.get\(matchKey\) \|\| null;
          
          const routeLower = \(route \|\| ''\)\.toLowerCase\(\);
          if \(!matchedTripCode\) \{
              if \(isOffByPlate\) \{
                  matchedTripCode = 'NCC OFF';
              \} else if \(routeLower\.includes\('ghn off'\)\) \{
                  matchedTripCode = 'GHN OFF';
              \} else if \(routeLower\.includes\('phát'\) \|\| routeLower\.includes\('phat'\)\) \{
                  matchedTripCode = 'Phát';
              \} else if \(routeLower\.includes\('ncc off'\) \|\| routeLower\.includes\('off'\) \|\| routeLower\.includes\('nghỉ'\) \|\| routeLower\.includes\('nghi'\)\) \{
                  matchedTripCode = 'NCC OFF';
              \}
          \}"""

replace = """          const matchKey = ${normPlate}_;
          let matchedTripCode = ghnTripMap.get(matchKey) || null;
          
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
          }"""

code = re.sub(search, replace, code)

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf-8') as f:
    f.write(code)

print("Replaced:", "isOffStr(kmStartLower)" in code)
