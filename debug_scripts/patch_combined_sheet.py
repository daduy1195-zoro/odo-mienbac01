# -*- coding: utf-8 -*-
with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf-8') as f:
    code = f.read()

import re

search = r"let colKmStart = -1, colKmEnd = -1, colKmDiff = -1, colRoute = -1, colDate = 1, colPlate = 2, colVehicle = 3, colNcc = -1, colKho = -1;\s*let colOtHours = -1, colOtRate = -1, colOtFee = -1, colKmOver = -1, colKmOverFee = -1, colMonthlyRate = -1, colDailyRate = -1, colTollFee = -1, colHolidayFee = -1, colTotalCost = -1;"

replace = """let colKmStart = -1, colKmEnd = -1, colKmDiff = -1, colRoute = -1, colDate = 1, colPlate = 2, colVehicle = 3, colNcc = -1, colKho = -1;
      let colOtHours = -1, colOtRate = -1, colOtFee = -1, colKmOver = -1, colKmOverFee = -1, colMonthlyRate = -1, colDailyRate = -1, colTollFee = -1, colHolidayFee = -1, colTotalCost = -1;
      
      if (tabGid === '1482895796' || (sheetId && sheetId.includes('1jFaJutdZD8uhBYa9Hy9fH6tHVaSnEf-iyg4VUMniXl8'))) {
          colNcc = 1; colDate = 2; colPlate = 3; colVehicle = 4; colRoute = 5; 
          colOtHours = 10; colOtFee = 12; colKmStart = 14; colKmEnd = 15; colKmOver = 16; colKmOverFee = 17; 
          colTollFee = 18; colHolidayFee = 19; colTotalCost = 24; colKho = 27;
      }"""
      
code = re.sub(search, replace, code)

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf-8') as f:
    f.write(code)

print("Done")
