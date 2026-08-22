const fs = require('fs');
let code = fs.readFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'utf8');

const search = /\/\/ Luôn luu d? li?u dã làm ODO \([\s\S]*?saveToArchive\('odo_data', newOdoToArchive\);/;
const replace = \// Luôn luu d? li?u dã làm ODO
            if (!dedupeSet.has(entry.id)) {
                dedupeSet.add(entry.id);
                employeeData.push(entry);
            }
        }\;

code = code.replace(search, replace);
fs.writeFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', code, 'utf8');
