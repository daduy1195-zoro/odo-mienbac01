const fs = require('fs');
let code = fs.readFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'utf8');

const regex = /const newOdoToArchive = \[\];\r?\n\s*const dedupeSet = new Set\(\);\r?\n\s*employeeData = \[\];[^\n]*\r?\n/;
code = code.replace(regex, "");

fs.writeFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', code, 'utf8');
