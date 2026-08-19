const fs = require('fs');
let content = fs.readFileSync('SyncOdoToArchive.gs', 'utf8');

// I will replace writeToArchive(SYNC_CONFIG.ARCHIVE_TAB_NCC_TRIPS, headerRow, allRows);
// with writeNccTripsUpsert(SYNC_CONFIG.ARCHIVE_TAB_NCC_TRIPS, headerRow, allRows);
const regex = /writeToArchive\(SYNC_CONFIG\.ARCHIVE_TAB_NCC_TRIPS, headerRow, allRows\);/;
const replace = `writeNccTripsUpsert(SYNC_CONFIG.ARCHIVE_TAB_NCC_TRIPS, headerRow, allRows);`;

if (content.match(regex)) {
    content = content.replace(regex, replace);
}

// Now append the new writeNccTripsUpsert function
const upsertFn = `
function writeNccTripsUpsert(tabName, headerRow, incomingRows) {
  var ss = SpreadsheetApp.openById(SYNC_CONFIG.ARCHIVE_SHEET_ID);
  var sheet = ss.getSheetByName(tabName);
  
  if (!sheet) {
    sheet = ss.insertSheet(tabName);
    if (headerRow && headerRow.length > 0) {
      sheet.getRange(1, 1, 1, headerRow.length).setValues([headerRow]);
    }
  }
  
  var existingData = [];
  try {
    existingData = sheet.getDataRange().getValues();
  } catch(e) {}
  
  if (existingData.length <= 1) {
    // If sheet is essentially empty, just write like normally
    if (incomingRows.length > 0) {
      sheet.clearContents();
      if (headerRow && headerRow.length > 0) {
        sheet.getRange(1, 1, 1, headerRow.length).setValues([headerRow]);
      }
      var batchSize = 5000;
      var maxCols = incomingRows[0].length;
      for (var i = 0; i < incomingRows.length; i += batchSize) {
        var batch = incomingRows.slice(i, i + batchSize);
        sheet.getRange(i + 2, 1, batch.length, maxCols).setValues(batch);
      }
    }
    return;
  }
  
  function getCycle(dateStr) {
    if (!dateStr) return 'UNKNOWN';
    var parts = dateStr.split('/');
    if (parts.length !== 3) return 'UNKNOWN';
    var d = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10);
    var y = parseInt(parts[2], 10);
    if (d >= 26) {
      m += 1;
      if (m > 12) { m = 1; y += 1; }
    }
    return y + '_' + (m < 10 ? '0' + m : m);
  }
  
  function extractDateStr(row) {
    for (var i = 0; i < 5; i++) {
      var s = String(row[i]).trim();
      var match = s.match(/^(\\d{2}\\/\\d{2}\\/\\d{4})/);
      if (match) return match[1];
    }
    return null;
  }
  
  var activeCycles = {};
  for (var i = 0; i < incomingRows.length; i++) {
    var r = incomingRows[i];
    var ncc = String(r[r.length - 3] || '').trim();
    var dateStr = extractDateStr(r);
    var cycle = getCycle(dateStr);
    if (cycle !== 'UNKNOWN' && ncc) {
      activeCycles[ncc + '|' + cycle] = true;
    }
  }
  
  var existingHeader = existingData[0];
  var keptRows = [];
  for (var i = 1; i < existingData.length; i++) {
    var r = existingData[i];
    var ncc = String(r[r.length - 3] || '').trim();
    var dateStr = extractDateStr(r);
    var cycle = getCycle(dateStr);
    var key = ncc + '|' + cycle;
    if (!activeCycles[key]) {
      keptRows.push(r);
    }
  }
  
  var finalRows = keptRows.concat(incomingRows);
  
  sheet.clearContents();
  sheet.getRange(1, 1, 1, existingHeader.length).setValues([existingHeader]);
  
  if (finalRows.length > 0) {
    var batchSize = 5000;
    var maxCols = finalRows[0].length;
    for (var i = 0; i < finalRows.length; i += batchSize) {
      var batch = finalRows.slice(i, i + batchSize);
      sheet.getRange(i + 2, 1, batch.length, maxCols).setValues(batch);
    }
  }
  
  Logger.log('Upsert ' + tabName + ': Kept ' + keptRows.length + ' old rows, added ' + incomingRows.length + ' new rows');
}
`;

content += upsertFn;
fs.writeFileSync('SyncOdoToArchive.gs', content, 'utf8');
console.log('Appended writeNccTripsUpsert');
