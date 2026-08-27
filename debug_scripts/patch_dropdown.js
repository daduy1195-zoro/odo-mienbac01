const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const regex = /html \+= '<th>';\r?\n    html \+= '<select onchange="document\.getElementById\(\\'filterNccStatus\\'\)\.value = this\.value; renderNccTrip\(\);" style="background: transparent; border: 1px solid rgba\(255,255,255,0\.2\); color: #fff; border-radius: 4px; padding: 2px 4px; font-size: 11px; cursor: pointer; outline: none;">';/;

const replacement = `    html += '<th style="width: 100px; text-align: center;">';
    html += '<select onchange="document.getElementById(\\'filterNccStatus\\').value = this.value; renderNccTrip();" style="background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #fff; border-radius: 4px; padding: 2px; font-size: 11px; cursor: pointer; outline: none; width: 95px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">';`;

code = code.replace(regex, replacement);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Dropdown patched');
