const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const searchBlock = `          for (const sheet of CONFIG.NCC_TRIP_SHEETS) {
              try {
                  // ✨ Bước 1: Lấy danh sách tên tab + GID
                  { const _s = container.querySelector('span'); if (_s) _s.textContent = \`Đang quét tabs NCC: \${sheet.ncc}...\`; }
                  const tabInfos = await getSheetTabNames(sheet.id);`;

const replaceBlock = `          for (const sheet of CONFIG.NCC_TRIP_SHEETS) {
              try {
                  if (sheet.ncc === 'ALL') {
                      console.log(\`⏩ Bỏ qua lấy tab name cho ALL sheet, tải trực tiếp bằng GID\`);
                      const rawData = await fetchSheetJSONP(sheet.id, sheet.gid);
                      const parsed = parseNccTabData(rawData, sheet.ncc, ghnTripMap, sheet.id, '', sheet.gid);
                      parsed.forEach(record => {
                          const normPlate = record.plate ? String(record.plate).trim().toLowerCase().replace(/[-\\s\\.]/g, '') : '';
                          const existingIdx = allNccData.findIndex(r => {
                              if (r.dateStr !== record.dateStr) return false;
                              if (r.ncc !== record.ncc) return false;
                              const rTab = r.tabName ? String(r.tabName).trim().toLowerCase().replace(/[-\\s\\.]/g, '') : '';
                              const normTab = record.tabName ? String(record.tabName).trim().toLowerCase().replace(/[-\\s\\.]/g, '') : '';
                              if (normTab && rTab && (normTab === rTab || normTab.includes(rTab) || rTab.includes(normTab))) return true;
                              if (record.plate && r.plate) {
                                  const rp = String(r.plate).trim().toLowerCase().replace(/[-\\s\\.]/g, '');
                                  if (rp === normPlate) return true;
                              }
                              return false;
                          });
                          if (existingIdx !== -1) {
                              allNccData[existingIdx] = record;
                          } else {
                              allNccData.push(record);
                          }
                      });
                      totalTabs++;
                      totalRows += parsed.length;
                      continue;
                  }

                  // ✨ Bước 1: Lấy danh sách tên tab + GID
                  { const _s = container.querySelector('span'); if (_s) _s.textContent = \`Đang quét tabs NCC: \${sheet.ncc}...\`; }
                  const tabInfos = await getSheetTabNames(sheet.id);`;

let normalizedCode = code.replace(/\r\n/g, '\n');
let normalizedSearch = searchBlock.replace(/\r\n/g, '\n');

if (normalizedCode.includes(normalizedSearch)) {
    normalizedCode = normalizedCode.replace(normalizedSearch, replaceBlock);
    console.log("Patched loadNccData to skip tab extraction for ALL sheet and deduplicate properly.");
} else {
    console.log("Could not find search block.");
}

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', normalizedCode);
