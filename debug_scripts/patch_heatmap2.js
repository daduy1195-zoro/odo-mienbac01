const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const regexColors = /function getColor\(value, min, max\) \{[\s\S]*?return 'rgb\(' \+ r \+ ', ' \+ g \+ ', ' \+ b \+ '\)';\s*\}/;

const replacementColors = `function getStats(arr) {
        const valid = arr.filter(x => x > 0);
        if (valid.length === 0) return { avg: 0, std: 0 };
        const avg = valid.reduce((a, b) => a + b, 0) / valid.length;
        const variance = valid.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / valid.length;
        return { avg, std: Math.sqrt(variance) };
    }

    const chiPhiArr = [], kmArr = [], phiVuotArr = [], tgOtArr = [], phiOtArr = [], phiCauArr = [];
    pivotData.forEach(d => {
        if (d.chiPhi > 0) chiPhiArr.push(d.chiPhi);
        if (d.kmPhatSinh > 0) kmArr.push(d.kmPhatSinh);
        if (d.phiVuotKm > 0) phiVuotArr.push(d.phiVuotKm);
        if (d.thoiGianTangCa > 0) tgOtArr.push(d.thoiGianTangCa);
        if (d.phiTangCa > 0) phiOtArr.push(d.phiTangCa);
        if (d.phiCauDuong > 0) phiCauArr.push(d.phiCauDuong);
    });

    const sChiPhi = getStats(chiPhiArr);
    const sKm = getStats(kmArr);
    const sPhiVuot = getStats(phiVuotArr);
    const sTgOt = getStats(tgOtArr);
    const sPhiOt = getStats(phiOtArr);
    const sPhiCau = getStats(phiCauArr);

    const mChiPhi = 2000000; // User requested 2M margin for cost
    const mKm = Math.max(sKm.std, sKm.avg * 0.1) || 100;
    const mPhiVuot = Math.max(sPhiVuot.std, sPhiVuot.avg * 0.1) || 200000;
    const mTgOt = Math.max(sTgOt.std, sTgOt.avg * 0.1) || 5;
    const mPhiOt = Math.max(sPhiOt.std, sPhiOt.avg * 0.1) || 200000;
    const mPhiCau = Math.max(sPhiCau.std, sPhiCau.avg * 0.1) || 100000;

    function getDivergingColor(value, avg, margin) {
        if (!value || value <= 0) return 'var(--text-muted)';
        if (!avg) return 'var(--text-primary)';
        
        let diff = value - avg;
        if (diff > margin) diff = margin;
        if (diff < -margin) diff = -margin;
        
        let ratio = diff / margin; 
        
        let r, g, b;
        if (ratio > 0) {
            // White to Red (#ef4444)
            r = Math.round(255 + (239 - 255) * ratio);
            g = Math.round(255 + (68 - 255) * ratio);
            b = Math.round(255 + (68 - 255) * ratio);
        } else {
            // White to Green (#10b981)
            let negRatio = -ratio; 
            r = Math.round(255 + (16 - 255) * negRatio);
            g = Math.round(255 + (185 - 255) * negRatio);
            b = Math.round(255 + (129 - 255) * negRatio);
        }
        return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    }`;

if (code.match(regexColors)) {
    code = code.replace(regexColors, replacementColors);
} else {
    console.log('regexColors not found');
}

const regexRenderRows = /getColor\(data\.chiPhi, minCost, maxCost\)/g;
code = code.replace(/getColor\(data\.chiPhi, minCost, maxCost\)/g, "getDivergingColor(data.chiPhi, sChiPhi.avg, mChiPhi)");
code = code.replace(/getColor\(data\.kmPhatSinh, 0, maxKm\)/g, "getDivergingColor(data.kmPhatSinh, sKm.avg, mKm)");
code = code.replace(/getColor\(data\.phiVuotKm, 0, maxPhiVuot\)/g, "getDivergingColor(data.phiVuotKm, sPhiVuot.avg, mPhiVuot)");
code = code.replace(/getColor\(data\.thoiGianTangCa, 0, maxTgOt\)/g, "getDivergingColor(data.thoiGianTangCa, sTgOt.avg, mTgOt)");
code = code.replace(/getColor\(data\.phiTangCa, 0, maxPhiOt\)/g, "getDivergingColor(data.phiTangCa, sPhiOt.avg, mPhiOt)");
code = code.replace(/getColor\(data\.phiCauDuong, 0, maxPhiCau\)/g, "getDivergingColor(data.phiCauDuong, sPhiCau.avg, mPhiCau)");

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Colors replaced.');
