const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Search for the exact tripNote pattern
const idx = content.indexOf('const finalKey = `${nccName}_${plate}_${dateStr}_${sourceRow}`;');
if (idx === -1) {
    console.log('Cannot find finalKey line');
    process.exit(1);
}

// Check if tripNote is already declared nearby
const nearby = content.substring(idx, idx + 200);
if (nearby.includes('let tripNote')) {
    console.log('tripNote already declared - SKIPPED');
    process.exit(0);
}

// Find the "try {" after finalKey
const tryIdx = content.indexOf('try {', idx);
if (tryIdx === -1 || tryIdx - idx > 100) {
    console.log('Cannot find try { near finalKey');
    process.exit(1);
}

// Insert "let tripNote = '';\n        " before "try {"
content = content.substring(0, tryIdx) + "let tripNote = '';\n        " + content.substring(tryIdx);
fs.writeFileSync('index.html', content, 'utf8');
console.log('FIX tripNote: OK');
