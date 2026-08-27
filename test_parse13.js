const localStorage = { getItem: () => "{}" };
let overridesCache={}, notesCache={}, logsCache={};
function formatPlate(p) { return p; }
function cleanTripCode(c){return c;}
function normalizeSupplierName(c){return c;}
function parseVietnameseNumber(v){return parseFloat((v||"").toString().replace(/[^\d.-]/g, ""));}
let currentUser={};
function detectWH(s) { if(s.includes("hải phòng")) return "Hải Phòng"; if(s.includes("hải dương")) return "Hải Dương"; return ""; } function normalizeStr(s){return s;}

function parseNccTabData(rawData, nccName, ghnTripMap, sheetId, tabName, tabGid, sourceRowsArray) {
    const results = [];
    const normalizeStr = s => s ? String(s).trim().toLowerCase().replace(/[-\s\.]/g, '') : '';
    const detectWH = (str) => {
        if (str.includes('thái bình')) return 'Thái Bình';
        if (str.includes('hải dương')) return 'Hải Dương';
        if (str.includes('hải phòng') && /kv2|kv3/i.test(str)) return 'Hải Dương';
        if (str.includes('hải phòng')) return 'Hải Phòng';
        if (str.includes('hưng yên')) return 'Hưng Yên';
        return '';
    };
    // Tìm header row (chứa "Biển số" hoặc "STT")
    let headerRowIdx = -1;
    for (let i = 0; i < Math.min(15, rawData.length); i++) {
        const rowStr = rawData[i].map(c => (c || '').toString().toLowerCase()).join(' ');
        if (rowStr.includes('biển số') || (rowStr.includes('stt') && rowStr.includes('lộ trình')) || rowStr.includes('lộ trình')) {
            headerRowIdx = i;
            break;
        }
    }
    
    // ★ Xác định vị trí cột KM vào/ra từ header row
    let colKmStart = -1, colKmEnd = -1, colKmDiff = -1, colRoute = -1, colDate = 1, colPlate = 2, colVehicle = 3, colNcc = -1, colKho = -1;
      let colOtHours = -1, colOtRate = -1, colOtFee = -1, colKmOver = -1, colKmOverFee = -1, colMonthlyRate = -1, colDailyRate = -1, colTollFee = -1, colHolidayFee = -1, colTotalCost = -1;
      
      if (tabGid === '1482895796' || tabGid === '1957064243' || (sheetId && (sheetId.includes('1jFaJutdZD8uhBYa9Hy9fH6tHVaSnEf-iyg4VUMniXl8') || sheetId.includes('1tATkbxYOtiBuJC1GRto3QI81q_fkGzKYylufz4WtuAA')))) {
          colNcc = 1; colDate = 2; colPlate = 3; colVehicle = 4; colRoute = 5; 
          colOtHours = 10; colOtFee = 12; colKmStart = 14; colKmEnd = 15; 
          colKmOver = 17; colKmOverFee = 19; 
          colMonthlyRate = 20; colDailyRate = 21; 
          colTollFee = 22; colHolidayFee = 23; colTotalCost = 24; colKho = 27;
      }
    else if (["NAK", "Thiên Phú", "Hoa Vinh", "Long Thành", "Đạo Trường An", "TAL"].includes(nccName) || tabGid === "1620536867" || tabGid === "1290293725" || tabGid === "73639881" || tabGid === "45442280" || tabGid === "1012425134" || tabGid === "2147444878") {
    colNcc = -1; colDate = 1; colPlate = 2; colVehicle = 3; colRoute = 4;
    colOtHours = 9; colOtRate = 10; colOtFee = 11;
    colKmStart = 13; colKmEnd = 14; colKmDiff = 15;
    colKmOver = 16; colKmOverFee = 18;
    colMonthlyRate = 19; colDailyRate = 20;
    colTollFee = 21; colHolidayFee = 22; colTotalCost = 23; colKho = 26;
}
    if (headerRowIdx > -1) {
        // Scan nhiều dòng header (multi-row merged headers) cho cột tài chính
        const scanStart = Math.max(0, headerRowIdx - 3);
        const scanEnd = Math.min(rawData.length - 1, headerRowIdx + 1);
        for (let ri = scanStart; ri <= scanEnd; ri++) {
            const hdr = rawData[ri].map(c => (c || '').toString().toLowerCase().replace(/\s+/g, ' ').trim());
            for (let ci = 0; ci < hdr.length; ci++) {
                const h = hdr[ci];
                if (!h) continue;
                // KM columns (chỉ scan dòng header chính)
                if (ri === headerRowIdx) {
                    if (h.includes('km vào') || h.includes('km đi') || h.includes('km bắt đầu')) colKmStart = ci;
                    if (h.includes('km ra') || h.includes('km về') || h.includes('km kết thúc')) colKmEnd = ci;
                    if (h.includes('km chạy') || h.includes('tổng km') || (h.includes('số km') && !h.includes('vào') && !h.includes('ra') && !h.includes('phát sinh') && !h.includes('/')) || h.includes('km chênh lệch') || h.includes('cự ly') || h.includes('quãng đường')) colKmDiff = ci;
                    if (h === 'lộ trình' || h === 'tuyến đường' || h.includes('điểm giao') || h === 'tuyến') colRoute = ci;
                if (h.includes('ngày') && h.includes('thực hiện')) colDate = ci;
                if (h.includes('biển số')) colPlate = ci;
                if (h === 'xe' || h.includes('loại xe')) colVehicle = ci;
                  if (h === 'kho' || h.includes('kho trạm') || h.includes('trạm')) colKho = ci;
                if (h === 'chi' || h.includes('nhà cung cấp') || h === 'ncc') colNcc = ci;
                if (h.includes('số km phát sinh tăng') || h.includes('km phát sinh tăng')) colKmOver = ci;
                }
                // Financial columns (scan tất cả dòng header)
                if ((h.includes('tổng chi phí') || h.includes('tổng tiền') || h.includes('tong chi phi') || (h.includes('tổng') && h.includes('phí')) || h === 'tổng') && !h.includes('km')) colTotalCost = ci;
                if ((h.includes('đơn giá') && (h.includes('tháng') || h.includes('thang'))) || h.includes('giá tháng') || h.includes('thuê/tháng') || h.includes('thue/thang')) colMonthlyRate = ci;
                if ((h.includes('đơn giá') && (h.includes('ngày') || h.includes('ngay'))) || h.includes('giá ngày') || h.includes('thuê/ngày') || h.includes('thue/ngay')) colDailyRate = ci;
                if (h.includes('cầu đường') || h.includes('giá cầu') || h.includes('phí cầu') || h.includes('cau duong')) colTollFee = ci;
                if (h.includes('ngày lễ') || h.includes('ngay le') || h.includes('lễ tết')) colHolidayFee = ci;
                if (h.includes('vượt km') || h.includes('km vượt') || h.includes('phí vượt') || h.includes('vuot km')) colKmOverFee = ci;
                  if (h.includes('thời gian tăng ca') || h.includes('tg tăng ca') || h.includes('giờ tăng ca')) colOtHours = ci;
                  if (h.includes('phí tăng ca') || h.includes('tiền tăng ca')) colOtFee = ci;
                  if (h.includes('đơn giá tăng ca') || h.includes('giá tăng ca')) colOtRate = ci;
                  if (h.includes('số km phát sinh tăng') || h.includes('km phát sinh tăng') || (h.includes('km') && h.includes('phát sinh'))) colKmOver = ci;
            }
        }
    }
    if (colKmEnd > -1 && colKmDiff === -1) colKmDiff = colKmEnd + 1;
    // Fallback: nếu không tìm được trong header, thử scan data row đầu tiên
    // để phát hiện 2 cột liên tiếp có giá trị lớn (>1000) là odometer readings
    if (colKmStart === -1 || colKmEnd === -1) {
        const startRow = headerRowIdx > -1 ? headerRowIdx + 1 : 0;
        for (let i = startRow; i < Math.min(startRow + 5, rawData.length); i++) {
            const row = rawData[i];
            if (!row) continue;
            for (let ci = 12; ci <= 16; ci++) {
                const v1 = parseFloat((row[ci] || '').toString().replace(/[^\d.]/g, ''));
                const v2 = parseFloat((row[ci+1] || '').toString().replace(/[^\d.]/g, ''));
                // KM vào ca và KM ra ca phải > 1000 và gần nhau (chênh < 500)
                if (v1 > 1000 && v2 > 1000 && Math.abs(v2 - v1) < 500) {
                    colKmStart = ci;
                    colKmEnd = ci + 1;
                    if (colKmDiff === -1) colKmDiff = colKmEnd + 1;
                    break;
                }
            }
            if (colKmStart > -1) break;
        }
    }
    // Final fallback
    if (colKmStart === -1) colKmStart = 14;
    if (colKmEnd === -1) colKmEnd = 15;
    if (colKmDiff === -1) colKmDiff = 16;

      if (colOtHours === -1) colOtHours = 10;
      if (colOtRate === -1) colOtRate = 11;
      if (colOtFee === -1) colOtFee = 12;
      if (colKmOverFee === -1) colKmOverFee = 17;
      if (colKmOver === -1) colKmOver = 16;
      
      // Fallback cho Tổng chi phí nếu chưa tìm thấy
      if (colTotalCost === -1) {
          // Thử tìm trong data row 1 hoặc 2
          let tryRow = rawData[headerRowIdx > -1 ? headerRowIdx + 1 : 1];
          if (!tryRow) tryRow = rawData[2];
          if (tryRow) {
              for (let tryCol = 28; tryCol >= 18; tryCol--) {
                  const v = parseVietnameseNumber(tryRow[tryCol]);
                  if (v > 100000) { colTotalCost = tryCol; break; }
              }
          }
          if (colTotalCost === -1) colTotalCost = 24; // Ultimate fallback
      }
      
      // Nếu các cột kia chưa tìm thấy, gán lùi từ colTotalCost
      if (colHolidayFee === -1) colHolidayFee = colTotalCost - 1;
      if (colTollFee === -1) colTollFee = colTotalCost - 2;
      if (colDailyRate === -1) colDailyRate = colTotalCost - 3;
      if (colMonthlyRate === -1) colMonthlyRate = colTotalCost - 4;
    
    // ★ Fix: nếu colTotalCost trùng với cột khác đã detect, dịch sang cột kế tiếp
    const usedCols = new Set([colOtHours, colOtRate, colOtFee, colKmOverFee, colMonthlyRate, colDailyRate, colTollFee, colHolidayFee]);
    if (usedCols.has(colTotalCost)) {
        // Tìm cột tiếp theo chưa dùng, ưu tiên colHolidayFee + 1 hoặc + 2
        for (let tryCol = colHolidayFee + 1; tryCol <= colHolidayFee + 3; tryCol++) {
            if (!usedCols.has(tryCol)) { colTotalCost = tryCol; break; }
        }
    }
    
    // ★ Auto-detect: nếu cột totalCost trong data rows đầu tiên toàn null/0, scan tìm cột có giá trị lớn (>100k)
    const dataStartRow = headerRowIdx > -1 ? headerRowIdx + 1 : 0;
    let totalCostHasValue = false;
    for (let si = dataStartRow; si < Math.min(dataStartRow + 5, rawData.length); si++) {
        const row = rawData[si];
        if (!row) continue;
        const v = parseVietnameseNumber(row[colTotalCost]);
        if (v > 100000) { totalCostHasValue = true; break; }
    }
    if (!totalCostHasValue) {
        // Scan các cột lân cận (22-26) để tìm cột có giá trị tiền lớn
        for (let tryCol = 22; tryCol <= 26; tryCol++) {
            if (tryCol === colTotalCost || usedCols.has(tryCol)) continue;
            for (let si = dataStartRow; si < Math.min(dataStartRow + 5, rawData.length); si++) {
                const row = rawData[si];
                if (!row) continue;
                const v = parseVietnameseNumber(row[tryCol]);
                if (v > 100000) { colTotalCost = tryCol; totalCostHasValue = true; break; }
            }
            if (totalCostHasValue) break;
        }
    }
    
    console.log(`📊 ${nccName} [${tabName}] cols: kmOver=${colKmOverFee}, monthly=${colMonthlyRate}, daily=${colDailyRate}, toll=${colTollFee}, holiday=${colHolidayFee}, total=${colTotalCost}`);
    
    const startRow = headerRowIdx > -1 ? headerRowIdx + 1 : 0;
    

    let overridesCache = {};
    let notesCache = {};
    let logsCache = {};
    try {
        overridesCache = JSON.parse(localStorage.getItem('GHN_NCC_TRIP_OVERRIDES') || '{}');
        notesCache = JSON.parse(localStorage.getItem('GHN_NCC_TRIP_NOTES') || '{}');
        logsCache = JSON.parse(localStorage.getItem('GHN_ACTION_LOGS') || '{}');
    } catch(e) {}
    
    for (let i = startRow; i < rawData.length; i++) {
        const row = rawData[i];
        if (!row || row.length < 5) continue;
        
        // Cập nhật column indices nếu dòng này là header của tab mới
        const rowStr = row.map(c => (c || '').toString().toLowerCase()).join(' ');
        if (rowStr.includes('tổng chi phí') || (rowStr.includes('biển số') && (rowStr.includes('kho') || rowStr.includes('lộ trình')))) {
            const hdr = row.map(c => (c || '').toString().toLowerCase().replace(/\s+/g, ' ').trim());
            for (let ci = 0; ci < hdr.length; ci++) {
                const h = hdr[ci];
                if (!h) continue;
                if (h.includes('km vào') || h.includes('km đi') || h.includes('km bắt đầu')) colKmStart = ci;
                if (h.includes('km ra') || h.includes('km về') || h.includes('km kết thúc')) colKmEnd = ci;
                if (h.includes('km chạy') || h.includes('tổng km') || (h.includes('số km') && !h.includes('vào') && !h.includes('ra') && !h.includes('phát sinh') && !h.includes('/')) || h.includes('km chênh lệch') || h.includes('cự ly') || h.includes('quãng đường')) colKmDiff = ci;
                if (h === 'lộ trình' || h === 'tuyến đường' || h.includes('điểm giao') || h === 'tuyến') colRoute = ci;
                if (h.includes('ngày') && h.includes('thực hiện')) colDate = ci;
                if (h.includes('biển số')) colPlate = ci;

                        if (h.includes('phí tăng ca') || h.includes('tiền tăng ca')) colOtFee = ci;
                        if (h.includes('vượt km') || h.includes('km vượt') || h.includes('phí vượt') || h.includes('vuot km')) colKmOverFee = ci;
                        if (h.includes('thời gian tăng ca') || h.includes('số giờ tăng ca')) colOtHours = ci;
                        if (h.includes('giá tăng ca')) colOtRate = ci;
        
                if (h === 'xe' || h.includes('loại xe')) colVehicle = ci;
                  if (h === 'kho' || h.includes('kho trạm') || h.includes('trạm')) colKho = ci;
                if (h === 'chi' || h.includes('nhà cung cấp') || h === 'ncc') colNcc = ci;
                if (h.includes('số km phát sinh tăng') || h.includes('km phát sinh tăng')) colKmOver = ci;
                if ((h.includes('đơn giá') && (h.includes('tháng') || h.includes('thang'))) || h.includes('giá tháng') || h.includes('thuê/tháng') || h.includes('thue/thang')) colMonthlyRate = ci;
                if ((h.includes('đơn giá') && (h.includes('ngày') || h.includes('ngay'))) || h.includes('giá ngày') || h.includes('thuê/ngày') || h.includes('thue/ngay')) colDailyRate = ci;
                if (h.includes('cầu đường') || h.includes('giá cầu') || h.includes('phí cầu') || h.includes('cau duong')) colTollFee = ci;
                if (h.includes('ngày lễ') || h.includes('ngay le') || h.includes('lễ tết')) colHolidayFee = ci;
                if ((h.includes('tổng chi phí') || h.includes('tổng tiền') || h.includes('tong chi phi') || (h.includes('tổng') && h.includes('phí')) || h === 'tổng') && !h.includes('km')) colTotalCost = ci;
            }
            if (colKmEnd > -1 && colKmDiff === -1) colKmDiff = colKmEnd + 1;
            continue; // Bỏ qua dòng header này
        }

        const stt = (row[0] || '').toString().trim();
        const dateStr = (row[colDate] || '').toString().trim();
        let plate = (row[colPlate] || '').toString().trim();
        let actualNcc = nccName;
        if (colNcc > -1 && row[colNcc]) actualNcc = normalizeSupplierName(row[colNcc].toString().trim());
        else actualNcc = normalizeSupplierName(nccName);
        
        if (!dateStr) continue;
        
        let isOffByPlate = false;
        let inferredWH = '';
        // Quét tìm chữ OFF/NGHỈ trên tất cả các cột
        for (let c = 2; c < row.length; c++) {
            let val = (row[c] || '').toString().trim().toUpperCase();
            if (val === 'OFF' || val === 'NGHỈ' || val === 'NGHI' || val === 'GHN OFF' || val === 'NCC OFF') {
                isOffByPlate = true;
                break;
            }
        }
        
        // Nếu không có biển số, và cũng không phải ngày nghỉ -> bỏ qua luôn
        if (!plate && !isOffByPlate) continue;
        
        if (isOffByPlate) {
            let inferred = '';
            
            // Hàm quét lấy kho từ 1 dòng
            const extractWHFromRow = (r) => {
                let rRoute = colRoute > -1 ? (r[colRoute] || '').toString().toLowerCase() : '';
                let rKho = '';
                for (let ci = 25; ci <= 33; ci++) {
                    if (r[ci]) rKho += ' ' + r[ci].toString().toLowerCase();
                }
                return detectWH(rKho) || detectWH(rKho + ' ' + rRoute);
            };

            // Quét lên trước (ưu tiên biển số liền trước đó)
            for (let j = i - 1; j >= Math.max(0, i - 31); j--) {
                if (!rawData[j] || !rawData[j][colDate > -1 ? colDate : 1] || !rawData[j][colDate > -1 ? colDate : 1].toString().match(/\d/)) continue;
                let p = (rawData[j][colPlate > -1 ? colPlate : 2] || '').toString().trim().toUpperCase();
                if (p && !p.includes('OFF') && !p.includes('NGHỈ') && !p.includes('NGHI') && p.length >= 6) {
                    inferred = p;
                    inferredWH = extractWHFromRow(rawData[j]);
                    break;
                }
            }
            // Nếu không có, quét xuống
            if (!inferred) {
                for (let j = i + 1; j <= Math.min(rawData.length - 1, i + 31); j++) {
                    if (!rawData[j] || !rawData[j][colDate > -1 ? colDate : 1] || !rawData[j][colDate > -1 ? colDate : 1].toString().match(/\d/)) continue;
                    let p = (rawData[j][colPlate > -1 ? colPlate : 2] || '').toString().trim().toUpperCase();
                    if (p && !p.includes('OFF') && !p.includes('NGHỈ') && !p.includes('NGHI') && p.length >= 6) {
                        inferred = p;
                        inferredWH = extractWHFromRow(rawData[j]);
                        break;
                    }
                }
            }

            if (inferred) plate = inferred;
            else continue; // Không thể tìm ra biển số thực sự
        }
        
        if (typeof formatPlate === "function") plate = formatPlate(plate);
        if (!dateStr.match(/\d{2}\/\d{2}\/\d{4}/)) continue;
        if (stt && isNaN(stt) && !stt.match(/^\d/)) continue;

        // Bỏ qua các ngày tương lai chưa phát sinh chuyến đi
        const dateParts = dateStr.split('/');
        if (dateParts.length === 3) {
            const rowDate = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]));
            const today = new Date();
            today.setHours(23, 59, 59, 999);
            if (rowDate > today) continue;
        }
        
        const vehicleCode = (row[colVehicle] || '').toString().trim();
        let route = '';
        if (colRoute > -1) {
            route = (row[colRoute] || '').toString().trim();
        }
        
        // Ưu tiên chuỗi dài nhất làm Lộ trình (tránh lấy nhầm "Xe 9", "Xe 11")
        const r4 = (row[4] || '').toString().trim();
        const r5 = (row[5] || '').toString().trim();
        const r6 = (row[6] || '').toString().trim();
        const candidates = [route, r5, r4, r6].filter(Boolean);
        candidates.sort((a, b) => b.length - a.length);
        if (candidates.length > 0) {
            route = candidates[0];
        }
        
        // Giờ đi/về: detect vị trí cột tự động
        let hourStart = '', hourEnd = '';
        for (let ci = 7; ci <= 9; ci++) {
            const v = (row[ci] || '').toString();
            if (v.includes(':') && !hourStart) { hourStart = v; continue; }
            if (v.includes(':') && hourStart && !hourEnd) { hourEnd = v; break; }
        }
        
        // Xác định kho/tỉnh — ƯU TIÊN cột Kho/Ghi chú (cols 25-33) trước, route sau
        let khoStr = '';
        for (let ci = 25; ci <= 33; ci++) {
            if (row[ci]) khoStr += ' ' + row[ci].toString().toLowerCase();
        }
        let searchStr = khoStr + ' ' + route.toLowerCase();
        
        // ★ Ưu tiên cột Kho (chính xác hơn route)
        let warehouse = '';
        
        // Check Kho column first (most authoritative)
        warehouse = detectWH(khoStr);
        // Fallback: check route + Kho combined
        if (!warehouse) warehouse = detectWH(searchStr);
        // Fallback: lấy kho từ xe đã inferred (dành cho ngày OFF)
        if (!warehouse && inferredWH) warehouse = inferredWH;
        
        if (!warehouse) continue;
        
        const kmStart = (colKmStart > -1 ? row[colKmStart] : '').toString().trim();
        const kmEnd = (colKmEnd > -1 ? row[colKmEnd] : '').toString().trim();
        const kmDiff = (colKmDiff > -1 ? row[colKmDiff] : '').toString().trim();
        
        // Ghép mã chuyến GHN
        const normPlate = normalizeStr(plate);
        const matchKey = `${normPlate}_${dateStr}`;
          let mCodes = ghnTripMap.get(matchKey); let matchedTripCode = mCodes ? mCodes.join(' | ') : null;
          
          const routeLower = (route || '').toLowerCase();
          const kmStartLower = kmStart.toLowerCase();
          const kmEndLower = kmEnd.toLowerCase();
          const kmDiffLower = kmDiff.toLowerCase();
          
          const isOffStr = (str) => {
              return str === 'off' || str.includes('ncc off') || str.includes('nghỉ') || str === 'nghi';
          };
          
          if (isOffByPlate || isOffStr(routeLower) || routeLower.includes(' off ') || routeLower.startsWith('off ') || isOffStr(kmStartLower) || isOffStr(kmEndLower) || isOffStr(kmDiffLower)) {
              if (routeLower.includes('ghn off')) {
                  matchedTripCode = 'GHN OFF';
              } else {
                  matchedTripCode = 'NCC OFF';
              }
          } else if (!matchedTripCode) {
              if (routeLower.includes('phạt') || routeLower.includes('phat')) {
                  matchedTripCode = 'Phạt';
              }
          }
        const sourceRow = sourceRowsArray ? sourceRowsArray[i] : (i + 1);
        
        let otHours = (colOtHours > -1 ? row[colOtHours] : '').toString().trim();
        let otRate = (colOtRate > -1 ? row[colOtRate] : '').toString().trim();
        let otFee = (colOtFee > -1 ? row[colOtFee] : '').toString().trim();
        let kmOver = (colKmOver > -1 ? row[colKmOver] : '').toString().trim();
        let kmOverFee = (colKmOverFee > -1 ? row[colKmOverFee] : '').toString().trim();
        let monthlyRate = (colMonthlyRate > -1 ? row[colMonthlyRate] : '').toString().trim();
        let dailyRate = (colDailyRate > -1 ? row[colDailyRate] : '').toString().trim();
        let tollFee = (colTollFee > -1 ? row[colTollFee] : '').toString().trim();
        let holidayFee = (colHolidayFee > -1 ? row[colHolidayFee] : '').toString().trim();
        if (actualNcc === 'NAK') {
                // console.log("DEBUG NAK:", { colMonthlyRate, colDailyRate, colTollFee, colHolidayFee, monthlyRate, dailyRate, tollFee, holidayFee });
        }
        let totalCost = (colTotalCost > -1 ? row[colTotalCost] : '').toString().trim();
        if (i === startRow) {
            console.log("==> NCC:", nccName, "Tab:", tabName);
            console.log("colTotalCost:", colTotalCost, "Header text:", colTotalCost > -1 ? rawData[headerRowIdx][colTotalCost] : 'NOT FOUND');
            console.log("Row 0 value for totalCost:", totalCost);
        }

        // 1. Nếu dailyRate rỗng nhưng col 21 chứa Đơn giá ngày (300k - 5M), chuyển sang dailyRate
        const dVal = parseVietnameseNumber(dailyRate);
        const c21Val = parseVietnameseNumber(row[21]);
        if ((dVal === 0 || dVal < 300000) && c21Val > 300000 && c21Val < 5000000) {
            dailyRate = row[21];
            tollFee = (row[22] && row[22] !== row[21]) ? row[22] : '';
        }

        // 2. Nếu dailyRate chứa số tiền tháng (> 5M) và monthlyRate rỗng/bé, đảo lại đúng vị trí
        const mVal = parseVietnameseNumber(monthlyRate);
        const dValCheck = parseVietnameseNumber(dailyRate);
        if (dValCheck > 5000000 && (mVal === 0 || mVal < 2000000)) {
            monthlyRate = dailyRate;
            dailyRate = row[21] || '';
        }

        // 3. Xóa bỏ trùng lặp Phí cầu đường (nếu bằng Đơn giá ngày hoặc Tổng chi phí)
        const tVal = parseVietnameseNumber(tollFee);
        const curDVal = parseVietnameseNumber(dailyRate);
        const totVal = parseVietnameseNumber(totalCost);
        if (tVal > 0 && (tVal === curDVal || (tVal > 300000 && tVal === totVal))) {
            tollFee = '';
        }

        // 4. Lọc bỏ chuỗi thời gian (như 19:00:00) và giá trị zero nhầm làm số giờ tăng ca
        if (otHours && (otHours.includes(':') || otHours === '0' || otHours === '0.00' || otHours === '0,00')) {
            otHours = '';
        }

        // 5. Filters removed

        // 6. Tự động đánh dấu Phạt nếu tổng chi phí âm
        if (!matchedTripCode && totVal < 0) {
            matchedTripCode = 'Phạt';
        }

        const finalKey = `${actualNcc}_${plate}_${dateStr}_${route}`;
        let tripNote = '';
        let isManualMatch = false;
        let actionLogs = [];
        try {
            if (overridesCache[finalKey] !== undefined) {
                matchedTripCode = overridesCache[finalKey];
                if (matchedTripCode && !['GHN OFF', 'NCC OFF', 'OFF', 'Phạt', 'PHẠT', 'GHN_OFF', 'NCC_OFF'].includes(String(matchedTripCode).toUpperCase())) {
                    isManualMatch = true;
                }
            }
            if (notesCache[finalKey] !== undefined) {
                tripNote = notesCache[finalKey];
            }
            try {
                if (logsCache[finalKey]) actionLogs = logsCache[finalKey];
            } catch(e) {}

        } catch(e) {}

        results.push({
            ncc: actualNcc,
            dateStr, plate, vehicleCode, route,
            kmStart, kmEnd, kmDiff, hourStart, hourEnd,
            otHours, otRate, otFee,
            kmOver, kmOverFee, monthlyRate, dailyRate,
            tollFee, holidayFee, totalCost,
            warehouse,
            ghnTripCode: matchedTripCode,
            isManualMatch: isManualMatch,
            note: tripNote,
            actionLogs: actionLogs,
            sheetId: sheetId || '',
            tabName: tabName || '',
            tabGid: tabGid || '',
            sourceRow,
            isAllSheet: (nccName === 'ALL')
        });
    }
    return results;
}
const rawData = [
    [ "", "", "Biển số xe", "Xe", "Lộ trình", "", "Hình thức tính giá" ],
    [ "31", "25/08/2026", "34H-06211", "Xe 161", "Kho GXT Hải Phòng đến...", "1900", "Cost/tháng", "07:00:00", "19:00:00", "0", "35000", "0", "129.03", "43.135", "43.297", "162,00", "0,00", "4.000", "0", "19.642.216 đ", "1.149.749 đ", "20000", "", "20.000 đ", "TP. Hải Dương", "GXT-Miền Bắc", "Kho GXT Hải Dương", "VETC", "Cost/tháng" ]
];
const res = parseNccTabData(rawData, 'Đạo Trường An', new Map(), 'fake_id', 'Đạo Trường An', '2147444878');
console.log(JSON.stringify(res, null, 2));
