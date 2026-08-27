const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

// 1. Update the checkbox HTML
code = code.replace(
    'onchange="toggleVirtualTrip(\\\'\' + r.tripCode + \'\\\', this.checked)"',
    'onchange="toggleVirtualTrip(\\\'\' + r.tripCode + \'\\\', this.checked, this)"'
);

// 2. Update toggleVirtualTrip logic
const oldToggle = `window.toggleVirtualTrip = function(tripCode, isChecked) {
    if (!tripCode) return;
    try {
        var virtuals = JSON.parse(localStorage.getItem('GHN_VIRTUAL_TRIPS') || '{}');
        if (isChecked) virtuals[tripCode] = true;
        else delete virtuals[tripCode];
        localStorage.setItem('GHN_VIRTUAL_TRIPS', JSON.stringify(virtuals));
        if (typeof saveActionLog === 'function') {
            const vKey = 'VIRTUAL_' + tripCode;
            saveActionLog(vKey, isChecked ? 'Đánh dấu chuyến ảo' : 'Bỏ đánh dấu chuyến ảo', 'Lastmile');
            try {
                const localLogs = JSON.parse(localStorage.getItem('GHN_ACTION_LOGS') || '{}');
                if (typeof syncToCloud === 'function') {
                    syncToCloud(vKey, isChecked ? 'VIRTUAL' : 'NOT_VIRTUAL', undefined, localLogs[vKey]);
                }
            } catch(e) {}
        }
        showToast('success', (isChecked ? 'Đã đánh dấu chuyến ảo: ' : 'Đã bỏ chuyến ảo: ') + tripCode);
        if (typeof renderLastmile === 'function') renderLastmile(true);
    } catch(e) {
        console.error('Error saving virtual trip:', e);
    }
};`;

const newToggle = `window.toggleVirtualTrip = function(tripCode, isChecked, checkboxEl) {
    if (!tripCode) return;
    try {
        var virtuals = JSON.parse(localStorage.getItem('GHN_VIRTUAL_TRIPS') || '{}');
        if (isChecked) virtuals[tripCode] = true;
        else delete virtuals[tripCode];
        localStorage.setItem('GHN_VIRTUAL_TRIPS', JSON.stringify(virtuals));
        
        let newLogs = null;
        if (typeof saveActionLog === 'function') {
            const vKey = 'VIRTUAL_' + tripCode;
            saveActionLog(vKey, isChecked ? 'Đánh dấu chuyến ảo' : 'Bỏ đánh dấu chuyến ảo', 'Lastmile');
            try {
                const localLogs = JSON.parse(localStorage.getItem('GHN_ACTION_LOGS') || '{}');
                newLogs = localLogs[vKey];
                if (typeof syncToCloud === 'function') {
                    syncToCloud(vKey, isChecked ? 'VIRTUAL' : 'NOT_VIRTUAL', undefined, newLogs);
                }
            } catch(e) {}
        }
        showToast('success', (isChecked ? 'Đã đánh dấu chuyến ảo: ' : 'Đã bỏ chuyến ảo: ') + tripCode);
        
        if (checkboxEl) {
            const tr = checkboxEl.closest('tr');
            if (tr && tr.children.length >= 17) {
                // Update Status Cell (15)
                const statusCell = tr.children[15];
                if (isChecked) {
                    statusCell.innerHTML = '<span style="color:#a78bfa; font-weight:700;">👻 Chuyến ảo</span>';
                } else {
                    statusCell.innerHTML = '<span style="color:var(--warning);">⚠️ Chưa ĐS</span>';
                }
                
                // Update Log Cell (16)
                if (newLogs && newLogs.length > 0) {
                    const logCell = tr.children[16];
                    logCell.innerHTML = '🕒';
                    const esc = (unsafe) => (unsafe||'').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
                    logCell.title = esc(newLogs.map(l => l.time + ' (' + (l.user||'Ẩn danh') + '): ' + l.action + ' - ' + l.details).join('\\n'));
                }
            }
        } else {
            if (typeof renderLastmile === 'function') renderLastmile(true);
        }
    } catch(e) {
        console.error('Error saving virtual trip:', e);
    }
};`;

code = code.replace(oldToggle, newToggle);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Fast DOM patch applied');
