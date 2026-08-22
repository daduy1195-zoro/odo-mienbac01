const fs = require('fs');
let code = fs.readFileSync('C:\\\\Users\\\\MSI\\\\Desktop\\\\AI\\\\Odo\\\\index.html', 'utf8');
const lines = code.split('\n');

const start = lines.findIndex(l => l.includes('let matchedTripCode = ghnTripMap.get(matchKey) || null;'));
const end = lines.findIndex((l, i) => i > start && l.includes('const sourceRow = sourceRowsArray ? sourceRowsArray[i] : (i + 1);'));

if (start !== -1 && end !== -1) {
    const replace =           let matchedTripCode = ghnTripMap.get(matchKey) || null;
          
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
          }
;
    lines.splice(start, end - start, replace);
}

fs.writeFileSync('C:\\\\Users\\\\MSI\\\\Desktop\\\\AI\\\\Odo\\\\index.html', lines.join('\n'));
console.log('Replaced:', lines.join('\n').includes('kmStartLower'));
