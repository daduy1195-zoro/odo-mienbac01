import re

with open('C:\\Users\\MSI\\Desktop\\AI\\App_tai_xe\\odo_script\\SyncOdoToArchive.gs', 'r', encoding='utf-8') as f:
    code = f.read()

search_regex = r"var allRows = \[\];.*?writeToArchive\(SYNC_CONFIG\.ARCHIVE_TAB_ODO, headerRow, allRows\);"
replace_code = """  for (var si = 0; si < formSheets.length; si++) {
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
  }"""

new_code = re.sub(search_regex, replace_code, code, flags=re.DOTALL)

with open('C:\\Users\\MSI\\Desktop\\AI\\App_tai_xe\\odo_script\\SyncOdoToArchive.gs', 'w', encoding='utf-8') as f:
    f.write(new_code)

print("Done")
