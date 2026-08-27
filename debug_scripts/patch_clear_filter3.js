const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

code = code.replace(
    "if (clearPlate) clearPlate.style.display = 'none';",
    "if (clearPlate) clearPlate.style.display = 'none';\n\n        const filterNccStatus = document.getElementById('filterNccStatus');\n        if (filterNccStatus) filterNccStatus.value = '';"
);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Status filter added to clearFilters.');
