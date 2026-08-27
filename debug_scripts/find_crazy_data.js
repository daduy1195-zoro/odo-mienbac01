const https = require('https');
const fs = require('fs');

const code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const parseFuncStr = code.substring(code.indexOf('function parseNccTabData'), code.indexOf('return results;', code.indexOf('function parseNccTabData')) + 16);
const normStr = code.substring(code.indexOf('function norm('), code.indexOf('}', code.indexOf('function norm(')) + 1);
const removeAccentsStr = code.substring(code.indexOf('function removeAccents('), code.indexOf('}', code.indexOf('function removeAccents(')) + 1);
const detectWHStr = code.substring(code.indexOf('function detectWH('), code.indexOf('}', code.indexOf('function detectWH(')) + 1);
const normSupStr = code.substring(code.indexOf('function normalizeSupplierName('), code.indexOf('return clean;', code.indexOf('function normalizeSupplierName(')) + 14);

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

eval(normStr);
eval(removeAccentsStr);
eval(detectWHStr);
eval(normSupStr);
eval(parseFuncStr);

const NCC_TRIP_SHEETS = [
    { id: '1ZT_OPLSxOEWiy96YE-snqE-t3tX2T3EhkjDbk9Oll90', gid: '45442280', ncc: 'NAK' },
    { id: '1ZT_OPLSxOEWiy96YE-snqE-t3tX2T3EhkjDbk9Oll90', gid: '1620536867', ncc: 'NAK' },
    { id: '16jiK-hQ-xOrs9kxmJF6CXQ1HANy0zAlDyQM2q7mOtOg', gid: '73639881', ncc: 'Thiên Phú' },
    { id: '1aMz8LLOo9wm2KrDgEXk6xOKMN8wUrfCDco7pOM6t2Qs', gid: '679483124', ncc: 'Duy Phát' },
    { id: '1E8T_mJBy14qmTPT4k64zxVThjDNNoxEfzuynbuONCBg', gid: '679483124', ncc: 'Hoàng Minh' },
    { id: '1ZjxQD5Hh3nW7zxg4DCeWRfe704zoaD4gAcA5_hQFqQA', gid: '1620536867', ncc: 'Hoa Vinh' },
    { id: '1Q0idCOo-S-8XzmNWsw-4r51Kjsxsj0OxgP9D2ApCwxc', gid: '1290293725', ncc: 'Long Thành' },
    { id: '1Q0idCOo-S-8XzmNWsw-4r51Kjsxsj0OxgP9D2ApCwxc', gid: '1620536867', ncc: 'Long Thành' },
    { id: '1yqf8Bg6Tmq4v-qOzdpY9G4Y1OEnhQ5e7OURq017SiZI', gid: '2147444878', ncc: 'Đào Trọng An' },
    { id: '1T6Hj-tcabvxLARvF7YyUUI05SHpQmvcfjik_yPp4Mls', gid: '1012425134', ncc: 'TAL' },
    { id: '1aa_3Nwi0Z-SlGi-jZs1cNkU0v3Yt6p_9Fc4lr_oA5vY', gid: '942983334', ncc: 'Đại Minh' },
    { id: '1jFaJutdZD8uhBYa9Hy9fH6tHVaSnEf-iyg4VUMniXl8', gid: '1482895796', ncc: 'ALL' }
];

async function fetchSheet(sheet) {
    return new Promise((resolve) => {
        https.get(`https://docs.google.com/spreadsheets/d/${sheet.id}/gviz/tq?tqx=out:json&gid=${sheet.gid}&headers=${sheet.ncc === 'ALL' ? 0 : 1}`, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const match = data.match(/google\.visualization\.Query\.setResponse\((.*)\);/);
                    if (!match) return resolve(null);
                    const json = JSON.parse(match[1]);
                    const rawData = [];
                    if (sheet.ncc !== 'ALL') {
                        const hdr = json.table.cols.map(c => c ? c.label || '' : '');
                        rawData.push(hdr);
                    }
                    json.table.rows.forEach(row => {
                        rawData.push(row.c.map(cell => cell ? (cell.f || cell.v || '') : ''));
                    });
                    resolve({sheet, rawData});
                } catch(e) { resolve(null); }
            });
        }).on('error', () => resolve(null));
    });
}

async function run() {
    for (const sheet of NCC_TRIP_SHEETS) {
        console.log('Fetching', sheet.ncc, sheet.gid);
        const res = await fetchSheet(sheet);
        if (!res) continue;
        const parsed = parseNccTabData(res.rawData, sheet.ncc, new Map(), sheet.id, '', sheet.gid);
        
        parsed.forEach(r => {
            if (r.dateStr) {
                const parts = r.dateStr.split('/');
                if (parts[1] === '08' || (parts[1] === '07' && parseInt(parts[0]) >= 26)) {
                    // This is in August cycle!
                    if (r.plate && r.plate.includes('29K-07561')) {
                        console.log('FOUND 29K-07561 in cycle 08 from sheet', sheet.ncc);
                        console.log('otHours:', r.otHours);
                        console.log('kmOver:', r.kmOver);
                    }
                }
            }
        });
    }
}
run();
