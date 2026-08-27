const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const regexColors = /function getDivergingColor\(value, avg, margin\) \{[\s\S]*?return 'rgb\(' \+ r \+ ', ' \+ g \+ ', ' \+ b \+ '\)';\s*\}/;

const replacementColors = `const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const baseR = isLight ? 51 : 255; // #334155 (slate-700) for light, #ffffff for dark
    const baseG = isLight ? 65 : 255;
    const baseB = isLight ? 85 : 255;

    function getDivergingColor(value, avg, margin) {
        if (!value || value <= 0) return 'var(--text-muted)';
        if (!avg) return 'var(--text-primary)';
        
        let diff = value - avg;
        if (diff > margin) diff = margin;
        if (diff < -margin) diff = -margin;
        
        let ratio = diff / margin; 
        
        let r, g, b;
        if (ratio > 0) {
            // Base to Red (#ef4444: 239, 68, 68)
            r = Math.round(baseR + (239 - baseR) * ratio);
            g = Math.round(baseG + (68 - baseG) * ratio);
            b = Math.round(baseB + (68 - baseB) * ratio);
        } else {
            // Base to Green (#10b981: 16, 185, 129)
            let negRatio = -ratio; 
            r = Math.round(baseR + (16 - baseR) * negRatio);
            g = Math.round(baseG + (185 - baseG) * negRatio);
            b = Math.round(baseB + (129 - baseB) * negRatio);
        }
        return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    }`;

if (code.match(regexColors)) {
    code = code.replace(regexColors, replacementColors);
    fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
    console.log('Light mode support added.');
} else {
    console.log('regexColors not found');
}
