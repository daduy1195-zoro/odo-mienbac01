const fs=require('fs');
const c=fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html','utf8').split('\n');
let idx=-1;
for(let i=0;i<c.length;i++){
    if(c[i].includes('colTotalCost = 24; colKho = 27;')){
        idx=i;
        break;
    }
}
if(idx>-1){
    c.splice(idx+2,0,
        '} else if (tabGid === "1620536867" || tabGid === "1290293725" || tabGid === "73639881" || tabGid === "45442280" || tabGid === "1012425134" || tabGid === "2147444878" || tabGid === "942983334") {',
        '    colNcc = -1; colDate = 1; colPlate = 2; colVehicle = 3; colRoute = 4;',
        '    colOtHours = 9; colOtRate = 10; colOtFee = 11;',
        '    colKmStart = 13; colKmEnd = 14; colKmDiff = 15;',
        '    colKmOver = 16; colKmOverFee = 18;',
        '    colMonthlyRate = 19; colDailyRate = 20;',
        '    colTollFee = 21; colHolidayFee = 22; colTotalCost = 23; colKho = 26;'
    );
    fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', c.join('\n'));
    console.log('Patched');
} else {
    console.log('Not found');
}
