
function cleanupArchiveSheet() {
  var ss = SpreadsheetApp.openById(SYNC_CONFIG.ARCHIVE_SHEET_ID);
  var sheets = ss.getSheets();
  var totalCells = 0;
  for (var i = 0; i < sheets.length; i++) {
    var sheet = sheets[i];
    var maxR = sheet.getMaxRows();
    var maxC = sheet.getMaxColumns();
    var name = sheet.getName();
    
    Logger.log(name + " truoc: " + maxR + "x" + maxC + " = " + (maxR * maxC));
    
    // Xoa cot thua (giu 50 cot)
    if (maxC > 50) {
      try {
        sheet.deleteColumns(51, maxC - 50);
        maxC = 50;
        Logger.log("  -> Da xoa " + (maxC - 50) + " cot");
      } catch(e) {}
    }
    
    totalCells += (maxR * maxC);
    Logger.log(name + " sau: " + maxR + "x" + maxC + " = " + (maxR * maxC));
  }
  Logger.log("TOTAL CELLS = " + totalCells);
}

