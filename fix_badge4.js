const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const strToFind = `    const filteredPlateTypos = plateTypos.filter(t => {
        const prov = getProvinceFromPlate(t.wrongPlate);
        return MY_PROVINCES.some(p => prov.includes(p));
    });
    if (filteredPlateTypos.length > 0) {`;

const strToReplace = `    if (filteredPlateTypos.length > 0) {`;

if (content.includes(strToFind)) {
    // This will replace the FIRST occurrence, but wait, we need to replace the SECOND one.
    // The first occurrence in the file is the one we injected at the top.
    // Let's just find the exact block around 'Bảng 2: Sai biển số'
    const index = content.lastIndexOf("const filteredPlateTypos = plateTypos.filter");
    if (index !== -1) {
        // We know it's 4 lines long:
        // const filteredPlateTypos = plateTypos.filter(t => {
        //     const prov = getProvinceFromPlate(t.wrongPlate);
        //     return MY_PROVINCES.some(p => prov.includes(p));
        // });
        const before = content.substring(0, index);
        let after = content.substring(index);
        after = after.replace(/const filteredPlateTypos = plateTypos\.filter\(t => \{\s*const prov = getProvinceFromPlate\(t\.wrongPlate\);\s*return MY_PROVINCES\.some\(p => prov\.includes\(p\)\);\s*\}\);/, '');
        content = before + after;
        fs.writeFileSync('index.html', content, 'utf8');
        console.log("Successfully removed the second declaration.");
    }
} else {
    console.log("Not found.");
}
