import codecs

content = codecs.open('index.html', 'r', 'utf-8').read()

target = '''    else if (["NAK", "Hoa Vinh", "Long Thành", "TAL", "Đại Minh", "Duy Phát", "Hoàng Minh"].includes(nccName) || tabGid === "1620536867" || tabGid === "1290293725" || tabGid === "45442280" || tabGid === "1012425134" || tabGid === "942983334" || tabGid === "679483124") {
            colNcc = -1; colDate = 1; colPlate = 2; colVehicle = 3; colRoute = 4;
            colOtHours = 9; colOtRate = 10; colOtFee = 11;
            colKmStart = 13; colKmEnd = 14; colKmDiff = 15;
            colKmOver = 16; colKmOverFee = 18;
            colMonthlyRate = 19; colDailyRate = 20;
            colTollFee = 21; colHolidayFee = 22; colTotalCost = 23; colKho = 26;
        }'''

replacement = '''    else if (["NAK", "Hoa Vinh", "Long Thành", "TAL"].includes(nccName) || tabGid === "1620536867" || tabGid === "1290293725" || tabGid === "45442280" || tabGid === "1012425134") {
            colNcc = -1; colDate = 1; colPlate = 2; colVehicle = 3; colRoute = 4;
            colOtHours = 9; colOtRate = 10; colOtFee = 11;
            colKmStart = 13; colKmEnd = 14; colKmDiff = 15;
            colKmOver = 16; colKmOverFee = 18;
            colMonthlyRate = 19; colDailyRate = 20;
            colTollFee = 21; colHolidayFee = 22; colTotalCost = 23; colKho = 26;
        }
        else if (["Đại Minh", "Duy Phát", "Hoàng Minh"].includes(nccName) || tabGid === "942983334" || tabGid === "679483124") {
            colNcc = -1; colDate = 1; colPlate = 2; colVehicle = 3; colRoute = 4;
            colOtHours = 9; colOtRate = 10; colOtFee = 11;
            colKmStart = 13; colKmEnd = 14; colKmDiff = 15;
            colKmOver = 16; colKmOverFee = 19;
            colMonthlyRate = 20; colDailyRate = 21;
            colTollFee = 22; colHolidayFee = 23; colTotalCost = 24; colKho = 27;
        }'''

if target in content:
    content = content.replace(target, replacement)
    codecs.open('index.html', 'w', 'utf-8').write(content)
    print('Replaced successfully')
else:
    print('Target not found!')

