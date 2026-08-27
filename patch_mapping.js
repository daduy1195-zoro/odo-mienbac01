const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const target = `    colTollFee = 22; colHolidayFee = 23; colTotalCost = 24; colKho = 27;
}`;
const replacement = `    colTollFee = 22; colHolidayFee = 23; colTotalCost = 24; colKho = 27;
} else if (tabGid === '1620536867' || tabGid === '1290293725' || tabGid === '73639881' || tabGid === '45442280' || tabGid === '1012425134' || tabGid === '2147444878' || tabGid === '942983334') { // NCC: Hoa Vinh, NAK, Long Thanh, Thien Phu, TAL, Đao Truong An, Dai Minh (T7)
    colNcc = -1; colDate = 1; colPlate = 2; colVehicle = 3; colRoute = 4;
    colOtHours = 9; colOtRate = 10; colOtFee = 11;
    colKmStart = 13; colKmEnd = 14; colKmDiff = 15;
    colKmOver = 16; colKmOverFee = 18;
    colMonthlyRate = 19; colDailyRate = 20;
    colTollFee = 21; colHolidayFee = 22; colTotalCost = 23; colKho = 26;
}`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
    console.log('Patched mapping successfully');
} else {
    console.log('Could not find target');
}
