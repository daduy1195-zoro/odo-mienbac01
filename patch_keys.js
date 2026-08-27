const fs = require('fs');
let c = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

c = c.replace(/const finalKey = `\$\{nccName\}_\$\{plate\}_\$\{dateStr\}_\$\{sourceRow\}`;/, 'const finalKey = `${nccName}_${plate}_${dateStr}_${route}`;');
c = c.replace(/const key = `\$\{r\.ncc\}_\$\{r\.plate\}_\$\{r\.dateStr\}_\$\{r\.sourceRow\}`;/g, 'const key = `${r.ncc}_${r.plate}_${r.dateStr}_${r.route}`;');

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', c);
console.log('Patched keys');
