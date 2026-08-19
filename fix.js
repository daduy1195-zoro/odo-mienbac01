const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

content = content.replace(
    /if \(rowStr\.includes\('biển số'\) \|\| \(rowStr\.includes\('stt'\) && rowStr\.includes\('lộ trình'\)\)\) \{/,
    "if (rowStr.includes('biển số') || (rowStr.includes('stt') && rowStr.includes('lộ trình')) || rowStr.includes('lộ trình')) {"
);

fs.writeFileSync('index.html', content, 'utf8');
console.log('Updated index.html');
