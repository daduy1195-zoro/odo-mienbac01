const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const regex2 = /if \(!rawData\[j\] \|\| !rawData\[j\]\[1\] \|\| !rawData\[j\]\[1\]\.toString\(\)\.match\(\/\\d\{2\}\\\/\\d\{2\}\\\/\\d\{4\}\/\)\) continue;\s*let p = \(rawData\[j\]\[2\] \|\| ''\)\.toString\(\)\.trim\(\)\.toUpperCase\(\);\s*if \(p && !p\.includes\('OFF'\) && !p\.includes\('NGHỈ'\) && !p\.includes\('NGHI'\) && p\.length >= 6\) \{\s*inferred = p;\s*inferredWH = \(rawData\[j\]\[26\] \|\| rawData\[j\]\[24\] \|\| ''\)\.toString\(\)\.trim\(\);/g;

const replacement2 = `if (!rawData[j] || !rawData[j][colDate > -1 ? colDate : 1] || !rawData[j][colDate > -1 ? colDate : 1].toString().match(/\\d/)) continue;
                      let p = (rawData[j][colPlate > -1 ? colPlate : 2] || '').toString().trim().toUpperCase();
                      if (p && !p.includes('OFF') && !p.includes('NGHỈ') && !p.includes('NGHI') && p.length >= 6) {
                          inferred = p;
                          inferredWH = (rawData[j][colKho > -1 ? colKho : 26] || '').toString().trim();`;

code = code.replace(regex2, replacement2);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('OFF patched via regex.');
