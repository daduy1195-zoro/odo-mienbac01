import re

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf8') as f:
    content = f.read()

search = """            empRowsArrays.forEach(sheetRows => {
                sheetRows.forEach((r, idx) => {
                    if (!r || r.length < 5) return;
                    
                    const nameRaw = r[1];
                    const plateRaw = r[2];
                    if (!nameRaw || !plateRaw) return;
                    
                    const normPlate = String(plateRaw).trim().toUpperCase().replace(/[\s\-\.]/g, '');
                    const name = normalizeTone(nameRaw.normalize('NFC').toUpperCase());
                    const area = (r[3] || '').trim();
                    const rawDate = (r[4] || '').trim();
                    const dateStr = normalizeToDDMMYYYY(rawDate);
                    const supplier = normalizeSupplierName(r[5]);
                    const kmStart = (r[7] || '').trim();
                    const kmEnd = (r[12] || '').trim();
                    const hourStart = (r[8] || '').trim();
                    const hourEnd = (r[13] || '').trim();

                    const gid = r._gid || CONFIG.SHEET_EMPLOYEE_GIDS[0];"""

replace = """            empRowsArrays.forEach(sheetRows => {
                sheetRows.forEach((r, idx) => {
                    if (!r || r.length < 5) return;
                    
                    const nameRaw = r[1];
                    const plateRaw = r[2];
                    if (!nameRaw || !plateRaw) return;
                    
                    const normPlate = String(plateRaw).trim().toUpperCase().replace(/[\s\-\.]/g, '');
                    const name = normalizeTone(nameRaw.normalize('NFC').toUpperCase());
                    const area = (r[3] || '').trim();
                    const rawDate = (r[4] || '').trim();
                    const dateStr = normalizeToDDMMYYYY(rawDate);
                    const supplier = normalizeSupplierName(r[5]);
                    const kmStart = (r[7] || '').trim();
                    const kmEnd = (r[12] || '').trim();
                    const hourStart = (r[8] || '').trim();
                    const hourEnd = (r[13] || '').trim();
                    
                    // Tự động tìm link ảnh ODO (vì cột có thể dịch chuyển)
                    let imgLinks = [];
                    r.forEach(col => {
                        const s = String(col).trim();
                        if (s.startsWith('http')) {
                            const links = s.split(/[\\s,;]+/).filter(l => l.startsWith('http'));
                            imgLinks.push(...links);
                        }
                    });
                    const imgStart = imgLinks[0] || '';
                    const imgEnd = imgLinks[1] || '';

                    const gid = r._gid || CONFIG.SHEET_EMPLOYEE_GIDS[0];"""

if search in content:
    content = content.replace(search, replace)
    
    # Now replace the entry object
    search2 = """                    const entry = {
                        id: `${dateStr}_${code || name}_${normPlate}`, // Khóa chống trùng lặp
                        name, code, area, dateStr, dateObj, plate, supplier, warehouse, shortWH,
                        kmStart, kmEnd, hourStart, hourEnd, matchKey, jsMatchKey, fullName, sheetRow, gid
                    };"""
    
    replace2 = """                    const entry = {
                        id: `${dateStr}_${code || name}_${normPlate}`, // Khóa chống trùng lặp
                        name, code, area, dateStr, dateObj, plate, supplier, warehouse, shortWH,
                        kmStart, kmEnd, hourStart, hourEnd, imgStart, imgEnd, matchKey, jsMatchKey, fullName, sheetRow, gid
                    };"""
    
    if search2 in content:
        content = content.replace(search2, replace2)
        with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf8') as f:
            f.write(content)
        print("Patched image parsing successfully!")
    else:
        print("search2 not found")
else:
    print("search1 not found")
