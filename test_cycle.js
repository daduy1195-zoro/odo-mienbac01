function extractDateStr(row) {
    for (let i = 0; i < 5; i++) {
        let s = String(row[i]).trim();
        let m = s.match(/^(\d{2}\/\d{2}\/\d{4})/);
        if (m) return m[1];
    }
    return null;
}

function getCycle(dateStr) {
    if (!dateStr) return 'UNKNOWN';
    let parts = dateStr.split('/');
    if (parts.length !== 3) return 'UNKNOWN';
    let d = parseInt(parts[0], 10);
    let m = parseInt(parts[1], 10);
    let y = parseInt(parts[2], 10);
    
    if (d >= 26) {
        m += 1;
        if (m > 12) { m = 1; y += 1; }
    }
    return y + '_' + (m < 10 ? '0' + m : m);
}

const row1 = ["1", "26/07/2026 14:00", "29H-93516"];
const row2 = ["2", "25/08/2026", "29H-93516"];
const row3 = ["3", "Invalid", "29H-93516"];

console.log(extractDateStr(row1), "->", getCycle(extractDateStr(row1)));
console.log(extractDateStr(row2), "->", getCycle(extractDateStr(row2)));
console.log(extractDateStr(row3), "->", getCycle(extractDateStr(row3)));
