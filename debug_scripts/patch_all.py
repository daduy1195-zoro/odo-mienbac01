# -*- coding: utf-8 -*-
with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf-8') as f:
    code = f.read()

import re

# 1. Update NCC_TRIP_SHEETS to include the new sheet for 26/06 - 25/07
search_ncc_trip_sheets = r"NCC_TRIP_SHEETS:\s*\["
replace_ncc_trip_sheets = "NCC_TRIP_SHEETS: [\n        { id: '1jFaJutdZD8uhBYa9Hy9fH6tHVaSnEf-iyg4VUMniXl8', gid: '1482895796', ncc: 'ALL' },"
code = re.sub(search_ncc_trip_sheets, replace_ncc_trip_sheets, code, count=1)

# 2. Update normalizeSupplierName
search_norm_supplier = r"if \(standardNames\[noTones\]\) return standardNames\[noTones\];"
replace_norm_supplier = "for (const key in standardNames) { if (noTones.includes(key)) return standardNames[key]; }\n    if (standardNames[noTones]) return standardNames[noTones];"
code = re.sub(search_norm_supplier, replace_norm_supplier, code)

# 3. Update parseNccTabData to find colDate, colPlate, colVehicle, colNcc
search_cols = r"let colOtHours = -1, colOtRate = -1, colOtFee = -1, colKmOverFee = -1"
replace_cols = "let colKmStart = -1, colKmEnd = -1, colKmDiff = -1, colRoute = -1, colDate = 1, colPlate = 2, colVehicle = 3, colNcc = -1;\n    let colOtHours = -1, colOtRate = -1, colOtFee = -1, colKmOver = -1, colKmOverFee = -1"
code = re.sub(r"let colKmStart = -1, colKmEnd = -1, colKmDiff = -1, colRoute = -1;\s*let colOtHours = -1, colOtRate = -1, colOtFee = -1, colKmOverFee = -1", replace_cols, code)


search_hdr_scan = "if (h === 'lộ trình' || h === 'tuyến đường' || h.includes('điểm giao') || h === 'tuyến') colRoute = ci;"
replace_hdr_scan = "if (h === 'lộ trình' || h === 'tuyến đường' || h.includes('điểm giao') || h === 'tuyến') colRoute = ci;\n                if (h.includes('ngày') && h.includes('thực hiện')) colDate = ci;\n                if (h.includes('biển số')) colPlate = ci;\n                if (h === 'xe' || h.includes('loại xe')) colVehicle = ci;\n                if (h === 'chi' || h.includes('nhà cung cấp') || h === 'ncc') colNcc = ci;\n                if (h.includes('số km phát sinh tăng') || h.includes('km phát sinh tăng')) colKmOver = ci;"
code = code.replace(search_hdr_scan, replace_hdr_scan)

# Update row processing
search_row_vars = r"const stt = \(row\[0\] \|\| ''\)\.toString\(\)\.trim\(\);\n\s*const dateStr = \(row\[1\] \|\| ''\)\.toString\(\)\.trim\(\);\n\s*let plate = \(row\[2\] \|\| ''\)\.toString\(\)\.trim\(\);"
replace_row_vars = "const stt = (row[0] || '').toString().trim();\n        const dateStr = (row[colDate] || '').toString().trim();\n        let plate = (row[colPlate] || '').toString().trim();\n        let actualNcc = nccName;\n        if (colNcc > -1 && row[colNcc]) actualNcc = normalizeSupplierName(row[colNcc].toString().trim());\n        else actualNcc = normalizeSupplierName(nccName);"
code = re.sub(search_row_vars, replace_row_vars, code)

# Update vehicleCode
search_vehicle = r"const vehicleCode = \(row\[3\] \|\| ''\)\.toString\(\)\.trim\(\);"
replace_vehicle = "const vehicleCode = (row[colVehicle] || '').toString().trim();"
code = re.sub(search_vehicle, replace_vehicle, code)

# Update kmOver extract
search_extract = r"let kmOverFee = \(colKmOverFee > -1 \? row\[colKmOverFee\] : ''\)\.toString\(\)\.trim\(\);"
replace_extract = "let kmOver = (colKmOver > -1 ? row[colKmOver] : '').toString().trim();\n        " + search_extract
code = re.sub(search_extract, replace_extract, code)

