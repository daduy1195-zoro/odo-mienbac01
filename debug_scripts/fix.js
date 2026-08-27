const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const badLines = `    NCC_TRIP_SHEETS: [
        if (tabGid === '1482895796' || (sheetId && sheetId.includes('1jFaJutdZD8uhBYa9Hy9fH6tHVaSnEf-iyg4VUMniXl8'))) {
            colNcc = 1; colDate = 2; colPlate = 3; colVehicle = 4; colRoute = 5; 
            colOtHours = 10; colOtFee = 12; colKmStart = 14; colKmEnd = 15; colKmOver = 17; colKmOverFee = 19; 
            colMonthlyRate = 20; colDailyRate = 21; colTollFee = 22; colHolidayFee = 23; colTotalCost = 24; colKho = 27;
        }
        { id: '1E8T_mJBy14qmTPT4k64zxVThjDNNoxEfzuynbuONCBg', gid: '679483124', ncc: 'Hoàng Minh' },`;

const goodLines = `    NCC_TRIP_SHEETS: [
        { id: '1jFaJutdZD8uhBYa9Hy9fH6tHVaSnEf-iyg4VUMniXl8', gid: '1482895796', ncc: 'ALL' },
        { id: '1ZT_OPLSxOEWiy96YE-snqE-t3tX2T3EhkjDbk9Oll90', gid: '45442280', ncc: 'NAK' },
        { id: '1ZT_OPLSxOEWiy96YE-snqE-t3tX2T3EhkjDbk9Oll90', gid: '1620536867', ncc: 'NAK' },
        { id: '16jiK-hQ-xOrs9kxmJF6CXQ1HANy0zAlDyQM2q7mOtOg', gid: '73639881', ncc: 'Thiên Phú' },
        { id: '1aMz8LLOo9wm2KrDgEXk6xOKMN8wUrfCDco7pOM6t2Qs', gid: '679483124', ncc: 'Duy Phát' },
        { id: '1E8T_mJBy14qmTPT4k64zxVThjDNNoxEfzuynbuONCBg', gid: '679483124', ncc: 'Hoàng Minh' },`;

code = code.replace(badLines, goodLines);
fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Fixed broken array');
