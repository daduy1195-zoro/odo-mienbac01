const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

code = code.replace(/!rawData\[j\]\[1\] \|\| !rawData\[j\]\[1\]\.toString\(\)\.match\(\/\\d\{2\}\\\/\\d\{2\}\\\/\\d\{4\}\/\)/g,
                    "!rawData[j][colDate > -1 ? colDate : 1] || !rawData[j][colDate > -1 ? colDate : 1].toString().match(/\\d/)");

code = code.replace(/let p = \(rawData\[j\]\[2\] \|\| ''\)\.toString\(\)\.trim\(\)\.toUpperCase\(\);/g,
                    "let p = (rawData[j][colPlate > -1 ? colPlate : 2] || '').toString().trim().toUpperCase();");

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('OFF patched successfully.');
