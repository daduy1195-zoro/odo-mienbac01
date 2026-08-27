const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const target = `let holidayFee = (colHolidayFee > -1 ? row[colHolidayFee] : '').toString().trim();`;
const replace = `let holidayFee = (colHolidayFee > -1 ? row[colHolidayFee] : '').toString().trim();
        if (actualNcc === 'NAK') {
            console.log("DEBUG NAK:", { colMonthlyRate, colDailyRate, colTollFee, colHolidayFee, monthlyRate, dailyRate, tollFee, holidayFee });
        }`;

code = code.replace(target, replace);
fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Added debug log.');
