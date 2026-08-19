const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const index = content.lastIndexOf("const filteredPlateTypos = plateTypos.filter");
if (index !== -1) {
    const before = content.substring(0, index);
    let after = content.substring(index);
    after = after.replace(/const filteredPlateTypos = plateTypos\.filter\(t => \{[\s\S]*?return MY_PROVINCES\.some\(p => prov\.includes\(p\)\);\s*\}\);/, '');
    content = before + after;
    fs.writeFileSync('index.html', content, 'utf8');
    console.log("Successfully removed the second declaration.");
} else {
    console.log("Not found.");
}
