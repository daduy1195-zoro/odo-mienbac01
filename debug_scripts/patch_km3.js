const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

let lines = code.split('\n');
for(let i = 0; i < lines.length; i++) {
    if(lines[i].includes("parseFloat(String(r.kmDiff).replace(/[^\\d.]/g, ''))")) {
        lines[i] = lines[i].replace("parseFloat(String(r.kmDiff).replace(/[^\\d.]/g, ''))", "parseVietnameseNumber(r.kmDiff)");
    }
    if(lines[i].includes("parseFloat(String(r.kmStart).replace(/[^\\d.]/g, ''))")) {
        lines[i] = lines[i].replace("parseFloat(String(r.kmStart).replace(/[^\\d.]/g, ''))", "parseVietnameseNumber(r.kmStart)");
    }
    if(lines[i].includes("parseFloat(String(r.kmEnd).replace(/[^\\d.]/g, ''))")) {
        lines[i] = lines[i].replace("parseFloat(String(r.kmEnd).replace(/[^\\d.]/g, ''))", "parseVietnameseNumber(r.kmEnd)");
    }
}

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', lines.join('\n'));
console.log('km fixed 3');
