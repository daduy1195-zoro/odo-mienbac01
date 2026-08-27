const https = require('https');
const fs = require('fs');

const code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const parseFuncStr = code.substring(code.indexOf('function parseNccTabData'), code.indexOf('return results;', code.indexOf('function parseNccTabData')) + 16);
const normStr = code.substring(code.indexOf('function norm('), code.indexOf('}', code.indexOf('function norm(')) + 1);
const removeAccentsStr = code.substring(code.indexOf('function removeAccents('), code.indexOf('}', code.indexOf('function removeAccents(')) + 1);
const parseVietStr = code.substring(code.indexOf('function parseVietnameseNumber('), code.indexOf('}', code.indexOf('function parseVietnameseNumber(')) + 1);
const detectWHStr = code.substring(code.indexOf('function detectWH('), code.indexOf('}', code.indexOf('function detectWH(')) + 1);
const normSupStr = code.substring(code.indexOf('function normalizeSupplierName('), code.indexOf('return clean;', code.indexOf('function normalizeSupplierName(')) + 14);

eval(normStr);
eval(removeAccentsStr);
eval(parseVietStr);
eval(detectWHStr);
eval(normSupStr);
eval(parseFuncStr);

https.get('https://docs.google.com/spreadsheets/d/1jFaJutdZD8uhBYa9Hy9fH6tHVaSnEf-iyg4VUMniXl8/gviz/tq?sheet=database&headers=1', res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const json = JSON.parse(data.substring(data.indexOf('{'), data.lastIndexOf('}') + 1));
        const rawData = [];
        const header = json.table.cols.map(c => c ? String(c.label || '').trim() : '');
        rawData.push(header);
        
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
        const parsed = parseNccTabData(rawData, 'ALL', ghnTripMap, '1jFaJutdZD8uhBYa9Hy9fH6tHVaSnEf-iyg4VUMniXl8', '', '1482895796');
        
        const nakTrips = parsed.filter(r => String(r.ncc).toUpperCase() === 'NAK');
        if (nakTrips.length > 0) {
            console.log('NAK Trip 1:');
            console.log('Monthly:', nakTrips[0].monthlyRate);
            console.log('Daily:', nakTrips[0].dailyRate);
            console.log('Toll:', nakTrips[0].tollFee);
            console.log('Holiday:', nakTrips[0].holidayFee);
            console.log('Total:', nakTrips[0].totalCost);
        } else {
            console.log('No NAK trips found.');
        }
    });
});
