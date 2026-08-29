const fs=require('fs');
let c=fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html','utf8');
const search = 'const parsed = parseNccTabData(rawData, sheet.ncc, ghnTripMap, sheet.id, \\'\\', sheet.gid);\\r\\n            allNccData.push(...parsed);\\r\\n            totalTabs++;';
const replacement = \const parsed = parseNccTabData(rawData, sheet.ncc, ghnTripMap, sheet.id, '', sheet.gid);
            const normalizeStr = s => s ? String(s).trim().toLowerCase().replace(/[-\\\\s\\\\.]/g, '') : '';
            parsed.forEach(record => {
                const normPlate = normalizeStr(record.plate);
                const normNcc = normalizeStr(record.ncc);
                const normDate = normalizeStr(record.dateStr);
                const normTab = normalizeStr(record.tabName || record.vehicleCode || '');
                const existingIdx = allNccData.findIndex(r => {
                    if (normalizeStr(r.ncc) !== normNcc || normalizeStr(r.dateStr) !== normDate) return false;
                    const rTab = normalizeStr(r.tabName || r.vehicleCode || '');
                    if (normTab && rTab && (normTab === rTab || normTab.includes(rTab) || rTab.includes(normTab))) return true;
                    if (normalizeStr(r.plate) === normPlate) return true;
                    return false;
                });
                if (existingIdx !== -1) allNccData[existingIdx] = record;
                else allNccData.push(record);
            });
            totalTabs++;\;
if (c.includes('allNccData.push(...parsed);')) {
    c = c.replace(/const parsed = parseNccTabData\(rawData, sheet\.ncc, ghnTripMap, sheet\.id, '', sheet\.gid\);\s+allNccData\.push\(\.\.\.parsed\);\s+totalTabs\+\+;/, replacement);
    fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', c);
    console.log('Patched regex');
} else {
    console.log('Not found');
}