# Update push obj
search_push_ncc = r"ncc: nccName,\n\s*dateStr, plate, vehicleCode, route,\n\s*kmStart, kmEnd, kmDiff, hourStart, hourEnd,\n\s*otHours, otRate, otFee,\n\s*kmOverFee, monthlyRate, dailyRate,"
replace_push_ncc = "ncc: actualNcc,\n            dateStr, plate, vehicleCode, route,\n            kmStart, kmEnd, kmDiff, hourStart, hourEnd,\n            otHours, otRate, otFee,\n            kmOver, kmOverFee, monthlyRate, dailyRate,"
code = re.sub(search_push_ncc, replace_push_ncc, code)

# Finally, rewrite loadNccData
search_block = r"async function loadNccData\(\) \{.*?(?=function renderNcc)"
replace_block = r"""async function loadNccData() {
    const month = document.getElementById('filterMonth').value;
    const filterSelect = document.getElementById('filterWarehouse');
    const filterWarehouse = filterSelect ? filterSelect.value : '';
    const container = document.getElementById('nccTableContainer');
    
    if(!container) return;
    
    if (typeof nccTripData === 'undefined' || nccTripData.length === 0) {
        container.innerHTML = <div class="empty-state"><div class="icon">📫</div><p>Chưa có dữ liệu chuyến đi NCC cho kỳ này</p></div>;
        document.getElementById('nccTotalCost').innerText = '0 đ';
        return;
    }
    
    let pivotData = {};
    let hasData = false;
    
    nccTripData.forEach(r => {
        const parts = String(r.dateStr || '').split('/');
        if (parts.length === 3) {
            const rowDateObj = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
            if (month && typeof isInCycle === 'function' && !isInCycle(rowDateObj, month)) return;
        } else if (month) {
            return;
        }
        
        let kho = String(r.warehouse || '').trim();
        const bienSo = String(r.plate || '').trim();
        if(!kho || !bienSo) return;
        
        const shortWH = shortWarehouse(kho);
        if(filterWarehouse && shortWH !== filterWarehouse && filterWarehouse !== '') return;
        
        let khoGroup = kho;
        const khoUpper = khoGroup.toUpperCase();
        if(khoUpper.includes('HẢI DƯƠNG') || khoUpper.includes('HAI DUONG')) khoGroup = 'Kho GXT Hải Dương';
        else if(khoUpper.includes('HẢI PHÒNG') || khoUpper.includes('HAI PHONG')) khoGroup = 'Kho GXT Hải Phòng';
        else if(khoUpper.includes('HƯNG YÊN') || khoUpper.includes('MIỀN BẮC') || khoUpper.includes('MIEN BAC')) khoGroup = 'Kho GXT Hưng Yên';
        else if(khoUpper.includes('THÁI BÌNH') || khoUpper.includes('THAI BINH')) khoGroup = 'Kho GXT Thái Bình';
        
        if(!pivotData[khoGroup]) pivotData[khoGroup] = {};
        if(!pivotData[khoGroup][bienSo]) {
            pivotData[khoGroup][bienSo] = {
                chiPhi: 0, kmPhatSinh: 0, phiVuotKm: 0, 
                thoiGianTangCa: 0, phiTangCa: 0, phiCauDuong: 0
            };
        }
        
        pivotData[khoGroup][bienSo].chiPhi += Number(String(r.totalCost || '0').replace(/[^\d\.-]/g, ''));
        pivotData[khoGroup][bienSo].kmPhatSinh += Number(String(r.kmOver || '0').replace(/[^\d\.-]/g, ''));
        pivotData[khoGroup][bienSo].phiVuotKm += Number(String(r.kmOverFee || '0').replace(/[^\d\.-]/g, ''));
        pivotData[khoGroup][bienSo].thoiGianTangCa += Number(String(r.otHours || '0').replace(/[^\d\.-]/g, ''));
        pivotData[khoGroup][bienSo].phiTangCa += Number(String(r.otFee || '0').replace(/[^\d\.-]/g, ''));
        pivotData[khoGroup][bienSo].phiCauDuong += Number(String(r.tollFee || '0').replace(/[^\d\.-]/g, ''));
        
        hasData = true;
    });
    
    if (!hasData) {
        container.innerHTML = <div class="empty-state"><div class="icon">📫</div><p>Chưa có dữ liệu chi phí xe NCC cho kỳ này</p></div>;
        document.getElementById('nccTotalCost').innerText = '0 đ';
        return;
    }
    
    renderNcc(pivotData);
}

"""
code = re.sub(search_block, lambda m: replace_block, code, flags=re.DOTALL)

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf-8') as f:
    f.write(code)

print("Done all")
