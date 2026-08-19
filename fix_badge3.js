const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const regex = /\/\/ Bảng 2: Sai biển số \(so với danh sách NCC\) - CHỈ hiện 4 tỉnh quản lý\s*const filteredPlateTypos = plateTypos\.filter\(t => \{\s*const prov = getProvinceFromPlate\(t\.wrongPlate\);\s*return MY_PROVINCES\.some\(p => prov\.includes\(p\)\);\s*\}\);/;

const replace = `// Bảng 2: Sai biển số (so với danh sách NCC) - CHỈ hiện 4 tỉnh quản lý`;

if (content.match(regex)) {
    content = content.replace(regex, replace);
    fs.writeFileSync('index.html', content, 'utf8');
    console.log("Removed second declaration.");
} else {
    console.log("Regex not found.");
}
