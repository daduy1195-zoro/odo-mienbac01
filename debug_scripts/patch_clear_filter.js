const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const buttonHtml = `            <button class="btn btn-success" onclick="loadAllData()" style="padding: 8px 12px; font-size: 12px;">🔄 Làm mới</button>
            <button class="btn" onclick="clearFilters()" style="padding: 8px 12px; font-size: 12px; background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3);">❌ Xóa bộ lọc</button>`;

code = code.replace(
    /<button class="btn btn-success" onclick="loadAllData\(\)" style="padding: 8px 12px; font-size: 12px;">🔄 Làm mới<\/button>/g,
    buttonHtml
);

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

    function switchTab(tab, element) {`;

code = code.replace(
    /function switchTab\(tab, element\) \{/g,
    scriptHtml
);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Clear filters patched.');
