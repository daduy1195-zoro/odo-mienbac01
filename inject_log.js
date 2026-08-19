const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// I will add a console log inside extractNccTripData
const regex = /let totalCost = \(colTotalCost > -1 \? row\[colTotalCost\] : ''\)\.toString\(\)\.trim\(\);/g;
const replace = `let totalCost = (colTotalCost > -1 ? row[colTotalCost] : '').toString().trim();
        if (i === startRow) {
            console.log("==> NCC:", nccName, "Tab:", tabName);
            console.log("colTotalCost:", colTotalCost, "Header text:", colTotalCost > -1 ? rawData[headerRowIdx][colTotalCost] : 'NOT FOUND');
            console.log("Row 0 value for totalCost:", totalCost);
        }`;

content = content.replace(regex, replace);
fs.writeFileSync('index.html', content, 'utf8');
console.log('Injected console logs');
