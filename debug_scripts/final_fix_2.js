const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const regex = /if\s*\(tabGid\s*===\s*'1482895796'[^}]+\}/;
const newStr = `if (tabGid === '1482895796' || (sheetId && sheetId.includes('1jFaJutdZD8uhBYa9Hy9fH6tHVaSnEf-iyg4VUMniXl8'))) {
          colNcc = 1; colDate = 2; colPlate = 3; colVehicle = 4; colRoute = 5; 
          colOtHours = 10; colOtFee = 12; colKmStart = 14; colKmEnd = 15; 
          colKmOver = 17; colKmOverFee = 19; 
          colMonthlyRate = 20; colDailyRate = 21; 
          colTollFee = 22; colHolidayFee = 23; colTotalCost = 24; colKho = 27;
      }`;

code = code.replace(regex, newStr);
fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Fixed parsing mapping.');
