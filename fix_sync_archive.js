const fs = require("fs");
let content = fs.readFileSync("C:/Users/MSI/.gemini/antigravity/brain/c7e65cba-7a2c-4fec-9c6c-dd170166bef5/SyncOdoToArchive.gs", "utf8");

const target = `          // L?y t?t c? dòng data (k? c? header rows — dashboard s? t? parse)
          var maxCols = 45; // Fixed to 45 columns to prevent truncation if the first tab is a summary tab
          if (!headerRow) {
            headerRow = [];
            for (var i = 1; i <= maxCols; i++) headerRow.push("Col" + i);
            headerRow.push("_ncc", "_tab_name", "_tab_gid");
          }

          for (var ri = 0; ri < data.length; ri++) {
            var row = data[ri].slice();
            // Pad ho?c truncate cho dúng s? c?t
            while (row.length < maxCols) row.push("");
            row = row.slice(0, maxCols);
            // Thêm metadata
            row.push(nccName, tabName, String(tab.getSheetId()));
            allRows.push(row);
          }`;

const replacement = `          // L?y t?t c? dòng data (k? c? header rows — dashboard s? t? parse)
          var maxCols = 45; // Fixed to 45 columns to prevent truncation if the first tab is a summary tab
          if (!headerRow) {
            headerRow = [];
            for (var i = 1; i <= maxCols; i++) headerRow.push("Col" + i);
            headerRow.push("_ncc", "_tab_name", "_spreadsheet_id", "_tab_gid");
          }

          for (var ri = 0; ri < data.length; ri++) {
            var row = data[ri].slice();
            // Pad ho?c truncate cho dúng s? c?t
            while (row.length < maxCols) row.push("");
            row = row.slice(0, maxCols);
            // Thêm metadata
            row.push(nccName, tabName, String(sheetConfig.id), String(tab.getSheetId()));
            allRows.push(row);
          }`;

const target2 = `  Logger.log("NCC Trips: " + allRows.length + " dong tu " + totalTabs + " tabs");
  
  if (allRows.length > 0) {
    writeToArchive(SYNC_CONFIG.ARCHIVE_TAB_NCC_TRIPS, headerRow, allRows);
  }`;

const replacement2 = `  // ===== LOGIC LUU TR? VINH VI?N (ARCHIVE) =====
  var archiveSheet = SpreadsheetApp.openById(SYNC_CONFIG.ARCHIVE_SHEET_ID).getSheetByName(SYNC_CONFIG.ARCHIVE_TAB_NCC_TRIPS);
  var oldData = [];
  try {
    if (archiveSheet.getLastRow() > 0) {
      oldData = archiveSheet.getDataRange().getValues();
    }
  } catch(e) {}
  
  var activeSpreadsheets = SYNC_CONFIG.NCC_TRIP_SHEETS.map(function(s) { return s.id; });
  var preservedRows = [];
  var oldHeader = oldData.length > 0 ? oldData[0] : null;
  var spreadsheetIdIdx = oldHeader ? oldHeader.indexOf("_spreadsheet_id") : -1;
  var nccIdx = oldHeader ? oldHeader.indexOf("_ncc") : -1;
  
  for (var i = 1; i < oldData.length; i++) {
    var row = oldData[i];
    var ssId = spreadsheetIdIdx !== -1 ? row[spreadsheetIdIdx] : null;
    
    // Ch? gi? l?i nh?ng dòng có ssId và ssId KHÔNG n?m trong danh sách active
    if (ssId && activeSpreadsheets.indexOf(ssId) === -1) {
      preservedRows.push(row);
    }
  }
  
  var finalRows = preservedRows.concat(allRows);
  Logger.log("NCC Trips: Gi? l?i " + preservedRows.length + " dòng l?ch s?. T?i m?i " + allRows.length + " dòng t? " + totalTabs + " tabs.");
  
  if (finalRows.length > 0) {
    writeToArchive(SYNC_CONFIG.ARCHIVE_TAB_NCC_TRIPS, headerRow, finalRows);
  }`;

content = content.replace(target, replacement);
content = content.replace(target2, replacement2);
fs.writeFileSync("C:/Users/MSI/.gemini/antigravity/brain/c7e65cba-7a2c-4fec-9c6c-dd170166bef5/SyncOdoToArchive.gs", content);
console.log("Updated SyncOdoToArchive.gs for archiving");
