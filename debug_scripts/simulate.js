const nccTripData = [
  {
    dateStr: '26/06/2026',
    plate: '29H-93516',
    warehouse: 'Kho GXT Phú Thọ',
    ncc: 'Thiên Phú',
    totalCost: 1119432,
    ghnTripCode: null
  }
];

const month = '2026-07';

function getCycleRange(monthStr) {
    const parts = monthStr.split('-');
    const y = parseInt(parts[0]);
    const m = parseInt(parts[1]) - 1; // 0-based
    const start = new Date(y, m - 1, 26);
    const end = new Date(y, m, 25);
    return { start, end };
}

function isInCycle(dateObj, monthStr) {
    const range = getCycleRange(monthStr);
    const d = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    return d >= range.start && d <= range.end;
}

let pivotData = {};
let hasData = false;

nccTripData.forEach(r => {
    const parts = String(r.dateStr || '').split('/');
    if (parts.length === 3) {
        const rowDateObj = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        if (month && !isInCycle(rowDateObj, month)) return;
    } else if (month) {
        return;
    }
    
    let kho = String(r.warehouse || '').trim();
    const bienSo = String(r.plate || '').trim();
    if(!kho || !bienSo) return;
    
    let khoGroup = kho;
    const khoUpper = khoGroup.toUpperCase();
    if(khoUpper.includes('PHÚ THỌ')) khoGroup = 'Kho GXT Phú Thọ';
    
    if(!pivotData[khoGroup]) pivotData[khoGroup] = {};
    if(!pivotData[khoGroup][bienSo]) {
        pivotData[khoGroup][bienSo] = { records: [] };
    }
    pivotData[khoGroup][bienSo].records.push(r);
    hasData = true;
});

console.log('hasData:', hasData);
console.log('pivotData:', JSON.stringify(pivotData, null, 2));
