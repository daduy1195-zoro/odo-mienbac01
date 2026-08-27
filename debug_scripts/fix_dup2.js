const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

code = code.replace(
    /localStorage\.setItem\('GHN_NCC_TRIP_OVERRIDES', JSON\.stringify\(mergedOverrides\)\);[\s\r\n]*localStorage\.setItem\('GHN_NCC_TRIP_NOTES', JSON\.stringify\(mergedNotes\)\);[\s\r\n]*localStorage\.setItem\('GHN_NCC_TRIP_OVERRIDES', JSON\.stringify\(mergedOverrides\)\);[\s\r\n]*localStorage\.setItem\('GHN_NCC_TRIP_NOTES', JSON\.stringify\(mergedNotes\)\);/,
    "localStorage.setItem('GHN_NCC_TRIP_OVERRIDES', JSON.stringify(mergedOverrides));\n            localStorage.setItem('GHN_NCC_TRIP_NOTES', JSON.stringify(mergedNotes));"
);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Fixed duplication!');
