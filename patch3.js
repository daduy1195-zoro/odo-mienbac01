const fs = require('fs');
let c = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8').split('\n');

for (let i = 4050; i < 4300; i++) {
    if (!c[i]) continue;
    
    // Fix colKmDiff scanner
    if (c[i].includes('colKmDiff = ci;')) {
        c[i] = c[i].replace(/h\.includes\('tổng km'\) \|\| h\.includes\('số km'\)/, "h.includes('tổng km') || (h.includes('số km') && !h.includes('vào') && !h.includes('ra') && !h.includes('phát sinh') && !h.includes('/'))");
        // Also remove 'km phát sinh' from colKmDiff because it conflicts with colKmOver
        c[i] = c[i].replace(/h\.includes\('km phát sinh'\) \|\| /, "");
    }
    
    // Fix colKmOver scanner
    if (c[i].includes('colKmOver = ci;')) {
        // Keep it as is, or make it stricter if needed. 
        // Currently: if (h.includes('số km phát sinh tăng') || h.includes('km phát sinh tăng')) colKmOver = ci;
    }
}
fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', c.join('\n'));
console.log('Patched scanners');
