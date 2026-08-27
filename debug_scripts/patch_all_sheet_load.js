const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const searchStr = `              // Phân tách NCC có nhiều tabs và có 1 tab (dùng GID)
              const vehicleTabs = await fetchSheetJSONP(sheet.id, '', 1).catch(e => null);
              
              if (vehicleTabs && vehicleTabs.length > 0) {
                  // Phân tích header để tìm tên các tab xe
                  const headerRow = vehicleTabs[0];`;

const replaceStr = `              // Phân tách NCC có nhiều tabs và có 1 tab (dùng GID)
              const vehicleTabs = sheet.ncc === 'ALL' ? null : await fetchSheetJSONP(sheet.id, '', 1).catch(e => null);
              
              if (vehicleTabs && vehicleTabs.length > 0) {
                  // Phân tích header để tìm tên các tab xe
                  const headerRow = vehicleTabs[0];`;

let normalizedCode = code.replace(/\r\n/g, '\n');
let normalizedSearch = searchStr.replace(/\r\n/g, '\n');

if (normalizedCode.includes(normalizedSearch)) {
    normalizedCode = normalizedCode.replace(normalizedSearch, replaceStr);
    console.log("Successfully patched loadNccData to skip tab extraction for ALL sheet.");
} else {
    console.log("Could not find the target string.");
}

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', normalizedCode);
