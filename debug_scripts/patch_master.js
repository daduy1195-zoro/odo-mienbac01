const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

code = code.replace(
    /SHEET_MASTER_ID: '1RMe38TNV-EoIAradnynYmk8mt7l9pNWqJELM9O84Wxc'/,
    "SHEET_MASTER_ID: '1WK5bcOrB6sBBxu-ti8KIGFIwWUrhuGRkPf4q36Vx4yc'"
);
code = code.replace(
    /SHEET_MASTER_GID: '1254809645'/,
    "SHEET_MASTER_GID: '2040812814'"
);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Master sheet updated.');
