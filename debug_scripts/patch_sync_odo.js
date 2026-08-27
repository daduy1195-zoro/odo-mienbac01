const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/App_tai_xe/odo_script/SyncOdoToArchive.gs', 'utf8');

const s1 = `            // Thêm metadata columns
            headerRow.push('_ncc', '_tab_name', '_tab_gid');
          }
          
          var maxCols = headerRow.length - 3; // trừ 3 cột metadata`;

const r1 = `            // BỔ SUNG: Padding headerRow ra 35 cột để không bị mất dữ liệu của các NCC có nhiều cột (như Hoa Vinh)
            while(headerRow.length < 35) headerRow.push('');
            // Thêm metadata columns
            headerRow.push('_ncc', '_tab_name', '_tab_gid', '_source_row');
          }
          
          var maxCols = 35; // Fix cứng 35 cột để không NCC nào bị cắt mất dữ liệu (như Hoa Vinh có tận 27 cột)`;

const s2 = `            // Thêm metadata
            row.push(nccName, tabName, String(tab.getSheetId()));`;
            
const r2 = `            // Thêm metadata
            row.push(nccName, tabName, String(tab.getSheetId()), String(ri));`;

code = code.replace(s1, r1).replace(s2, r2);

// Make sure to replace all occurrences of row.push if needed, wait, s2 might be in a loop
code = code.replace(/row\.push\(nccName, tabName, String\(tab\.getSheetId\(\)\)\);/g, `row.push(nccName, tabName, String(tab.getSheetId()), String(ri));`);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/App_tai_xe/odo_script/SyncOdoToArchive.gs', code);
console.log('Patched');
