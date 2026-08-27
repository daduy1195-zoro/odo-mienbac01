const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

// Replace function declaration
code = code.replace(
    'window.toggleVirtualTrip = function(tripCode, isChecked) {',
    'window.toggleVirtualTrip = function(tripCode, isChecked, checkboxEl) {'
);

// Add DOM update instead of renderLastmile
const renderCode = "if (typeof renderLastmile === 'function') renderLastmile(true);";
const replacement = `
        if (checkboxEl) {
            const tr = checkboxEl.closest('tr');
            if (tr && tr.children.length >= 17) {
                const statusCell = tr.children[15];
                if (isChecked) {
                    statusCell.innerHTML = '<span style="color:#a78bfa; font-weight:700;">👻 Chuyến ảo</span>';
                } else {
                    statusCell.innerHTML = '<span style="color:var(--warning);">⚠️ Chưa ĐS</span>';
                }
                
                let localLogs = {};
                try { localLogs = JSON.parse(localStorage.getItem('GHN_ACTION_LOGS') || '{}'); } catch(e){}
                let newLogs = localLogs['VIRTUAL_' + tripCode];
                if (newLogs && newLogs.length > 0) {
                    const logCell = tr.children[16];
                    logCell.innerHTML = '🕒';
                    const esc = (unsafe) => (unsafe||'').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
                    logCell.title = esc(newLogs.map(l => l.time + ' (' + (l.user||'Ẩn danh') + '): ' + l.action + ' - ' + l.details).join('\\n'));
                    logCell.style.opacity = '1';
                }
            }
        } else {
            if (typeof renderLastmile === 'function') renderLastmile(true);
        }
`;

// Find toggleVirtualTrip and replace its renderLastmile
let idx = code.indexOf('window.toggleVirtualTrip = function');
let endIdx = code.indexOf('};', idx);
let funcBody = code.substring(idx, endIdx);
funcBody = funcBody.replace("if (typeof renderLastmile === 'function') renderLastmile(true);", replacement);

code = code.substring(0, idx) + funcBody + code.substring(endIdx);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Fast DOM patch applied using regex');
