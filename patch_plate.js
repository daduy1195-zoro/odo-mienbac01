const fs = require('fs');
let c = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');
const search = 'if (!dateStr.match(/\\d{2}\\/\\d{2}\\/\\d{4}/)) continue;';
const rep = 'if (typeof formatPlate === "function") plate = formatPlate(plate);\n        if (!dateStr.match(/\\d{2}\\/\\d{2}\\/\\d{4}/)) continue;';
c = c.replace(search, rep);
fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', c);
