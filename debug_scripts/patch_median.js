const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const regexStats = /function getStats\(arr\) \{[\s\S]*?return \{ avg, std: Math\.sqrt\(variance\) \};\s*\}/;
const replacementStats = `function getStats(arr) {
        const valid = arr.filter(x => x > 0);
        if (valid.length === 0) return { avg: 0, std: 0, median: 0 };
        const avg = valid.reduce((a, b) => a + b, 0) / valid.length;
        const variance = valid.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / valid.length;
        
        valid.sort((a, b) => a - b);
        const mid = Math.floor(valid.length / 2);
        const median = valid.length % 2 !== 0 ? valid[mid] : (valid[mid - 1] + valid[mid]) / 2;
        
        return { avg, std: Math.sqrt(variance), median };
    }`;

if (code.match(regexStats)) {
    code = code.replace(regexStats, replacementStats);
    console.log('Stats function updated with median.');
}

const regexParsed = /parsedKhoStats\[k\] = \{[\s\S]*?phiCau: sPhiCau\.avg, mPhiCau: Math\.max\(sPhiCau\.std, sPhiCau\.avg \* 0\.1\) \|\| 100000\s*\};/;
const replacementParsed = `parsedKhoStats[k] = {
            chiPhi: sChiPhi.median, mChiPhi: 2000000,
            km: sKm.median, mKm: Math.max(sKm.std, sKm.median * 0.1) || 100,
            phiVuot: sPhiVuot.median, mPhiVuot: Math.max(sPhiVuot.std, sPhiVuot.median * 0.1) || 200000,
            tgOt: sTgOt.median, mTgOt: Math.max(sTgOt.std, sTgOt.median * 0.1) || 5,
            phiOt: sPhiOt.median, mPhiOt: Math.max(sPhiOt.std, sPhiOt.median * 0.1) || 200000,
            phiCau: sPhiCau.median, mPhiCau: Math.max(sPhiCau.std, sPhiCau.median * 0.1) || 100000
        };`;

if (code.match(regexParsed)) {
    code = code.replace(regexParsed, replacementParsed);
    console.log('Parsed stats updated to use median.');
}

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
