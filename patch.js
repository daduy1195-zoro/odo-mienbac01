const fs=require('fs');
let c=fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html','utf8');
c = c.replace(
    "const colData = new Array(maxRow + 1).fill('');",
    "const colData = new Array(maxRow + 1).fill('\\t');"
);
c = c.replace(
    "colData[r.sourceRow] = code;",
    "let note = r.note || '';\n        colData[r.sourceRow] = code + '\\t' + note;"
);
c = c.replace(
    "3. ?n Ctrl+V d? dán toàn b? d? li?u.');",
    "3. ?n Ctrl+V d? dán toàn b? d? li?u AC và AD.');"
);
fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', c);
console.log('Patched');
