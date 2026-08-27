const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

// Add --row-zebra to :root
if (!code.includes('--row-zebra: rgba(255, 255, 255, 0.02);')) {
    code = code.replace('--bg-primary: #080d0f;', '--row-zebra: rgba(255, 255, 255, 0.02);\n            --bg-primary: #080d0f;');
}

// Add --row-zebra to :root.light-mode
if (!code.includes('--row-zebra: rgba(0, 0, 0, 0.04);')) {
    code = code.replace('--bg-primary: #f0f4f4;', '--row-zebra: rgba(0, 0, 0, 0.04);\n            --bg-primary: #f0f4f4;');
}

// Replace in renderNcc
code = code.replace(
    /let bg = rowIndex % 2 === 0 \? 'background: rgba\\(255, 255, 255, 0\\.02\\);' : 'background: transparent;';/g,
    "let bg = rowIndex % 2 === 0 ? 'background: var(--row-zebra);' : 'background: transparent;';"
);

// We should also replace the font color of the plate from hardcoded #cbd5e1 to a variable if possible, or leave it.
// Actually, let's use var(--text-primary) for the plate name.
code = code.replace(
    /font-weight:600; color: #cbd5e1;"/g,
    'font-weight:600; color: var(--text-primary);"'
);

// Let's replace getColor to return dark colors for yellow/red if in light mode, or keep it same.
// In light mode, yellow (#fcd34d) on white background is very hard to read!
// Red (#ef4444) is okay.
// Maybe I can update getColor dynamically?
// Instead of messing with getColor, I can just use a slightly darker yellow for the gradient in light mode.
// Let's leave getColor for now, yellow is ok if they want "màu mè".

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Zebra and plate color patched');
