import re

with open('C:/Users/MSI/Desktop/AI/Odo/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

search = """        for (const sheet of CONFIG.NCC_TRIP_SHEETS) {
            try {
                // ★ Bước 1: Lấy danh sách tên tab + GID"""

replace = """        for (const sheet of CONFIG.NCC_TRIP_SHEETS) {
            try {
                if (sheet.ncc === 'ALL') {
                    console.log(`⏩ Bỏ qua lấy tab name cho ALL sheet, tải trực tiếp bằng GID`);
                    const rawData = await fetchSheetJSONP(sheet.id, sheet.gid);
                    const parsed = parseNccTabData(rawData, sheet.ncc, ghnTripMap, sheet.id, '', sheet.gid);
                    const normalizeStr = s => s ? String(s).trim().toLowerCase().replace(/[-\\s\\.]/g, '') : '';
                    parsed.forEach(record => {
                        const normPlate = normalizeStr(record.plate);
                        const existingIdx = allNccData.findIndex(r => {
                            if (r.dateStr !== record.dateStr) return false;
                            if (r.ncc !== record.ncc) return false;
                            const rTab = normalizeStr(r.tabName);
                            const normTab = normalizeStr(record.tabName);
                            if (normTab && rTab && (normTab === rTab || normTab.includes(rTab) || rTab.includes(normTab))) return true;
                            if (normalizeStr(r.plate) === normPlate) return true;
                            return false;
                        });
                        if (existingIdx !== -1) {
                            allNccData[existingIdx] = record;
                        } else {
                            allNccData.push(record);
                        }
                    });
                    totalTabs++;
                    totalRows += parsed.length;
                    continue;
                }

                // ★ Bước 1: Lấy danh sách tên tab + GID"""

if search in content:
    content = content.replace(search, replace)
    print("Patched!")
else:
    print("Not found! Searching with regex...")
    match = re.search(r'for\s*\(const\s*sheet\s*of\s*CONFIG\.NCC_TRIP_SHEETS\)\s*\{\s*try\s*\{\s*//\s*★\s*Bước 1: Lấy danh sách tên tab \+ GID', content)
    if match:
        content = content[:match.start()] + replace.strip() + content[match.end():]
        print("Patched with regex!")
    else:
        print("Still not found!")

with open('C:/Users/MSI/Desktop/AI/Odo/index.html', 'w', encoding='utf-8') as f:
    f.write(content)
