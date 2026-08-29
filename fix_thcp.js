const fs = require('fs');
let c = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');
const search = "    if (colKmEnd > -1 && colKmDiff === -1) colKmDiff = colKmEnd + 1;";
const replace = `    if (colKmEnd > -1 && colKmDiff === -1) colKmDiff = colKmEnd + 1;

    // Fallback cho file THCP Tháng 8 (bị khuyết text ở dòng tiêu đề)
    if (nccName === 'ALL') {
        if (colDate === -1) colDate = 2;
        if (colPlate === -1) colPlate = 3;
        if (colRoute === -1) colRoute = 5;
        if (colNcc === -1) colNcc = 1;
    }`;
c = c.replace(search, replace);
fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', c);
console.log('done');
