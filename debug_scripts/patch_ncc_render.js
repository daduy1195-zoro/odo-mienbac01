const fs = require('fs');
let code = fs.readFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'utf8');

const search = `      for(const kho of Object.keys(pivotData).sort()) {
          const xeList = pivotData[kho];
          let subCost = 0, subKm = 0, subPhiVuot = 0, subTgOt = 0, subPhiOt = 0, subPhiCau = 0;
          
          let carRows = '';
          for(const bienSo of Object.keys(xeList).sort()) {
              const data = xeList[bienSo];
              subCost += data.chiPhi;
              subKm += data.kmPhatSinh;
              subPhiVuot += data.phiVuotKm;
              subTgOt += data.thoiGianTangCa;
              subPhiOt += data.phiTangCa;
              subPhiCau += data.phiCauDuong;
              
              carRows += \`
                  <tr>
                      <td style="padding-left: 32px; font-family:Calibri, sans-serif;">\${escapeHtml(bienSo)}</td>
                      <td style="text-align:right;color:#fbbf24;font-weight:600;">\${Math.round(data.chiPhi).toLocaleString('vi-VN')}</td>`;

const replace = `      // Tìm min, max chi phí để làm color scale
      let minCost = Infinity, maxCost = -Infinity;
      for (const k of Object.keys(pivotData)) {
          for (const b of Object.keys(pivotData[k])) {
              const c = pivotData[k][b].chiPhi;
              if (c < minCost) minCost = c;
              if (c > maxCost) maxCost = c;
          }
      }
      if (minCost === Infinity) minCost = 0;
      if (maxCost === -Infinity) maxCost = 0;

      function getColorScale(value, min, max) {
          if (max <= min) return '#fbbf24';
          let ratio = (value - min) / (max - min);
          // Yellow (#fbbf24: 251, 191, 36) to Red (#ef4444: 239, 68, 68)
          const r1 = 251, g1 = 191, b1 = 36;
          const r2 = 239, g2 = 68, b2 = 68;
          const r = Math.round(r1 + (r2 - r1) * ratio);
          const g = Math.round(g1 + (g2 - g1) * ratio);
          const b = Math.round(b1 + (b2 - b1) * ratio);
          return \`rgb(\${r}, \${g}, \${b})\`;
      }

      for(const kho of Object.keys(pivotData).sort()) {
          const xeList = pivotData[kho];
          let subCost = 0, subKm = 0, subPhiVuot = 0, subTgOt = 0, subPhiOt = 0, subPhiCau = 0;
          
          let carRows = '';
          const sortedPlates = Object.keys(xeList).sort((a, b) => xeList[b].chiPhi - xeList[a].chiPhi);
          
          for(const bienSo of sortedPlates) {
              const data = xeList[bienSo];
              subCost += data.chiPhi;
              subKm += data.kmPhatSinh;
              subPhiVuot += data.phiVuotKm;
              subTgOt += data.thoiGianTangCa;
              subPhiOt += data.phiTangCa;
              subPhiCau += data.phiCauDuong;
              
              const colorStr = getColorScale(data.chiPhi, minCost, maxCost);
              
              carRows += \`
                  <tr>
                      <td style="padding-left: 32px; font-family:Calibri, sans-serif;">\${escapeHtml(bienSo)}</td>
                      <td style="text-align:right;color:\${colorStr};font-weight:600;">\${Math.round(data.chiPhi).toLocaleString('vi-VN')}</td>`;

if (code.includes('for(const bienSo of Object.keys(xeList).sort()) {')) {
    code = code.replace(search, replace);
    fs.writeFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', code);
    console.log("Patched successfully");
} else {
    console.log("Search string not found!");
}
