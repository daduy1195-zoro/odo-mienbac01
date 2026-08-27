const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const oldCode = `        let finalDiff = null;
        if (r.kmDiff !== undefined && r.kmDiff !== null && String(r.kmDiff).trim() !== '') {
            let diffVal = parseFloat(String(r.kmDiff).replace(/[^\\d.]/g, ''));
            if (!isNaN(diffVal)) finalDiff = diffVal;
            else return escapeHtml(r.kmDiff);
        } else {
            let s = parseFloat(String(r.kmStart).replace(/[^\\d.]/g, ''));
            let e = parseFloat(String(r.kmEnd).replace(/[^\\d.]/g, ''));
            if (!isNaN(s) && !isNaN(e) && s > 1000 && e >= s) {
                finalDiff = e - s;
            } else if (!isNaN(e) && e > 0 && e < 1000) {
                finalDiff = e;
            } else if (!isNaN(s) && s > 0 && s < 1000) {
                finalDiff = s;
            }
        }`;

const newCode = `        let finalDiff = null;
        if (r.kmDiff !== undefined && r.kmDiff !== null && String(r.kmDiff).trim() !== '') {
            let diffVal = parseVietnameseNumber(r.kmDiff);
            if (!isNaN(diffVal)) finalDiff = diffVal;
            else return escapeHtml(r.kmDiff);
        } else {
            let s = parseVietnameseNumber(r.kmStart);
            let e = parseVietnameseNumber(r.kmEnd);
            if (!isNaN(s) && !isNaN(e) && s > 1000 && e >= s) {
                finalDiff = e - s;
            } else if (!isNaN(e) && e > 0 && e < 1000) {
                finalDiff = e;
            } else if (!isNaN(s) && s > 0 && s < 1000) {
                finalDiff = s;
            }
        }`;

code = code.replace(oldCode, newCode);
fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('km fixed');
