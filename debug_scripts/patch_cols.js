const fs = require('fs');
let code = fs.readFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'utf8');

const search = `        if (tabGid === '1482895796' || (sheetId && sheetId.includes('1jFaJutdZD8uhBYa9Hy9fH6tHVaSnEf-iyg4VUMniXl8'))) {
            colNcc = 1; colDate = 2; colPlate = 3; colVehicle = 4; colRoute = 5; 
            colOtHours = 10; colOtFee = 12; colKmStart = 14; colKmEnd = 15; colKmOver = 16; colKmOverFee = 17; 
            colTollFee = 18; colHolidayFee = 19; colTotalCost = 24; colKho = 27;
        }`;

const replace = `        if (tabGid === '1482895796' || (sheetId && sheetId.includes('1jFaJutdZD8uhBYa9Hy9fH6tHVaSnEf-iyg4VUMniXl8'))) {
            colNcc = 1; colDate = 2; colPlate = 3; colVehicle = 4; colRoute = 5; 
            colOtHours = 10; colOtFee = 12; colKmStart = 14; colKmEnd = 15; 
            colKmOver = 17; colKmOverFee = 19; 
            colMonthlyRate = 20; colDailyRate = 21; 
            colTollFee = 22; colHolidayFee = 23; colTotalCost = 24; colKho = 27;
        }`;

if (code.includes(search)) {
    code = code.replace(search, replace);
    fs.writeFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', code);
    console.log("Patched exact string");
} else {
    // try regex
    let normalizedCode = code.replace(/\r\n/g, '\n');
    let normalizedSearch = search.replace(/\r\n/g, '\n');
    if (normalizedCode.includes(normalizedSearch)) {
        normalizedCode = normalizedCode.replace(normalizedSearch, replace.replace(/\r\n/g, '\n'));
        fs.writeFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', normalizedCode);
        console.log("Patched normalized string");
    } else {
        console.log("Not found!");
    }
}
