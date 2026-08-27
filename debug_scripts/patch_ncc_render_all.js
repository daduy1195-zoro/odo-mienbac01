const fs = require('fs');
let code = fs.readFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'utf8');

const search = `                      <td style="text-align:right">\${Math.round(data.kmPhatSinh).toLocaleString('vi-VN')}</td>
                      <td style="text-align:right">\${Math.round(data.phiVuotKm).toLocaleString('vi-VN')}</td>
                      <td style="text-align:right">\${Number(data.thoiGianTangCa.toFixed(2)).toLocaleString('vi-VN')}</td>
                      <td style="text-align:right">\${Math.round(data.phiTangCa).toLocaleString('vi-VN')}</td>
                      <td style="text-align:right">\${Math.round(data.phiCauDuong).toLocaleString('vi-VN')}</td>
                  </tr>`;

const replace = `                      <td style="text-align:right;color:\${data.kmPhatSinh > 0 ? getColorScale(data.kmPhatSinh, 0, maxKm) : 'var(--text)'};">\${Math.round(data.kmPhatSinh).toLocaleString('vi-VN')}</td>
                      <td style="text-align:right;color:\${data.phiVuotKm > 0 ? getColorScale(data.phiVuotKm, 0, maxPhiVuot) : 'var(--text)'};">\${Math.round(data.phiVuotKm).toLocaleString('vi-VN')}</td>
                      <td style="text-align:right;color:\${data.thoiGianTangCa > 0 ? getColorScale(data.thoiGianTangCa, 0, maxTgOt) : 'var(--text)'};">\${Number(data.thoiGianTangCa.toFixed(2)).toLocaleString('vi-VN')}</td>
                      <td style="text-align:right;color:\${data.phiTangCa > 0 ? getColorScale(data.phiTangCa, 0, maxPhiOt) : 'var(--text)'};">\${Math.round(data.phiTangCa).toLocaleString('vi-VN')}</td>
                      <td style="text-align:right;color:\${data.phiCauDuong > 0 ? getColorScale(data.phiCauDuong, 0, maxPhiCau) : 'var(--text)'};">\${Math.round(data.phiCauDuong).toLocaleString('vi-VN')}</td>
                  </tr>`;

// Also need to add the max variables
const search2 = `      let minCost = Infinity, maxCost = -Infinity;
      for (const k of Object.keys(pivotData)) {
          for (const b of Object.keys(pivotData[k])) {
              const c = pivotData[k][b].chiPhi;
              if (c < minCost) minCost = c;
              if (c > maxCost) maxCost = c;
          }
      }
      if (minCost === Infinity) minCost = 0;
      if (maxCost === -Infinity) maxCost = 0;`;

const replace2 = `      let minCost = Infinity, maxCost = -Infinity;
      let maxKm = 0, maxPhiVuot = 0, maxTgOt = 0, maxPhiOt = 0, maxPhiCau = 0;
      for (const k of Object.keys(pivotData)) {
          for (const b of Object.keys(pivotData[k])) {
              const d = pivotData[k][b];
              if (d.chiPhi < minCost) minCost = d.chiPhi;
              if (d.chiPhi > maxCost) maxCost = d.chiPhi;
              if (d.kmPhatSinh > maxKm) maxKm = d.kmPhatSinh;
              if (d.phiVuotKm > maxPhiVuot) maxPhiVuot = d.phiVuotKm;
              if (d.thoiGianTangCa > maxTgOt) maxTgOt = d.thoiGianTangCa;
              if (d.phiTangCa > maxPhiOt) maxPhiOt = d.phiTangCa;
              if (d.phiCauDuong > maxPhiCau) maxPhiCau = d.phiCauDuong;
          }
      }
      if (minCost === Infinity) minCost = 0;
      if (maxCost === -Infinity) maxCost = 0;`;

if (code.includes('Math.round(data.kmPhatSinh)')) {
    code = code.replace(search, replace);
    code = code.replace(search2, replace2);
    fs.writeFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', code);
    console.log("Patched all columns successfully");
} else {
    console.log("Search string not found!");
}
