import re

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Fetch from Archive inside Fallback 3, NO, we want to fetch it before Fallback 3, 
# or just inject it directly into empRowsArrays.
# Let's inject it into empRowsArrays after the direct fetch!

search_inject = r"fetchSheetByNameJSONP\(CONFIG\.SHEET_MASTER_ID, 'CTV'\)\.catch\(e => \[\]\)\s*\]\);"
replace_inject = """fetchSheetByNameJSONP(CONFIG.SHEET_MASTER_ID, 'CTV').catch(e => [])
                ]);
                
                // ?? B? SUNG: Luôn kéo d? li?u ODO t? Archive (public) phòng h? HTMLView b? CORS
                if (CONFIG.ARCHIVE_SHEET_ID) {
                    try {
                        const gid1 = CONFIG.ARCHIVE_GIDS['odo_data'];
                        const gid2 = CONFIG.ARCHIVE_GIDS['odo_data_2'];
                        if (gid1) empRowsArrays.push(await fetchSheetJSONP(CONFIG.ARCHIVE_SHEET_ID, gid1));
                        if (gid2) empRowsArrays.push(await fetchSheetJSONP(CONFIG.ARCHIVE_SHEET_ID, gid2));
                    } catch(e) { console.warn('L?i b? sung archive:', e); }
                }"""

code = re.sub(search_inject, replace_inject, code, flags=re.DOTALL)

# 2. Remove the old archivedOdo fetches
search_old_fetch = r"const archivedOdo1 = await fetchArchivedData\('odo_data'\);.*?const newOdoToArchive = \[\];"
replace_old_fetch = "const dedupeSet = new Set();"
code = re.sub(search_old_fetch, replace_old_fetch, code, flags=re.DOTALL)

# 3. Add dedupeSet initialization
search_empData = r"employeeData = \[\]; // ?? B?t d?u t? r?ng, uu tiên d? li?u fresh t? Google Sheet"
replace_empData = "employeeData = [];"
code = re.sub(search_empData, replace_empData, code)

# 4. Replace employeeData.push(entry) with dedupe logic
# Notice we match the exact block to avoid mistakes
search_push = r"// Luôn luu d? li?u dã làm ODO \(k? c? chua t? d?ng ghép du?c mã NV\)\s*employeeData\.push\(entry\);\s*if \(!archivedOdoMap\.has\(entry\.id\)\) \{\s*const archiveEntry = \{ \.\.\.entry \};\s*delete archiveEntry\.dateObj;\s*newOdoToArchive\.push\(archiveEntry\);\s*\}"
replace_push = """// Luôn luu d? li?u dã làm ODO
            if (!dedupeSet.has(entry.id)) {
                dedupeSet.add(entry.id);
                employeeData.push(entry);
            }"""
code = re.sub(search_push, replace_push, code)

# 5. Remove the old archive append logic
search_old_append = r"// ?? B? sung d? li?u cu t? archive \(ch? nh?ng ngày KHÔNG có trong fresh data\).*?if \(newOdoToArchive\.length > 0\) saveToArchive\('odo_data', newOdoToArchive\);"
replace_old_append = ""
code = re.sub(search_old_append, replace_old_append, code, flags=re.DOTALL)

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf-8') as f:
    f.write(code)

print("Patch done!")
