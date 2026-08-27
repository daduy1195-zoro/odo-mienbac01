const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const target = `
          if (isOffByPlate) {
              let inferred = '';
  
              // Quét lên trước (ưu tiên biển số liền trước đó)
              for (let j = i - 1; j >= Math.max(0, i - 31); j--) {
                  if (!rawData[j] || !rawData[j][1] || !rawData[j][1].toString().match(/\\d{2}\\/\\d{2}\\/\\d{4}/)) continue;
                  let p = (rawData[j][2] || '').toString().trim().toUpperCase();
                  if (p && !p.includes('OFF') && !p.includes('NGHỈ') && !p.includes('NGHI') && p.length >= 6) {
                      inferred = p;
                      inferredWH = (rawData[j][26] || rawData[j][24] || '').toString().trim(); // Kho tạm thời
                      break;
                  }
              }
  
              // Nếu không có, quét xuống
              if (!inferred) {
                  for (let j = i + 1; j <= Math.min(rawData.length - 1, i + 31); j++) {
                      if (!rawData[j] || !rawData[j][1] || !rawData[j][1].toString().match(/\\d{2}\\/\\d{2}\\/\\d{4}/)) continue;
                      let p = (rawData[j][2] || '').toString().trim().toUpperCase();
                      if (p && !p.includes('OFF') && !p.includes('NGHỈ') && !p.includes('NGHI') && p.length >= 6) {
                          inferred = p;
                          inferredWH = (rawData[j][26] || rawData[j][24] || '').toString().trim();
                          break;
                      }
                  }
              }
`;

const replacement = `
          if (isOffByPlate) {
              let inferred = '';
  
              // Quét lên trước (ưu tiên biển số liền trước đó)
              for (let j = i - 1; j >= Math.max(0, i - 31); j--) {
                  if (!rawData[j] || !rawData[j][colDate > -1 ? colDate : 1] || !rawData[j][colDate > -1 ? colDate : 1].toString().match(/\\d/)) continue;
                  let p = (rawData[j][colPlate > -1 ? colPlate : 2] || '').toString().trim().toUpperCase();
                  if (p && !p.includes('OFF') && !p.includes('NGHỈ') && !p.includes('NGHI') && p.length >= 6) {
                      inferred = p;
                      inferredWH = (rawData[j][colKho > -1 ? colKho : 26] || '').toString().trim();
                      break;
                  }
              }
  
              // Nếu không có, quét xuống
              if (!inferred) {
                  for (let j = i + 1; j <= Math.min(rawData.length - 1, i + 31); j++) {
                      if (!rawData[j] || !rawData[j][colDate > -1 ? colDate : 1] || !rawData[j][colDate > -1 ? colDate : 1].toString().match(/\\d/)) continue;
                      let p = (rawData[j][colPlate > -1 ? colPlate : 2] || '').toString().trim().toUpperCase();
                      if (p && !p.includes('OFF') && !p.includes('NGHỈ') && !p.includes('NGHI') && p.length >= 6) {
                          inferred = p;
                          inferredWH = (rawData[j][colKho > -1 ? colKho : 26] || '').toString().trim();
                          break;
                      }
                  }
              }
`;

code = code.replace(target.trim(), replacement.trim());

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('OFF trips inference patched.');
