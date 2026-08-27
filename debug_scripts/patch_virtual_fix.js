const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const regex = /\} else if \(isVirtualTrip\) \{\s*statusHtml = '<span style="color:#a78bfa; font-weight:700;">👻 Chuyến ảo<\/span>';\s*\}/;

const newBlock = `} else if (isVirtual) {
            statusHtml = '<span style="color:#a78bfa; font-weight:700;">👻 Chuyến ảo</span>';
        }`;

if (regex.test(code)) {
    code = code.replace(regex, newBlock);
    console.log("Fixed isVirtual reference.");
} else {
    console.log("Could not find isVirtualTrip reference.");
}

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
