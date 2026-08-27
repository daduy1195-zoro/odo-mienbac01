const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const regex = /const noTones = norm\(clean\); \/\/ norm\(\) converts to lower case/;
const replaceStr = "const noTones = typeof removeAccents === 'function' ? removeAccents(clean).toLowerCase() : norm(clean); // Fixed to actually remove tones";

if (regex.test(code)) {
    code = code.replace(regex, replaceStr);
    console.log("Patched normalizeSupplierName.");
} else {
    console.log("Could not find the target string.");
}

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
