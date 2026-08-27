const https = require('https');

// Simulating deduplication and filtering just like index.html
function norm(str) {
    if (!str) return '';
    return String(str).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/đ/g, 'd');
}

function parseVietnameseNumber(str) {
    if (str === null || str === undefined) return 0;
    let s = String(str).replace(/[^\d,\.-]/g, '');
    if (s.includes(',') && s.includes('.')) s = s.replace(/\./g, '').replace(',', '.');
    else if (s.includes(',')) s = s.replace(/,/g, '.');
    const v = parseFloat(s);
    return isNaN(v) ? 0 : v;
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
    clean = clean.split(/\s+/).map(w => w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : '').join(' ');
    const noTones = norm(clean);
    const standardNames = {
        'thien phu': 'Thiên Phú', 'duy phat': 'Duy Phát', 'hoang minh': 'Hoàng Minh',
        'hoa vinh': 'Hoa Vinh', 'dao truong an': 'Đạo Trường An', 'dai minh': 'Đại Minh',
        'tal': 'TAL', 'nak': 'NAK', 'long thanh': 'Long Thành', 'gach htc': 'Gạch HTC', 'tien phat': 'Tiến Phát'
    };
    for (const key in standardNames) { if (noTones.includes(key)) return standardNames[key]; }
    return clean;
}

function getCycleRange(monthStr) {
    const parts = monthStr.split(' ');
    const p1 = parts[0].split('/');
    const p2 = parts[parts.length - 1].split('/');
    if (p1.length >= 2 && p2.length >= 3) {
        return {
            start: new Date(parseInt(p2[2]), parseInt(p1[1]) - 1, parseInt(p1[0])),
            end: new Date(parseInt(p2[2]), parseInt(p2[1]) - 1, parseInt(p2[0]))
        };
    }
    return null;
}

function isInCycle(dateObj, monthStr) {
    if (!dateObj || !monthStr) return false;
    const range = getCycleRange(monthStr);
    if (!range) return false;
    const d = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    return d >= range.start && d <= range.end;
}

function normalizeStr(s) {
    return s ? String(s).trim().toLowerCase().replace(/[-\s\.]/g, '') : '';
}

async function fetchJSONP(url) {
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data.substring(data.indexOf('{'), data.lastIndexOf('}') + 1));
                    resolve(json);
                } catch(e) { reject(e); }
            });
        });
    });
}

async function run() {
    let allNccData = [];
    
    // 1. Load a random individual sheet (e.g. Đại Minh) to populate initial data
    const dmJson = await fetchJSONP('https://docs.google.com/spreadsheets/d/1aa_3Nwi0Z-SlGi-jZs1cNkU0v3Yt6p_9Fc4lr_oA5vY/gviz/tq?gid=942983334&headers=1');
    const dmRaw = dmJson.table.rows.map(r => r.c.map(cell => {
        if (!cell) return '';
        let sv = cell.v !== null && cell.v !== undefined ? String(cell.v) : '';
        const dateMatch = sv.match(/^Date\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
        if (dateMatch && parseInt(dateMatch[1]) >= 1900) {
            const dd = String(parseInt(dateMatch[3])).padStart(2, '0');
            const mm = String(parseInt(dateMatch[2]) + 1).padStart(2, '0');
            return dd + '/' + mm + '/' + dateMatch[1];
        }
        return cell.f || cell.v || '';
    }));
    
    for (let i = 1; i < dmRaw.length; i++) {
        const row = dmRaw[i];
        if (!row || row.length < 5) continue;
        let dateStr = (row[1] || '').toString().trim(); // Đại Minh date is col 1
        let plate = (row[3] || '').toString().trim();
        let ncc = normalizeSupplierName('Đại Minh');
        let totalCost = parseVietnameseNumber(row[28]); // Total cost for Dai Minh is col 28
        let route = (row[5] || '').toString().trim();
        let khoStr = route; // Usually route contains kho
        let warehouse = detectWH(khoStr);
        if (!dateStr || !plate) continue;
        allNccData.push({ dateStr, plate, ncc, warehouse, totalCost, tabName: '' });
    }
    
    // 2. Load ALL sheet
    const allJson = await fetchJSONP('https://docs.google.com/spreadsheets/d/1jFaJutdZD8uhBYa9Hy9fH6tHVaSnEf-iyg4VUMniXl8/gviz/tq?sheet=database&headers=1');
    const allRaw = allJson.table.rows.map(r => r.c.map(cell => {
        if (!cell) return '';
        let sv = cell.v !== null && cell.v !== undefined ? String(cell.v) : '';
        const dateMatch = sv.match(/^Date\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
        if (dateMatch && parseInt(dateMatch[1]) >= 1900) {
            const dd = String(parseInt(dateMatch[3])).padStart(2, '0');
            const mm = String(parseInt(dateMatch[2]) + 1).padStart(2, '0');
            return dd + '/' + mm + '/' + dateMatch[1];
        }
        return cell.f || cell.v || '';
    }));
    
    for (let i = 1; i < allRaw.length; i++) {
        const row = allRaw[i];
        if (!row || row.length < 5) continue;
        
        let dateStr = (row[2] || '').toString().trim();
        let plate = (row[3] || '').toString().trim();
        let ncc = normalizeSupplierName((row[1] || '').toString().trim());
        let totalCost = parseVietnameseNumber(row[24]);
        
        let khoStr = (row[27] || '').toString().trim();
        let route = (row[5] || '').toString().trim();
        let warehouse = detectWH(khoStr) || detectWH(khoStr + ' ' + route.toLowerCase());
        
        if (!dateStr || !plate) continue;
        
        const record = { dateStr, plate, ncc, warehouse, totalCost, tabName: 'database' };
        
        const normPlate = normalizeStr(plate);
        const existingIdx = allNccData.findIndex(r => {
            if (r.dateStr !== record.dateStr) return false;
            if (r.ncc !== record.ncc) return false;
            const rTab = normalizeStr(r.tabName);
            const normTab = normalizeStr(record.tabName);
            if (normTab && rTab && (normTab === rTab || normTab.includes(rTab) || rTab.includes(normTab))) return true;
            if (normalizeStr(r.plate) === normPlate) return true;
            return false;
        });
        
        if (existingIdx !== -1) {
            allNccData[existingIdx] = record;
        } else {
            allNccData.push(record);
        }
    }
    
    // Filter by cycle
    const monthStr = '26/06 -> 25/07/2026';
    let filtered = allNccData.filter(r => {
        const parts = r.dateStr.split('/');
        if (parts.length === 3) {
            const rowDateObj = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
            if (!isInCycle(rowDateObj, monthStr)) return false;
            return true;
        }
        return false;
    });
    
    let hpTotal = 0;
    filtered.forEach(r => {
        if (r.warehouse === 'Hải Phòng') hpTotal += r.totalCost;
    });
    
    console.log('Final Kho Hải Phòng total:', hpTotal);
}

run();
