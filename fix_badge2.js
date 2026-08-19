const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// 1. Move MY_PROVINCES up to the top of renderTypoWarnings
content = content.replace(/const MY_PROVINCES = \['Hải Dương', 'Hải Phòng', 'Hưng Yên', 'Thái Bình'\];\s*/, '');

const targetBlock = `function renderTypoWarnings(filtered) {
    const container = document.getElementById('typoTableContainer');
    // Chỉ lấy dữ liệu trong kỳ đối soát hiện tại
    const { typos, plateTypos, masterMismatches } = detectTypos(filtered);`;
    
const replaceBlock = `function renderTypoWarnings(filtered) {
    const container = document.getElementById('typoTableContainer');
    // Chỉ lấy dữ liệu trong kỳ đối soát hiện tại
    const { typos, plateTypos, masterMismatches } = detectTypos(filtered);
    const MY_PROVINCES = ['Hải Dương', 'Hải Phòng', 'Hưng Yên', 'Thái Bình'];

    const filteredPlateTypos = plateTypos.filter(t => {
        const prov = getProvinceFromPlate(t.wrongPlate);
        return MY_PROVINCES.some(p => prov.includes(p));
    });`;

// Wait, need to find the exact targetBlock, there might be unicode issues. Let's use regex.
const funcStartRegex = /function renderTypoWarnings\(filtered\) \{[\s\S]*?const \{ typos, plateTypos, masterMismatches \} = detectTypos\(filtered\);/;
if (content.match(funcStartRegex)) {
    content = content.replace(funcStartRegex, replaceBlock);
}

// 2. Fix the missing filteredPlateTypos and l?i issue around totalIssues
const totalIssuesRegex = /const totalIssues = typos\.length \+ filteredPlateTypos\.length \+ masterMismatches\.length;[\s\S]*?document\.getElementById\('typoCount'\)\.textContent = totalIssues \+ ' l\?i';/;
const totalIssuesReplace = `const totalIssues = typos.length + filteredPlateTypos.length + masterMismatches.length;
    document.getElementById('typoBadge').textContent = totalIssues;
    document.getElementById('typoCount').textContent = totalIssues + ' lỗi';`;
if (content.match(totalIssuesRegex)) {
    content = content.replace(totalIssuesRegex, totalIssuesReplace);
}

// 3. Remove the original filteredPlateTypos declaration
const originalFilteredRegex = /const filteredPlateTypos = plateTypos\.filter\(t => \{[\s\S]*?return MY_PROVINCES\.some\(p => prov\.includes\(p\)\);\s*\}\);/;
if (content.match(originalFilteredRegex)) {
    // Note: If we already injected one at the top, this will match the first one!
    // We need to replace globally, but wait, we just injected the exact same thing at the top.
    // Let's replace ALL of them with empty, then inject it at the top properly?
    // Actually, since I am doing this in a script, let's just do a clean string replacement.
}

fs.writeFileSync('index.html', content, 'utf8');
console.log("Done phase 1.");
