const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const regex = /const \{ typos, plateTypos, masterMismatches \} = detectTypos\(filtered\);\s*const totalIssues = typos\.length \+ plateTypos\.length \+ masterMismatches\.length;\s*document\.getElementById\('typoBadge'\)\.textContent = totalIssues;\s*document\.getElementById\('typoCount'\)\.textContent = totalIssues \+ ' l.i';/;

const replace = `const { typos, plateTypos, masterMismatches } = detectTypos(filtered);

    const filteredPlateTypos = plateTypos.filter(t => {
        const prov = getProvinceFromPlate(t.wrongPlate);
        return MY_PROVINCES.some(p => prov.includes(p));
    });

    const totalIssues = typos.length + filteredPlateTypos.length + masterMismatches.length;
    document.getElementById('typoBadge').textContent = totalIssues;
    document.getElementById('typoCount').textContent = totalIssues + ' lỗi';`;

if (content.match(regex)) {
    content = content.replace(regex, replace);
    
    // Also remove the old filteredPlateTypos declaration
    const regex2 = /const filteredPlateTypos = plateTypos\.filter\(t => \{\s*const prov = getProvinceFromPlate\(t\.wrongPlate\);\s*return MY_PROVINCES\.some\(p => prov\.includes\(p\)\);\s*\}\);/;
    if (content.match(regex2)) {
        content = content.replace(regex2, '');
    }
    
    fs.writeFileSync('index.html', content, 'utf8');
    console.log("Fixed typo badge count.");
} else {
    console.log("Regex not found.");
}
