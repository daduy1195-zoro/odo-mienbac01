const fs = require('fs');
let code = fs.readFileSync('C:\\Users\\MSI\\Desktop\\AI\\App_tai_xe\\odo_script\\SyncOdoToArchive.gs', 'utf8');

const searchRegex = /var allRows = \[\];[\s\S]*?writeToArchive\(SYNC_CONFIG\.ARCHIVE_TAB_ODO, headerRow, allRows\);/;
const replaceCode = 
  for (var si = 0; si < formSheets.length; si++) {
    var sheet = formSheets[si];
    var data = sheet.getDataRange().getValues();
    var gid = String(sheet.getSheetId());
    
    if (data.length === 0) continue;
    
    var headerRow = [];
    for (var hi = 0; hi < data[0].length; hi++) {
      headerRow.push(String(data[0][hi]).trim());
    }
    headerRow.push('_gid', '_sheetRow');
    
    var allRows = [];
    // Data rows (b? header)
    for (var ri = 1; ri < data.length; ri++) {
      var row = data[ri];
      // B? dòng tr?ng (c?t C = Tên NV)
      if (!row[2] || String(row[2]).trim() === '') continue;
      
      var rowWithMeta = row.slice();
      while (rowWithMeta.length < headerRow.length - 2) rowWithMeta.push('');
      rowWithMeta.push(gid, ri + 1);
      allRows.push(rowWithMeta);
    }
    
    var tabName = (si === 0) ? SYNC_CONFIG.ARCHIVE_TAB_ODO : SYNC_CONFIG.ARCHIVE_TAB_ODO + '_' + (si + 1);
    Logger.log('Employee ODO (' + tabName + '): ' + allRows.length + ' dong');
    writeToArchive(tabName, headerRow, allRows);
  }
;

if (code.match(searchRegex)) {
    code = code.replace(searchRegex, replaceCode);
    fs.writeFileSync('C:\\Users\\MSI\\Desktop\\AI\\App_tai_xe\\odo_script\\SyncOdoToArchive.gs', code);
    console.log('Success');
} else {
    console.log('Not found');
}
