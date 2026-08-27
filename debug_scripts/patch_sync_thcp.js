const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/App_tai_xe/odo_script/SyncOdoToArchive.gs', 'utf8');

const thcpFunc = `
// ==========================================
// GHI NGƯỢC MÃ CHUYẾN TỪ DASHBOARD VÀO THCP
// ==========================================
function syncOverridesToTHCP() {
  try {
    var res = UrlFetchApp.fetch('https://script.google.com/macros/s/AKfycbwJr2pgITDURfuT_H3zGUYXUEC2SzvM0V_JNSFPqLwexGLElVlGPSpzPXMXpmE4R25e4g/exec');
    var json = JSON.parse(res.getContentText());
    var overrides = json.data.overrides || {};
    
    var sheetId = '1tATkbxYOtiBuJC1GRto3QI81q_fkGzKYylufz4WtuAA';
    var gid = 1957064243;
    var ss = SpreadsheetApp.openById(sheetId);
    var sheets = ss.getSheets();
    var thcpSheet = null;
    for (var i = 0; i < sheets.length; i++) {
       if (sheets[i].getSheetId() == gid) { thcpSheet = sheets[i]; break; }
    }
    if (!thcpSheet) return;
    
    var dataRange = thcpSheet.getDataRange();
    var dataRows = dataRange.getValues();
    var lastRow = dataRows.length;
    var colAC = 28; // Index 28 = Column AC (0-based)
    var updated = false;
    
    for (var key in overrides) {
      var parts = key.split('_');
      if (parts.length < 4) continue;
      
      var sourceRowStr = parts[parts.length - 1];
      var sourceRow = parseInt(sourceRowStr, 10);
      
      if (!isNaN(sourceRow) && sourceRow >= 3 && (sourceRow + 1) <= lastRow) {
         var sheetRow = sourceRow + 1; // 1-based
         var rowIndex = sheetRow - 1;  // 0-based
         
         var r = dataRows[rowIndex];
         
         var rNcc = String(r[1] || '').toLowerCase().replace(/[\\s\\.-]/g, '');
         var keyNcc = String(parts[0] || '').toLowerCase().replace(/[\\s\\.-]/g, '');
         
         var rPlate = String(r[3] || '').toLowerCase().replace(/[\\s\\.-]/g, '');
         var keyPlate = String(parts[1] || '').toLowerCase().replace(/[\\s\\.-]/g, '');
         
         if ((rNcc.indexOf(keyNcc) > -1 || keyNcc.indexOf(rNcc) > -1) && rPlate === keyPlate) {
             var newVal = overrides[key] || '';
             var oldVal = String(r[colAC] || '');
             if (newVal !== oldVal) {
                 dataRows[rowIndex][colAC] = newVal;
                 updated = true;
             }
         }
      }
    }
    
    if (updated) {
       var acColRange = thcpSheet.getRange(1, 29, lastRow, 1);
       var acColData = [];
       for (var i = 0; i < lastRow; i++) {
           acColData.push([ dataRows[i][colAC] || '' ]);
       }
       acColRange.setValues(acColData);
       console.log("THCP WriteBack: Updated column AC");
    }
  } catch(e) {
    console.error('syncOverridesToTHCP Error:', e);
  }
}
`;

if (!code.includes('syncOverridesToTHCP()')) {
    code += thcpFunc;
    
    const triggerHookStr = `function syncOdoDataToArchive() {`;
    const triggerHookRep = `function syncOdoDataToArchive() {\n  // Ghi ngược mã chuyến vào THCP\n  syncOverridesToTHCP();\n`;
    
    code = code.replace(triggerHookStr, triggerHookRep);
    
    fs.writeFileSync('C:/Users/MSI/Desktop/AI/App_tai_xe/odo_script/SyncOdoToArchive.gs', code);
    console.log('Patched SyncOdoToArchive.gs with syncOverridesToTHCP');
} else {
    console.log('Already patched');
}
