const https = require('https');
const fs = require('fs');

const code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

// Trích xuất các hàm cần thiết
let parseNccTabDataStr = code.substring(code.indexOf('function parseNccTabData'), code.indexOf('return results;', code.indexOf('function parseNccTabData')) + 16);
let detectWHStr = code.substring(code.indexOf('function detectWH'), code.indexOf('};', code.indexOf('function detectWH')) + 2);
let parseNumStr = code.substring(code.indexOf('function parseVietnameseNumber'), code.indexOf('}', code.indexOf('function parseVietnameseNumber')) + 1);
let normSupStr = code.substring(code.indexOf('function normalizeSupplierName'), code.indexOf('}', code.lastIndexOf('if (clean.toUpperCase() === \'NAK\')')) + 1);
let normStr = code.substring(code.indexOf('function norm('), code.indexOf('}', code.indexOf('function norm(')) + 1);

const context = {
    results: [],
    console: console,
    detectWH: function(str) {
        if (!str) return '';
        str = str.toLowerCase();
        if (str.includes('thái bình')) return 'Thái Bình';
        if (str.includes('hải dương')) return 'Hải Dương';
        if (str.includes('hải phòng') && /kv2|kv3/i.test(str)) return 'Hải Dương';
        if (str.includes('hải phòng')) return 'Hải Phòng';
        if (str.includes('hưng yên') || str.includes('miền bắc')) return 'Hưng Yên';
        return '';
    },
    parseVietnameseNumber: function(str) {
        if (str === null || str === undefined) return 0;
        let s = String(str).replace(/[^\d,\.-]/g, '');
        if (s.includes(',') && s.includes('.')) s = s.replace(/\./g, '').replace(',', '.');
        else if (s.includes(',')) s = s.replace(/,/g, '.');
        const v = parseFloat(s);
        return isNaN(v) ? 0 : v;
    },
    norm: function(str) {
        if (!str) return '';
        return String(str).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/đ/g, 'd');
    },
    normalizeSupplierName: function(name) {
        if (!name) return '';
        let clean = String(name).replace(/^[\s:;]+/, '').trim();
        if (!clean) return '';
        clean = clean.split(/\s+/).map(w => w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : '').join(' ');
        const noTones = this.norm(clean);
        const standardNames = {
            'thien phu': 'Thiên Phú', 'duy phat': 'Duy Phát', 'hoang minh': 'Hoàng Minh',
            'hoa vinh': 'Hoa Vinh', 'dao truong an': 'Đạo Trường An', 'dai minh': 'Đại Minh',
            'tal': 'TAL', 'nak': 'NAK', 'long thanh': 'Long Thành', 'gach htc': 'Gạch HTC', 'tien phat': 'Tiến Phát'
        };
        for (const key in standardNames) { if (noTones.includes(key)) return standardNames[key]; }
        return clean;
    }
};

eval(parseNccTabDataStr);

https.get('https://docs.google.com/spreadsheets/d/1jFaJutdZD8uhBYa9Hy9fH6tHVaSnEf-iyg4VUMniXl8/gviz/tq?gid=1482895796&headers=0', res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const json = JSON.parse(data.substring(data.indexOf('{'), data.lastIndexOf('}') + 1));
        const rawData = json.table.rows.map(r => r.c.map(cell => {
            if (!cell) return '';
            // Simulate fetchNccSheetJSONP date mapping
            let sv = cell.v !== null && cell.v !== undefined ? String(cell.v) : '';
            const dateMatch = sv.match(/^Date\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
            if (dateMatch && parseInt(dateMatch[1]) >= 1900) {
                const dd = String(parseInt(dateMatch[3])).padStart(2, '0');
                const mm = String(parseInt(dateMatch[2]) + 1).padStart(2, '0');
                return dd + '/' + mm + '/' + dateMatch[1];
            }
            return cell.f || cell.v || '';
        }));
        
        const parsed = parseNccTabData(rawData, 'ALL', new Map(), '1jFaJutdZD8uhBYa9Hy9fH6tHVaSnEf-iyg4VUMniXl8', '', '1482895796');
        
        console.log('Total parsed from ALL sheet:', parsed.length);
        
        // Sum totalCost for Kho GXT Hải Phòng
        let total = 0;
        let plate618 = 0;
        parsed.forEach(r => {
            if (r.warehouse === 'Hải Phòng') {
                total += r.totalCost || 0;
                if (r.plate.includes('618')) {
                    plate618++;
                }
            }
        });
        console.log('Kho Hải Phòng Total:', total);
        console.log('29G-00618 count:', plate618);
    });
});
