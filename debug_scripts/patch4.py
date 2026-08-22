# -*- coding: utf-8 -*-
import re

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Inject fetching raw archive ODO into empRowsArrays
search_inject = r"fetchSheetByNameJSONP\(CONFIG\.SHEET_MASTER_ID, 'CTV'\)\.catch\(e => \[\]\)\s*\]\);"
replace_inject = """fetchSheetByNameJSONP(CONFIG.SHEET_MASTER_ID, 'CTV').catch(e => [])
                ]);

                // BỔ SUNG: Luôn kéo dữ liệu ODO từ Archive (public) phòng hờ HTMLView bị CORS
                if (CONFIG.ARCHIVE_SHEET_ID) {
                    try {
                        const gid1 = CONFIG.ARCHIVE_GIDS['odo_data'];
                        const gid2 = CONFIG.ARCHIVE_GIDS['odo_data_2'];
                        if (gid1) empRowsArrays.push(await fetchSheetJSONP(CONFIG.ARCHIVE_SHEET_ID, gid1));
                        if (gid2) empRowsArrays.push(await fetchSheetJSONP(CONFIG.ARCHIVE_SHEET_ID, gid2));
                    } catch(e) { console.warn('Lỗi bổ sung archive:', e); }
                }"""
code = re.sub(search_inject, replace_inject, code, flags=re.DOTALL)

# 2. Remove old archivedOdo fetches
search_old_fetch = r"const archivedOdo1[\s\S]*?const newOdoToArchive = \[\];"
replace_old_fetch = "const dedupeSet = new Set();"
code = re.sub(search_old_fetch, replace_old_fetch, code)

# 3. Replace push logic with dedupe
search_push = r"// Luôn lưu dữ liệu đã làm ODO \([\s\S]*?saveToArchive\('odo_data', newOdoToArchive\);"
replace_push = """// Luôn lưu dữ liệu đã làm ODO
            if (!dedupeSet.has(entry.id)) {
                dedupeSet.add(entry.id);
                employeeData.push(entry);
            }
        }"""
code = re.sub(search_push, replace_push, code)

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf-8') as f:
    f.write(code)

print("Success")
