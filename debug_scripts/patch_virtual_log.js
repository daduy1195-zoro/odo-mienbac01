const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

// 1. toggleVirtualTrip
const oldToggle = `          localStorage.setItem('GHN_VIRTUAL_TRIPS', JSON.stringify(virtuals));
          showToast('success', (isChecked ? 'Đã đánh dấu chuyến ảo: ' : 'Đã bỏ chuyến ảo: ') + tripCode);
          if (typeof renderLastmile === 'function') renderLastmile(true);`;
const newToggle = `          localStorage.setItem('GHN_VIRTUAL_TRIPS', JSON.stringify(virtuals));
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
          if (typeof renderLastmile === 'function') renderLastmile(true);`;

code = code.replace(oldToggle, newToggle);

// 2. renderLastmile
const oldRender = `        let logHtml = '<span style="opacity:0.2">🕒</span>';
        let logTitle = 'Chưa có thao tác nào';
        if (isMatched && typeof tripToNccIndex !== 'undefined') {
            const nccIdx = tripToNccIndex.get(r.tripCode);
            if (nccIdx !== null && nccIdx !== undefined && typeof nccTripData !== 'undefined' && nccTripData[nccIdx].actionLogs && nccTripData[nccIdx].actionLogs.length > 0) {
                logHtml = '🕒';
                logTitle = escapeHtml(nccTripData[nccIdx].actionLogs.map(l => l.time + ' (' + (l.user||'Ẩn danh') + '): ' + l.action + ' - ' + l.details).join('\\n'));
            }
        }
        html += '<td style="text-align:center; cursor:pointer;" title="' + logTitle + '">' + logHtml + '</td>';`;
        
const newRender = `        let logHtml = '<span style="opacity:0.2">🕒</span>';
        let logTitle = 'Chưa có thao tác nào';
        let logs = [];
        if (isMatched && typeof tripToNccIndex !== 'undefined') {
            const nccIdx = tripToNccIndex.get(r.tripCode);
            if (nccIdx !== null && nccIdx !== undefined && typeof nccTripData !== 'undefined' && nccTripData[nccIdx].actionLogs && nccTripData[nccIdx].actionLogs.length > 0) {
                logs = logs.concat(nccTripData[nccIdx].actionLogs);
            }
        }
        try {
            const localLogs = JSON.parse(localStorage.getItem('GHN_ACTION_LOGS') || '{}');
            const vKey = 'VIRTUAL_' + r.tripCode;
            if (localLogs[vKey] && localLogs[vKey].length > 0) {
                logs = logs.concat(localLogs[vKey]);
            }
        } catch(e) {}
        if (logs.length > 0) {
            logHtml = '🕒';
            logTitle = escapeHtml(logs.map(l => l.time + ' (' + (l.user||'Ẩn danh') + '): ' + l.action + ' - ' + l.details).join('\\n'));
        }
        html += '<td style="text-align:center; cursor:pointer;" title="' + logTitle + '">' + logHtml + '</td>';`;

code = code.replace(oldRender, newRender);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Virtual logs patch applied');
