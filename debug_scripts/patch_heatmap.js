const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

// Restore getColor to a heatmap, but using White to Red
const newGetColor = `function getColor(value, min, max) {
        if (!value || value <= 0) return 'var(--text-muted)';
        if (max <= min) return 'var(--text-primary)';
        let ratio = (value - min) / (max - min);
        // From Light Blue (#bae6fd: 186, 230, 253) to Pink/Red (#f43f5e: 244, 63, 94)
        // Or just from White (#f8fafc: 248, 250, 252) to Red (#ef4444: 239, 68, 68)
        // Let's use Cyan/Teal to Red since they like Teal (accent is #14b8a6)
        // Accent: 20, 184, 166. Red: 239, 68, 68
        const r1 = 20, g1 = 184, b1 = 166;
        const r2 = 239, g2 = 68, b2 = 68;
        const r = Math.round(r1 + (r2 - r1) * ratio);
        const g = Math.round(g1 + (g2 - g1) * ratio);
        const b = Math.round(b1 + (b2 - b1) * ratio);
        return \`rgb(\${r}, \${g}, \${b})\`;
    }`;

code = code.replace(/function getColor\(value\) \{[\s\S]*?return 'var\(--text-primary\)';\s*\}/, newGetColor);

// Restore calls to getColor with min/max
code = code.replace(/getColor\(data\.chiPhi\)/g, 'getColor(data.chiPhi, minCost, maxCost)');
code = code.replace(/getColor\(data\.kmPhatSinh\)/g, 'getColor(data.kmPhatSinh, 0, maxKm)');
code = code.replace(/getColor\(data\.phiVuotKm\)/g, 'getColor(data.phiVuotKm, 0, maxPhiVuot)');
code = code.replace(/getColor\(data\.thoiGianTangCa\)/g, 'getColor(data.thoiGianTangCa, 0, maxTgOt)');
code = code.replace(/getColor\(data\.phiTangCa\)/g, 'getColor(data.phiTangCa, 0, maxPhiOt)');
code = code.replace(/getColor\(data\.phiCauDuong\)/g, 'getColor(data.phiCauDuong, 0, maxPhiCau)');

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Heatmap restored with Teal -> Red.');
