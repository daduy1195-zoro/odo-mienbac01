const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const regexColors = /const isLight = document\.documentElement\.getAttribute[\s\S]*?return 'rgb\(' \+ r \+ ', ' \+ g \+ ', ' \+ b \+ '\)';\s*\}/;

const replacementColors = `function getDivergingColor(value, avg, margin) {
        if (!value || value <= 0) return 'var(--text-muted)';
        if (!avg) return 'var(--text-primary)';
        
        let diff = value - avg;
        if (diff > margin) diff = margin;
        if (diff < -margin) diff = -margin;
        
        let ratio = diff / margin; 
        
        if (ratio > 0) {
            let pct = Math.round(ratio * 100);
            return 'color-mix(in srgb, #ef4444 ' + pct + '%, var(--text-primary))';
        } else {
            let pct = Math.round(-ratio * 100);
            return 'color-mix(in srgb, #10b981 ' + pct + '%, var(--text-primary))';
        }
    }`;

if (code.match(regexColors)) {
    code = code.replace(regexColors, replacementColors);
    fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
    console.log('Light mode support via color-mix added.');
} else {
    console.log('regexColors not found');
}
