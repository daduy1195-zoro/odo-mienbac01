const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const regexColors = /const chiPhiArr = \[\],[\s\S]*?const mPhiCau = Math\.max\(sPhiCau\.std, sPhiCau\.avg \* 0\.1\) \|\| 100000;/;

const replacementColors = `const khoStats = {};
    pivotData.forEach(d => {
        const k = d.kho || 'Unknown';
        if (!khoStats[k]) {
            khoStats[k] = { chiPhi: [], km: [], phiVuot: [], tgOt: [], phiOt: [], phiCau: [] };
        }
        if (d.chiPhi > 0) khoStats[k].chiPhi.push(d.chiPhi);
        if (d.kmPhatSinh > 0) khoStats[k].km.push(d.kmPhatSinh);
        if (d.phiVuotKm > 0) khoStats[k].phiVuot.push(d.phiVuotKm);
        if (d.thoiGianTangCa > 0) khoStats[k].tgOt.push(d.thoiGianTangCa);
        if (d.phiTangCa > 0) khoStats[k].phiOt.push(d.phiTangCa);
        if (d.phiCauDuong > 0) khoStats[k].phiCau.push(d.phiCauDuong);
    });

    const parsedKhoStats = {};
    Object.keys(khoStats).forEach(k => {
        const sChiPhi = getStats(khoStats[k].chiPhi);
        const sKm = getStats(khoStats[k].km);
        const sPhiVuot = getStats(khoStats[k].phiVuot);
        const sTgOt = getStats(khoStats[k].tgOt);
        const sPhiOt = getStats(khoStats[k].phiOt);
        const sPhiCau = getStats(khoStats[k].phiCau);

        parsedKhoStats[k] = {
            chiPhi: sChiPhi.avg, mChiPhi: 2000000,
            km: sKm.avg, mKm: Math.max(sKm.std, sKm.avg * 0.1) || 100,
            phiVuot: sPhiVuot.avg, mPhiVuot: Math.max(sPhiVuot.std, sPhiVuot.avg * 0.1) || 200000,
            tgOt: sTgOt.avg, mTgOt: Math.max(sTgOt.std, sTgOt.avg * 0.1) || 5,
            phiOt: sPhiOt.avg, mPhiOt: Math.max(sPhiOt.std, sPhiOt.avg * 0.1) || 200000,
            phiCau: sPhiCau.avg, mPhiCau: Math.max(sPhiCau.std, sPhiCau.avg * 0.1) || 100000
        };
    });`;

if (code.match(regexColors)) {
    code = code.replace(regexColors, replacementColors);
} else {
    console.log('regexColors not found');
}

const regexRender = /getDivergingColor\(data\.chiPhi, sChiPhi\.avg, mChiPhi\)/g;
code = code.replace(/getDivergingColor\(data\.chiPhi, sChiPhi\.avg, mChiPhi\)/g, "getDivergingColor(data.chiPhi, parsedKhoStats[data.kho || 'Unknown'].chiPhi, parsedKhoStats[data.kho || 'Unknown'].mChiPhi)");
code = code.replace(/getDivergingColor\(data\.kmPhatSinh, sKm\.avg, mKm\)/g, "getDivergingColor(data.kmPhatSinh, parsedKhoStats[data.kho || 'Unknown'].km, parsedKhoStats[data.kho || 'Unknown'].mKm)");
code = code.replace(/getDivergingColor\(data\.phiVuotKm, sPhiVuot\.avg, mPhiVuot\)/g, "getDivergingColor(data.phiVuotKm, parsedKhoStats[data.kho || 'Unknown'].phiVuot, parsedKhoStats[data.kho || 'Unknown'].mPhiVuot)");
code = code.replace(/getDivergingColor\(data\.thoiGianTangCa, sTgOt\.avg, mTgOt\)/g, "getDivergingColor(data.thoiGianTangCa, parsedKhoStats[data.kho || 'Unknown'].tgOt, parsedKhoStats[data.kho || 'Unknown'].mTgOt)");
code = code.replace(/getDivergingColor\(data\.phiTangCa, sPhiOt\.avg, mPhiOt\)/g, "getDivergingColor(data.phiTangCa, parsedKhoStats[data.kho || 'Unknown'].phiOt, parsedKhoStats[data.kho || 'Unknown'].mPhiOt)");
code = code.replace(/getDivergingColor\(data\.phiCauDuong, sPhiCau\.avg, mPhiCau\)/g, "getDivergingColor(data.phiCauDuong, parsedKhoStats[data.kho || 'Unknown'].phiCau, parsedKhoStats[data.kho || 'Unknown'].mPhiCau)");

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Kho stats patched.');
