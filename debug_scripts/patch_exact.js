const fs = require('fs');
let code = fs.readFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'utf8');

// 1. Remove the wrong insertion at line 1799
code = code.replace(/const newOdoToArchive = \[\];\r?\n\s*const dedupeSet = new Set\(\);\r?\n\s*employeeData = \[\]; \/\/.*?\r?\n\s*\/\*=*\\r?\\n\s*X? LÝ DANH SÁCH NV CHU?N/i, '// ---------------------------------------\n        // X? LÝ DANH SÁCH NV CHU?N');

// 2. Fix the correct insertion
code = code.replace(/const archivedOdo1 = await fetchArchivedData\('odo_data'\);\s*const archivedOdo2 = await fetchArchivedData\('odo_data_2'\);\s*const archivedOdo = \[\.\.\.archivedOdo1, \.\.\.archivedOdo2\];\s*const archivedOdoMap = new Map\(archivedOdo\.map\(o => \[o\.id, o\]\)\);\s*const newOdoToArchive = \[\];\s*employeeData = \[\];/g, 'const dedupeSet = new Set();\n        employeeData = [];');

// 3. Fix the employeeData.push(entry)
const searchPush = '// Luôn luu d? li?u dã làm ODO (k? c? chua t? d?ng ghép du?c mã NV)\n            employeeData.push(entry);\n            if (!archivedOdoMap.has(entry.id)) {\n                const archiveEntry = { ...entry };\n                delete archiveEntry.dateObj;\n                newOdoToArchive.push(archiveEntry);\n            }';
const replacePush = '// Luôn luu d? li?u dã làm ODO\n            if (!dedupeSet.has(entry.id)) {\n                dedupeSet.add(entry.id);\n                employeeData.push(entry);\n            }';
code = code.replace(searchPush, replacePush);

// 4. Remove the old append logic
const searchOldAppend = /\/\/ ?? B? sung d? li?u cu t? archive \([\s\S]*?if \(newOdoToArchive\.length > 0\) saveToArchive\('odo_data', newOdoToArchive\);/g;
code = code.replace(searchOldAppend, '');

fs.writeFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', code, 'utf8');
console.log("Success");
