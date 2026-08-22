# -*- coding: utf-8 -*-
with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf-8') as f:
    code = f.read()

import re

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

# re.sub with replacement that looks like a raw string but actually re.sub interprets \1 as group etc.
# to avoid re.sub interpreting backslashes, we use a lambda
code = re.sub(search_block, lambda m: replace_block, code, flags=re.DOTALL)

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf-8') as f:
    f.write(code)

print("Done part 3")
