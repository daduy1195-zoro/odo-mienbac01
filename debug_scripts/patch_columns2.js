const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const targetRegex = /if \(colOtFee === -1\) colOtFee = 12;[\s\S]*?if \(colTotalCost === -1\) colTotalCost = 24;/;

const replacement = `if (colOtFee === -1) colOtFee = 12;
      if (colKmOverFee === -1) colKmOverFee = 17;
      if (colKmOver === -1) colKmOver = 16;
      
      // Fallback cho Tổng chi phí nếu chưa tìm thấy
      if (colTotalCost === -1) {
          // Thử tìm trong data row 1 hoặc 2
          let tryRow = rawData[headerRowIdx > -1 ? headerRowIdx + 1 : 1];
          if (!tryRow) tryRow = rawData[2];
          if (tryRow) {
              for (let tryCol = 28; tryCol >= 18; tryCol--) {
                  const v = parseVietnameseNumber(tryRow[tryCol]);
                  if (v > 100000) { colTotalCost = tryCol; break; }
              }
          }
          if (colTotalCost === -1) colTotalCost = 24; // Ultimate fallback
      }
      
      // Nếu các cột kia chưa tìm thấy, gán lùi từ colTotalCost
      if (colHolidayFee === -1) colHolidayFee = colTotalCost - 1;
      if (colTollFee === -1) colTollFee = colTotalCost - 2;
      if (colDailyRate === -1) colDailyRate = colTotalCost - 3;
      if (colMonthlyRate === -1) colMonthlyRate = colTotalCost - 4;`;

code = code.replace(targetRegex, replacement);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Columns fallback patched (regex).');
