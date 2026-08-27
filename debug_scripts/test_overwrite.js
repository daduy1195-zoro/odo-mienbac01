const allNccData = [
    { dateStr: '27/06/2026', ncc: 'Đại Minh', plate: '29H-12345', tabName: 'database', totalCost: 100 }
];

const record = { dateStr: '27/06/2026', ncc: 'Đại Minh', plate: '29H-99999', tabName: 'database', totalCost: 500 };

const normPlate = '29h99999';
const existingIdx = allNccData.findIndex(r => {
    if (r.dateStr !== record.dateStr) return false;
    if (r.ncc !== record.ncc) return false;
    const rTab = 'database';
    const normTab = 'database';
    if (normTab && rTab && (normTab === rTab || normTab.includes(rTab) || rTab.includes(normTab))) return true;
    if ('29h12345' === normPlate) return true;
    return false;
});

console.log('existingIdx:', existingIdx);
