const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const startMarker = 'else if (["NAK", "Thiên Phú", "Hoa Vinh", "Long Thành", "Đạo Trường An", "TAL"].includes(nccName)';
const startIdx = code.indexOf(startMarker);

if (startIdx !== -1) {
    const endStr = 'colTollFee = 21; colHolidayFee = 22; colTotalCost = 23; colKho = 26;\n        }';
    let endIdx = code.indexOf(endStr);
    let origEndStr = endStr;
    if (endIdx === -1) {
        origEndStr = 'colTollFee = 21; colHolidayFee = 22; colTotalCost = 23; colKho = 26;\r\n        }';
        endIdx = code.indexOf(origEndStr);
    }
    
    if (endIdx !== -1) {
        endIdx += origEndStr.length;
        const originalBlock = code.substring(startIdx, endIdx);
        
        const newBlock = `else if (["NAK", "Hoa Vinh", "Long Thành", "TAL"].includes(nccName) || tabGid === "1620536867" || tabGid === "1290293725" || tabGid === "73639881" || tabGid === "45442280" || tabGid === "1012425134") {
            colNcc = -1; colDate = 1; colPlate = 2; colVehicle = 3; colRoute = 4;
            colOtHours = 9; colOtRate = 10; colOtFee = 11;
            colKmStart = 13; colKmEnd = 14; colKmDiff = 15;
            colKmOver = 16; colKmOverFee = 18;
            colMonthlyRate = 19; colDailyRate = 20;
            colTollFee = 21; colHolidayFee = 22; colTotalCost = 23; colKho = 26;
        }
        else if (["Thiên Phú", "Đạo Trường An"].includes(nccName) || tabGid === "2147444878") {
            colNcc = -1; colDate = 1; colPlate = 2; colVehicle = 3; colRoute = 4;
            colOtHours = 9; colOtRate = 10; colOtFee = 11;
            colKmStart = 14; colKmEnd = 15; colKmDiff = 16;
            colKmOver = 17; colKmOverFee = 19;
            colMonthlyRate = 20; colDailyRate = 21;
            colTollFee = 22; colHolidayFee = 23; colTotalCost = 24; colKho = 27;
        }`;
            
        code = code.replace(originalBlock, newBlock);
        fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
        console.log('Successfully patched index.html');
    } else {
        console.log('Found start but not end marker.');
    }
} else {
    console.log('Could not find the start marker in the file.');
}
