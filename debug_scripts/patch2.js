const fs = require('fs');
let code = fs.readFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'utf8');

const s2 = `        var isMatched = r.tripCode && matchedTripCodes.has(r.tripCode);
          var isManual = r.tripCode && typeof manualTripCodes !== 'undefined' && manualTripCodes.has(r.tripCode);
          
          let statusHtml = '<span style="color:var(--warning);">⚠️ Chưa ĐS</span>';
          if (isMatched) {
              if (isManual) {
                  statusHtml = '<span class="badge" style="background:rgba(251,191,36,0.15);color:#f59e0b;font-size:10px;padding:2px 4px;border:1px solid rgba(251,191,36,0.3);" title="Được khớp bằng tay">🤲 Khớp tay</span>';
              } else {
                  statusHtml = '<span style="color:var(--success);">✅ Đã ĐS</span>';
              }
          }`;

const r2 = `        var isMatched = r.tripCode && matchedTripCodes.has(r.tripCode);
          var isManual = r.tripCode && typeof manualTripCodes !== 'undefined' && manualTripCodes.has(r.tripCode);
          
          let statusHtml = '<span style="color:var(--warning);">⚠️ Chưa ĐS</span>';
          if (isMatched) {
              const nccIdx = typeof tripToNccIndex !== 'undefined' ? tripToNccIndex.get(r.tripCode) : null;
              let unmatchBtn = '';
              if (nccIdx !== null && nccIdx !== undefined) {
                  unmatchBtn = \` <span style="color:var(--danger); cursor:pointer; padding:0 4px; font-weight:bold; user-select:none;" onclick="unmatchFromLastmile(\${nccIdx}, '\${r.tripCode}')" title="Gỡ đối soát">✕</span>\`;
              }
              if (isManual) {
                  statusHtml = \`<div style="display:flex;align-items:center;justify-content:center;gap:4px;"><span class="badge" style="background:rgba(251,191,36,0.15);color:#f59e0b;font-size:10px;padding:2px 4px;border:1px solid rgba(251,191,36,0.3);" title="Được khớp bằng tay">🤲 Khớp tay</span>\${unmatchBtn}</div>\`;
              } else {
                  statusHtml = \`<div style="display:flex;align-items:center;justify-content:center;gap:4px;"><span style="color:var(--success);">✅ Đã ĐS</span>\${unmatchBtn}</div>\`;
              }
          }`;

code = code.replace(s2, r2);

const funcInjection = `
  window.unmatchFromLastmile = function(nccIndex, tripCode) {
      if (nccIndex === undefined || nccIndex === null) return;
      if (typeof nccTripData === 'undefined' || !nccTripData[nccIndex]) return;
      if (!confirm('Bạn có chắc muốn gỡ đối soát cho chuyến: ' + tripCode + ' ?')) return;
      
      let currentCodes = String(nccTripData[nccIndex].ghnTripCode || '').split('|').map(x => x.trim()).filter(x => x);
      currentCodes = currentCodes.filter(c => c !== tripCode);
      let newValue = currentCodes.join(' | ');
      
      updateNccTripCode(nccIndex, newValue);
      renderLastmile();
      showToast('success', 'Đã gỡ đối soát chuyến ' + tripCode);
  };
`;

if (!code.includes('window.unmatchFromLastmile')) {
    code = code.replace('function renderLastmile() {', funcInjection + '\n  function renderLastmile() {');
}

fs.writeFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', code);
