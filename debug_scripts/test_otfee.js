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
eval(parseFuncStr);

https.get('https://docs.google.com/spreadsheets/d/1-uL7wvTpE2QwDOjSJsrqIsEpU83zf353/gviz/tq?gid=891333796&headers=0', res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const json = JSON.parse(data.substring(data.indexOf('{'), data.lastIndexOf('}') + 1));
        const rawData = [];
        json.table.rows.forEach(row => {
            rawData.push(row.c.map(cell => {
                if (!cell) return '';
                let sv = cell.v !== null && cell.v !== undefined ? String(cell.v) : '';
                const dateMatch = sv.match(/^Date\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
                if (dateMatch) {
                    const dd = String(parseInt(dateMatch[3])).padStart(2, '0');
                    const mm = String(parseInt(dateMatch[2]) + 1).padStart(2, '0');
                    return dd + '/' + mm + '/' + dateMatch[1];
                }
                return cell.f || cell.v || '';
            }));
        });
        
        const ghnTripMap = new Map();
        const parsed = parseNccTabData(rawData, 'ALL', ghnTripMap, '1-uL7wvTpE2QwDOjSJsrqIsEpU83zf353', '', '891333796');
        
        const trips = parsed.filter(r => String(r.plate).toUpperCase().includes('29G-00609'));
        console.log(`Found ${trips.length} trips for 29G-00609`);
        let totalOtFee = 0;
        trips.forEach(t => {
            console.log(`Date: ${t.dateStr}, otFee: ${t.otFee}`);
            totalOtFee += parseVietnameseNumber(t.otFee);
        });
        console.log(`Total OT Fee: ${totalOtFee}`);
    });
});
