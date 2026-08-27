const https = require('https');
const fs = require('fs');

const code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const parseFuncStr = code.substring(code.indexOf('function parseNccTabData'), code.indexOf('return results;', code.indexOf('function parseNccTabData')) + 16);
const normStr = code.substring(code.indexOf('function norm('), code.indexOf('}', code.indexOf('function norm(')) + 1);
const removeAccentsStr = code.substring(code.indexOf('function removeAccents('), code.indexOf('}', code.indexOf('function removeAccents(')) + 1);

function parseVietnameseNumber(str) {
    if (!str) return 0;
    let s = String(str).trim().replace(/\s*đ$/i, '').trim();
    if (!s || s === '-' || s === '”') return 0;
    if (/^-?\d{1,3}(\.\d{3})+/.test(s)) {
        s = s.replace(/\./g, '').replace(',', '.');
    } else if (s.includes(',') && !s.includes('.')) {
        s = s.replace(',', '.');
    } else if (/^-?\d{1,3}\.\d{3}$/.test(s)) {
        s = s.replace('.', '');
    } else {
        s = s.replace(/[^\d.-]/g, '');
    }
    const num = parseFloat(s);
    return isNaN(num) ? 0 : num;
}

const detectWHStr = code.substring(code.indexOf('function detectWH('), code.indexOf('}', code.indexOf('function detectWH(')) + 1);
const normSupStr = code.substring(code.indexOf('function normalizeSupplierName('), code.indexOf('return clean;', code.indexOf('function normalizeSupplierName(')) + 14);

eval(normStr);
eval(removeAccentsStr);
eval(detectWHStr);
eval(normSupStr);

// Inject debug into parseFuncStr
let modifiedParseFuncStr = parseFuncStr.replace(
    `const otFeeNum = parseVietnameseNumber(otFee);`,
    `const otFeeNum = parseVietnameseNumber(otFee);
     if (plate && plate.includes('29G-00609')) {
         console.log('29G-00609 -> raw otFee:', colOtFee, row[colOtFee], '-> string:', otFee, '-> num:', otFeeNum);
     }`
);
eval(modifiedParseFuncStr);

https.get('https://docs.google.com/spreadsheets/d/1jFaJutdZD8uhBYa9Hy9fH6tHVaSnEf-iyg4VUMniXl8/gviz/tq?tqx=out:json&gid=1482895796&headers=0', res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const jsonStr = data.match(/google\.visualization\.Query\.setResponse\((.*)\);/)[1];
        const json = JSON.parse(jsonStr);
        const rawData = [];
        json.table.rows.forEach(row => {
            rawData.push(row.c.map(cell => {
                if (!cell) return '';
                return cell.f || cell.v || '';
            }));
        });
        
        const ghnTripMap = new Map();
        parseNccTabData(rawData, 'ALL', ghnTripMap, '1jFaJutdZD8uhBYa9Hy9fH6tHVaSnEf-iyg4VUMniXl8', '', '1482895796');
    });
});
