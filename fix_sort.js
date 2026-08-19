const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const regexLastmile = /\/\/ Sắp xếp theo ngày giảm dần\s*filtered\.sort\(function\(a, b\) \{\s*var partsA = \(a\.dateStr \|\| ''\)\.split\('\/'\);\s*var partsB = \(b\.dateStr \|\| ''\)\.split\('\/'\);\s*if \(partsA\.length === 3 && partsB\.length === 3\) \{\s*var dateA = new Date\(parseInt\(partsA\[2\]\), parseInt\(partsA\[1\]\) - 1, parseInt\(partsA\[0\]\)\);\s*var dateB = new Date\(parseInt\(partsB\[2\]\), parseInt\(partsB\[1\]\) - 1, parseInt\(partsB\[0\]\)\);\s*return dateB - dateA;\s*\}\s*return 0;\s*\}\);/;

const replaceLastmile = `// Sắp xếp theo ngày giảm dần, sau đó theo kho
    filtered.sort(function(a, b) {
        var partsA = (a.dateStr || '').split('/');
        var partsB = (b.dateStr || '').split('/');
        var dateDiff = 0;
        if (partsA.length === 3 && partsB.length === 3) {
            var dateA = new Date(parseInt(partsA[2]), parseInt(partsA[1]) - 1, parseInt(partsA[0]));
            var dateB = new Date(parseInt(partsB[2]), parseInt(partsB[1]) - 1, parseInt(partsB[0]));
            dateDiff = dateB - dateA;
        }
        if (dateDiff !== 0) return dateDiff;
        
        var whA = typeof shortWarehouse === 'function' ? shortWarehouse(a.hubName || '') : (a.hubName || '');
        var whB = typeof shortWarehouse === 'function' ? shortWarehouse(b.hubName || '') : (b.hubName || '');
        return whA.localeCompare(whB, 'vi');
    });`;

content = content.replace(regexLastmile, replaceLastmile);


const regexNccTrip = /\/\/ Sort filtered rows by date descending\s*filtered\.sort\(\(a, b\) => \{\s*const partsA = String\(a\.dateStr \|\| ''\)\.split\('\/'\);\s*const partsB = String\(b\.dateStr \|\| ''\)\.split\('\/'\);\s*if \(partsA\.length === 3 && partsB\.length === 3\) \{\s*const dateA = new Date\(parseInt\(partsA\[2\]\), parseInt\(partsA\[1\]\) - 1, parseInt\(partsA\[0\]\)\);\s*const dateB = new Date\(parseInt\(partsB\[2\]\), parseInt\(partsB\[1\]\) - 1, parseInt\(partsB\[0\]\)\);\s*return dateB - dateA;\s*\}\s*return 0;\s*\}\);/;

const replaceNccTrip = `// Sort filtered rows by date descending, then by warehouse
    filtered.sort((a, b) => {
        const partsA = String(a.dateStr || '').split('/');
        const partsB = String(b.dateStr || '').split('/');
        let dateDiff = 0;
        if (partsA.length === 3 && partsB.length === 3) {
            const dateA = new Date(parseInt(partsA[2]), parseInt(partsA[1]) - 1, parseInt(partsA[0]));
            const dateB = new Date(parseInt(partsB[2]), parseInt(partsB[1]) - 1, parseInt(partsB[0]));
            dateDiff = dateB - dateA;
        }
        if (dateDiff !== 0) return dateDiff;
        
        const whA = typeof shortWarehouse === 'function' ? shortWarehouse(a.warehouse || '') : (a.warehouse || '');
        const whB = typeof shortWarehouse === 'function' ? shortWarehouse(b.warehouse || '') : (b.warehouse || '');
        return whA.localeCompare(whB, 'vi');
    });`;

content = content.replace(regexNccTrip, replaceNccTrip);

fs.writeFileSync('index.html', content, 'utf8');
console.log("Updated sorting rules.");
