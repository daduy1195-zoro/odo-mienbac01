const fs = require("fs");
let content = fs.readFileSync("C:/Users/MSI/.gemini/antigravity/brain/c7e65cba-7a2c-4fec-9c6c-dd170166bef5/SyncOdoToArchive.gs", "utf8");

const target = `  // Xóa d? li?u cu
  sheet.clearContents();
  
  // Set toàn b? sheet sang Plain Text d? Google không t? parse Date/Time
  var maxRows = Math.max(sheet.getMaxRows(), dataRows.length + 2);
  var maxColsFormat = headerRow ? headerRow.length : 20;
  sheet.getRange(1, 1, maxRows, maxColsFormat).setNumberFormat('@');`;

const replacement = `  // Xóa d? li?u cu
  sheet.clearContents();
  
  // Ð?m b?o d? dòng tru?c khi getRange
  var currentMaxRows = sheet.getMaxRows();
  var requiredRows = dataRows.length + 2;
  if (requiredRows > currentMaxRows) {
    sheet.insertRowsAfter(currentMaxRows, requiredRows - currentMaxRows);
  }
  
  // Set toàn b? sheet sang Plain Text d? Google không t? parse Date/Time
  var maxColsFormat = headerRow ? headerRow.length : 20;
  sheet.getRange(1, 1, requiredRows, maxColsFormat).setNumberFormat('@');`;

content = content.replace(target, replacement);

fs.writeFileSync("C:/Users/MSI/.gemini/antigravity/brain/c7e65cba-7a2c-4fec-9c6c-dd170166bef5/SyncOdoToArchive.gs", content);
console.log("Patched writeToArchive to add rows.");
