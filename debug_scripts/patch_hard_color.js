const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const regexFunc = /function getDivergingColor\(value, avg, margin\) \{/;
const replacementFunc = `function getCostColor(value) {
        if (!value || value <= 0) return 'var(--text-muted)';
        if (value < 30000000) return '#10b981';
        if (value > 36000000) return '#ef4444';
        return 'var(--text-primary)';
    }

    function getDivergingColor(value, avg, margin) {`;

code = code.replace(regexFunc, replacementFunc);

const regexCall = /getDivergingColor\(data\.chiPhi, parsedKhoStats\[data\.kho \|\| 'Unknown'\]\.chiPhi, parsedKhoStats\[data\.kho \|\| 'Unknown'\]\.mChiPhi\)/;
const replacementCall = `getCostColor(data.chiPhi)`;
code = code.replace(regexCall, replacementCall);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Cost color patched.');
