const https = require('https');
const fs = require('fs');

const code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const parseFuncStr = code.substring(code.indexOf('function parseNccTabData'), code.indexOf('return results;', code.indexOf('function parseNccTabData')) + 16);

function norm(str) { return str ? str.normalize('NFC').toLowerCase().trim() : ''; }
function removeAccents(str) {
    if (!str) return '';
    return String(str).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}
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
function detectWH(str) {
    if (!str) return '';
    str = str.toLowerCase();
    if (str.includes('thái bình')) return 'Thái Bình';
    if (str.includes('hải dương')) return 'Hải Dương';
    if (str.includes('hải phòng') && /kv2|kv3/i.test(str)) return 'Hải Dương';
    if (str.includes('hải phòng')) return 'Hải Phòng';
    if (str.includes('hưng yên') || str.includes('miền bắc')) return 'Hưng Yên';
    return '';
}
function normalizeSupplierName(name) {
    if (!name) return '';
    let clean = String(name).replace(/^[\s:;]+/, '').trim();
    if (!clean) return '';
    clean = clean.split(/\s+/).map(word => {
        if (!word) return '';
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
    const noTones = typeof removeAccents === 'function' ? removeAccents(clean).toLowerCase() : norm(clean);
    const standardNames = {
        'thien phu': 'Thiên Phú', 'duy phat': 'Duy Phát', 'hoang minh': 'Hoàng Minh',
        'hoa vinh': 'Hoa Vinh', 'dao truong an': 'Đạo Trường An', 'dai minh': 'Đại Minh',
        'tal': 'TAL', 'nak': 'NAK', 'long thanh': 'Long Thành', 'gach htc': 'Gạch HTC', 'tien phat': 'Tiến Phát'
    };
    for (const key in standardNames) { if (noTones.includes(key)) return standardNames[key]; }
    if (standardNames[noTones]) return standardNames[noTones];
    if (noTones === 'tal') return 'TAL';
    if (noTones === 'nak') return 'NAK';
    if (clean.toUpperCase() === 'TAL') return 'TAL';
    if (clean.toUpperCase() === 'NAK') return 'NAK';
    return clean;
}

eval(parseFuncStr);

https.get('https://docs.google.com/spreadsheets/d/1jFaJutdZD8uhBYa9Hy9fH6tHVaSnEf-iyg4VUMniXl8/gviz/tq?gid=1482895796&headers=1', res => {
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
    });
});
