const fs = require('fs');
const https = require('https');
const code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const parseFuncStr = code.match(/function parseNccTabData[\s\S]*?return results;\s*\n\}/)[0];
eval(parseFuncStr);
function parseVietnameseNumber(str) {
    if (!str) return 0;
    const clean = String(str).replace(/\./g, "").replace(/,/g, ".").replace(/[^0-9.-]/g, "");
    const val = parseFloat(clean);
    return isNaN(val) ? 0 : val;
}
function normalizeSupplierName(name) { return name; }
function norm(str) { return str; }
function removeAccents(str) { return str; }

https.get('https://docs.google.com/spreadsheets/d/1ZjxQD5Hh3nW7zxg4DCeWRfe704zoaD4gAcA5_hQFqQA/gviz/tq?tqx=out:json&gid=1620536867&headers=1', res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const match = data.match(/google\.visualization\.Query\.setResponse\((.*)\);/);
            const json = JSON.parse(match[1]);
            const rawData = json.table.rows.map(row => row.c.map(cell => cell ? (cell.f || cell.v || '') : ''));
            const results = parseNccTabData(rawData, 'Hoa Vinh', new Map(), '1ZjxQD5H...', 'Hoa Vinh', '1620536867');
            let totalOtHours = 0;
            results.forEach(r => {
                if (r.plate.includes('29K07561') || r.plate.includes('29K-07561')) {
                    totalOtHours += r.otHours;
                }
            });
            console.log('Total OT Hours from parseNccTabData for 29K-07561:', totalOtHours);
        } catch(e) { console.log(e); }
    });
});
