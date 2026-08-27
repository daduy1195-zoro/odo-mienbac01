const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

// 1. Fix the syntax error in NCC_TRIP_SHEETS and move ALL to the bottom
const badArrayStr = `    NCC_TRIP_SHEETS: [
        if (tabGid === '1482895796' || (sheetId && sheetId.includes('1jFaJutdZD8uhBYa9Hy9fH6tHVaSnEf-iyg4VUMniXl8'))) {
            colNcc = 1; colDate = 2; colPlate = 3; colVehicle = 4; colRoute = 5; 
            colOtHours = 10; colOtFee = 12; colKmStart = 14; colKmEnd = 15; colKmOver = 17; colKmOverFee = 19; 
            colMonthlyRate = 20; colDailyRate = 21; colTollFee = 22; colHolidayFee = 23; colTotalCost = 24; colKho = 27;
        }
        { id: '1E8T_mJBy14qmTPT4k64zxVThjDNNoxEfzuynbuONCBg', gid: '679483124', ncc: 'Hoàng Minh' },
        { id: '1ZjxQD5Hh3nW7zxg4DCeWRfe704zoaD4gAcA5_hQFqQA', gid: '1620536867', ncc: 'Hoa Vinh' },
        { id: '1Q0idCOo-S-8XzmNWsw-4r51Kjsxsj0OxgP9D2ApCwxc', gid: '1290293725', ncc: 'Long Thành' },
        { id: '1Q0idCOo-S-8XzmNWsw-4r51Kjsxsj0OxgP9D2ApCwxc', gid: '1620536867', ncc: 'Long Thành' },
        { id: '1yqf8Bg6Tmq4v-qOzdpY9G4Y1OEnhQ5e7OURq017SiZI', gid: '2147444878', ncc: 'Đào Trọng An' },
        { id: '1T6Hj-tcabvxLARvF7YyUUI05SHpQmvcfjik_yPp4Mls', gid: '1012425134', ncc: 'TAL' },
        { id: '1aa_3Nwi0Z-SlGi-jZs1cNkU0v3Yt6p_9Fc4lr_oA5vY', gid: '942983334', ncc: 'Đại Minh' },
    ],`;

const goodArrayStr = `    NCC_TRIP_SHEETS: [
        { id: '1ZT_OPLSxOEWiy96YE-snqE-t3tX2T3EhkjDbk9Oll90', gid: '45442280', ncc: 'NAK' },
        { id: '1ZT_OPLSxOEWiy96YE-snqE-t3tX2T3EhkjDbk9Oll90', gid: '1620536867', ncc: 'NAK' },
        { id: '16jiK-hQ-xOrs9kxmJF6CXQ1HANy0zAlDyQM2q7mOtOg', gid: '73639881', ncc: 'Thiên Phú' },
        { id: '1aMz8LLOo9wm2KrDgEXk6xOKMN8wUrfCDco7pOM6t2Qs', gid: '679483124', ncc: 'Duy Phát' },
        { id: '1E8T_mJBy14qmTPT4k64zxVThjDNNoxEfzuynbuONCBg', gid: '679483124', ncc: 'Hoàng Minh' },
        { id: '1ZjxQD5Hh3nW7zxg4DCeWRfe704zoaD4gAcA5_hQFqQA', gid: '1620536867', ncc: 'Hoa Vinh' },
        { id: '1Q0idCOo-S-8XzmNWsw-4r51Kjsxsj0OxgP9D2ApCwxc', gid: '1290293725', ncc: 'Long Thành' },
        { id: '1Q0idCOo-S-8XzmNWsw-4r51Kjsxsj0OxgP9D2ApCwxc', gid: '1620536867', ncc: 'Long Thành' },
        { id: '1yqf8Bg6Tmq4v-qOzdpY9G4Y1OEnhQ5e7OURq017SiZI', gid: '2147444878', ncc: 'Đào Trọng An' },
        { id: '1T6Hj-tcabvxLARvF7YyUUI05SHpQmvcfjik_yPp4Mls', gid: '1012425134', ncc: 'TAL' },
        { id: '1aa_3Nwi0Z-SlGi-jZs1cNkU0v3Yt6p_9Fc4lr_oA5vY', gid: '942983334', ncc: 'Đại Minh' },
        // PUT 'ALL' SHEET LAST SO IT OVERWRITES INDIVIDUAL SHEETS IN DEDUPLICATION
        { id: '1jFaJutdZD8uhBYa9Hy9fH6tHVaSnEf-iyg4VUMniXl8', gid: '1482895796', ncc: 'ALL' }
    ],`;

let normalizedCode = code.replace(/\r\n/g, '\n');
let normalizedBad = badArrayStr.replace(/\r\n/g, '\n');
if (normalizedCode.includes(normalizedBad)) {
    normalizedCode = normalizedCode.replace(normalizedBad, goodArrayStr);
    console.log("Fixed array successfully.");
} else {
    // If exact match failed, let's just do a regex replace for the whole array block
    const arrayMatch = normalizedCode.match(/NCC_TRIP_SHEETS:\s*\[[\s\S]*?\],/);
    if (arrayMatch) {
        normalizedCode = normalizedCode.replace(arrayMatch[0], goodArrayStr);
        console.log("Fixed array using regex.");
    } else {
        console.log("Could not find array to fix.");
    }
}

// 2. Fix the parsing logic for ALL sheet
const badParseStr = `        if (tabGid === '1482895796' || (sheetId && sheetId.includes('1jFaJutdZD8uhBYa9Hy9fH6tHVaSnEf-iyg4VUMniXl8'))) {
            colNcc = 1; colDate = 2; colPlate = 3; colVehicle = 4; colRoute = 5; 
            colOtHours = 10; colOtFee = 12; colKmStart = 14; colKmEnd = 15; colKmOver = 16; colKmOverFee = 17; 
            colTollFee = 18; colHolidayFee = 19; colTotalCost = 24; colKho = 27;
        }`;

const goodParseStr = `        if (tabGid === '1482895796' || (sheetId && sheetId.includes('1jFaJutdZD8uhBYa9Hy9fH6tHVaSnEf-iyg4VUMniXl8'))) {
            colNcc = 1; colDate = 2; colPlate = 3; colVehicle = 4; colRoute = 5; 
            colOtHours = 10; colOtFee = 12; colKmStart = 14; colKmEnd = 15; 
            colKmOver = 17; colKmOverFee = 19; 
            colMonthlyRate = 20; colDailyRate = 21; colTollFee = 22; colHolidayFee = 23; colTotalCost = 24; colKho = 27;
        }`;

let normalizedBadParse = badParseStr.replace(/\r\n/g, '\n');
if (normalizedCode.includes(normalizedBadParse)) {
    normalizedCode = normalizedCode.replace(normalizedBadParse, goodParseStr);
    console.log("Fixed parse mapping successfully.");
} else {
    console.log("Could not find parse mapping.");
}

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', normalizedCode);
