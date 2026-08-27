const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

// 1. Remove getColor function
code = code.replace(/function getColor\(value, min, max\) \{[\s\S]*?return `rgb\(\$\{r\}, \$\{g\}, \$\{b\}\)`;\s*\}/, 
`function getColor(value) {
        if (!value || value <= 0) return 'var(--text-muted)';
        return 'var(--text-primary)';
    }`);

// 2. Change headers from fbbf24 to var(--accent)
code = code.replace(/<th style="text-align:right;color:#fbbf24;">/g, '<th style="text-align:right;color:var(--accent);">');

// 3. Change sub-totals colors
code = code.replace(/<td style="text-align:right; font-weight: bold; color:#f59e0b; font-size: 14px;">/g, '<td style="text-align:right; font-weight: bold; color:var(--text-primary); font-size: 14px;">');
code = code.replace(/<td style="text-align:right; font-weight: bold; color:#fbbf24;">/g, '<td style="text-align:right; font-weight: bold; color:var(--text-primary);">');

// 4. Update the calls to getColor inside the carRows loop
code = code.replace(/getColor\(data\.chiPhi, minCost, maxCost\)/g, 'getColor(data.chiPhi)');
code = code.replace(/getColor\(data\.kmPhatSinh, 0, maxKm\)/g, 'getColor(data.kmPhatSinh)');
code = code.replace(/getColor\(data\.phiVuotKm, 0, maxPhiVuot\)/g, 'getColor(data.phiVuotKm)');
code = code.replace(/getColor\(data\.thoiGianTangCa, 0, maxTgOt\)/g, 'getColor(data.thoiGianTangCa)');
code = code.replace(/getColor\(data\.phiTangCa, 0, maxPhiOt\)/g, 'getColor(data.phiTangCa)');
code = code.replace(/getColor\(data\.phiCauDuong, 0, maxPhiCau\)/g, 'getColor(data.phiCauDuong)');

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Colors patched.');
