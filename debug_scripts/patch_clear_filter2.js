const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const scriptHtml = `    window.clearFilters = function() {
        document.getElementById('filterDateFrom').value = '';
        document.getElementById('filterDateTo').value = '';
        document.getElementById('filterWarehouse').value = '';
        document.getElementById('filterNcc').value = '';
        
        document.getElementById('filterEmployee').value = '';
        const clearEmp = document.getElementById('clearEmp');
        if (clearEmp) clearEmp.style.display = 'none';
        
        document.getElementById('filterPlate').value = '';
        const clearPlate = document.getElementById('clearPlate');
        if (clearPlate) clearPlate.style.display = 'none';

        const monthSelect = document.getElementById('filterMonth');
        if (monthSelect.options.length > 0) {
            monthSelect.selectedIndex = 0;
        }

        if (typeof applyFilters === 'function') {
            applyFilters();
        }
    };

    function switchTab(tab, el) {`;

code = code.replace(
    /function switchTab\(tab, el\) \{/g,
    scriptHtml
);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Clear filters JS patched.');
