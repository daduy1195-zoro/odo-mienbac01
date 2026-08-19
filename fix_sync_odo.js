const fs = require("fs");
let content = fs.readFileSync("C:/Users/MSI/.gemini/antigravity/brain/c7e65cba-7a2c-4fec-9c6c-dd170166bef5/SyncOdoToArchive.gs", "utf8");

const target = `  var allRows = [];
  var headerRow = null;
  
  for (var si = 0; si < formSheets.length; si++) {
    var sheet = formSheets[si];
    var data = sheet.getDataRange().getValues();
    var gid = String(sheet.getSheetId());
    
    if (data.length === 0) continue;
    
    // L?y header t? tab d?u tiên
    if (!headerRow) {
      headerRow = [];
      for (var hi = 0; hi < data[0].length; hi++) {
        headerRow.push(String(data[0][hi]).trim());
      }
      headerRow.push("_gid", "_sheetRow");
    }
    
    // Data rows (b? header)
    for (var ri = 1; ri < data.length; ri++) {
      var row = data[ri];
      // B? dòng tr?ng (c?t C = Tên NV)
      if (!row[2] || String(row[2]).trim() === "") continue;
      
      var rowWithMeta = row.slice();
      while (rowWithMeta.length < headerRow.length - 2) rowWithMeta.push("");
      rowWithMeta.push(gid, ri + 1);
      allRows.push(rowWithMeta);
    }
  }
  
  Logger.log("Employee ODO: " + allRows.length + " dong");
  writeToArchive(SYNC_CONFIG.ARCHIVE_TAB_ODO, headerRow, allRows);`;

const replacement = `  var liveRows = [];
  var headerRow = null;
  
  for (var si = 0; si < formSheets.length; si++) {
    var sheet = formSheets[si];
    var data = sheet.getDataRange().getValues();
    var gid = String(sheet.getSheetId());
    
    if (data.length === 0) continue;
    
    // L?y header t? tab d?u tiên
    if (!headerRow) {
      headerRow = [];
      for (var hi = 0; hi < data[0].length; hi++) {
        headerRow.push(String(data[0][hi]).trim());
      }
      headerRow.push("_gid", "_sheetRow");
    }
    
    // Data rows (b? header)
    for (var ri = 1; ri < data.length; ri++) {
      var row = data[ri];
      // B? dòng tr?ng (c?t C = Tên NV)
      if (!row[2] || String(row[2]).trim() === "") continue;
      
      var rowWithMeta = row.slice();
      while (rowWithMeta.length < headerRow.length - 2) rowWithMeta.push("");
      rowWithMeta.push(gid, ri + 1);
      liveRows.push(rowWithMeta);
    }
  }

  // --- UPSERT LOGIC (ARCHIVE TH?C S?) ---
  var archiveSS = SpreadsheetApp.openById(SYNC_CONFIG.ARCHIVE_SHEET_ID);
  var archiveSheet = archiveSS.getSheetByName(SYNC_CONFIG.ARCHIVE_TAB_ODO);
  var archiveData = [];
  try {
    if (archiveSheet.getLastRow() > 0) {
      archiveData = archiveSheet.getDataRange().getValues();
    }
  } catch(e) {}

  var upsertMap = {};
  var finalRows = [];
  
  // Hàm t?o Key: D?u th?i gian + Mã NV
  // C?t 0 là D?u th?i gian, C?t 3 là Mã NV (Mã nhân viên)
  function makeKey(r) {
    var ts = r[0] ? (r[0] instanceof Date ? r[0].getTime() : String(r[0]).trim()) : "";
    var empId = r[3] ? String(r[3]).trim() : "";
    return ts + "_" + empId;
  }

  // 1. Ðua d? li?u Archive vào Map (b? qua header)
  for (var i = 1; i < archiveData.length; i++) {
    var r = archiveData[i];
    var key = makeKey(r);
    if (key !== "_") {
      upsertMap[key] = r;
    }
  }

  // 2. Ghi dè/Thêm m?i b?ng d? li?u Live
  for (var j = 0; j < liveRows.length; j++) {
    var r = liveRows[j];
    var key = makeKey(r);
    if (key !== "_") {
      upsertMap[key] = r;
    }
  }

  // 3. Trích xu?t t?t c? rows (convert Map to Array)
  var keys = Object.keys(upsertMap);
  for (var k = 0; k < keys.length; k++) {
    finalRows.push(upsertMap[keys[k]]);
  }

  // S?p x?p theo Timestamp (tùy ch?n) d? d? nhìn trên Sheet
  finalRows.sort(function(a, b) {
    var ta = a[0] instanceof Date ? a[0].getTime() : 0;
    var tb = b[0] instanceof Date ? b[0].getTime() : 0;
    return ta - tb;
  });
  
  Logger.log("Employee ODO: Archive co " + (archiveData.length > 0 ? archiveData.length - 1 : 0) + 
             ", Live co " + liveRows.length + ", Final: " + finalRows.length + " dong");
             
  if (finalRows.length > 0) {
    writeToArchive(SYNC_CONFIG.ARCHIVE_TAB_ODO, headerRow, finalRows);
  }`;

content = content.replace(target, replacement);
fs.writeFileSync("C:/Users/MSI/.gemini/antigravity/brain/c7e65cba-7a2c-4fec-9c6c-dd170166bef5/SyncOdoToArchive.gs", content);
console.log("Updated SyncOdoToArchive.gs for ODO True Archive");
