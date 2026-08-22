const fs = require('fs');
let code = fs.readFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'utf8');

const s1 = `        let _km = typeof parseVietnameseNumber === 'function' ? parseVietnameseNumber(row.kmOver) : Number(String(row.kmOver || '0').replace(/[^\\d\\.-]/g, '')); let _cost = typeof parseVietnameseNumber === 'function' ? parseVietnameseNumber(row.totalCost) : Number(String(row.totalCost || '0').replace(/[^\\d\\.-]/g, '')); let isKhongChay = (_km === 0 && _cost > 0);\n        if (filterStatus === 'khong_chay' && !isKhongChay) return;`;

const r1 = `        let _km = 0;
        if (row.kmDiff) {
            let rawNum = typeof parseVietnameseNumber === 'function' ? parseVietnameseNumber(row.kmDiff) : parseInt(row.kmDiff);
            if (!isNaN(rawNum) && rawNum > 0) _km = rawNum;
        }
        if (_km === 0 && row.kmStart && row.kmEnd) {
            let s = typeof parseVietnameseNumber === 'function' ? parseVietnameseNumber(row.kmStart) : parseInt(row.kmStart);
            let e = typeof parseVietnameseNumber === 'function' ? parseVietnameseNumber(row.kmEnd) : parseInt(row.kmEnd);
            if (!isNaN(s) && !isNaN(e) && e > s) _km = e - s;
        }
        let _cost = typeof parseVietnameseNumber === 'function' ? parseVietnameseNumber(row.totalCost) : Number(String(row.totalCost || '0').replace(/[^\\d\\.-]/g, '')); 
        let isKhongChay = (_km === 0 && _cost > 0);
        if (filterStatus === 'khong_chay' && !isKhongChay) return;`;

code = code.replace(s1, r1);
fs.writeFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', code);
