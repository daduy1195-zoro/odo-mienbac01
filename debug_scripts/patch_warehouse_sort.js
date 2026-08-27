const fs = require('fs');
let code = fs.readFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'utf8');

const search = `      for(const kho of Object.keys(pivotData).sort()) {`;

const replace = `      // Tính subCost cho từng kho để sort
      const khoSubCost = {};
      for (const k of Object.keys(pivotData)) {
          khoSubCost[k] = 0;
          for (const b of Object.keys(pivotData[k])) {
              khoSubCost[k] += pivotData[k][b].chiPhi;
          }
      }
      const sortedKho = Object.keys(pivotData).sort((a, b) => khoSubCost[b] - khoSubCost[a]);

      for(const kho of sortedKho) {`;

code = code.replace(search, replace);
fs.writeFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', code);
console.log("Patched warehouse sorting");
