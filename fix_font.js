const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Replace corrupted "Ghi ch..."
const regex = /placeholder="Ghi ch[^"]*"\s+onchange="updateNccTripNote/;
const replace = `placeholder="Ghi chú..." onchange="updateNccTripNote`;

if (content.match(regex)) {
    content = content.replace(regex, replace);
    fs.writeFileSync('index.html', content, 'utf8');
    console.log("Fixed placeholder.");
} else {
    console.log("Regex not found.");
}

// Also fix "Ghi ch" key in the export data array if corrupted
const regex2 = /"Ghi ch[^"]*": r.note/g;
if (content.match(regex2)) {
    content = content.replace(regex2, `"Ghi chú": r.note`);
    fs.writeFileSync('index.html', content, 'utf8');
    console.log("Fixed excel export key.");
}
