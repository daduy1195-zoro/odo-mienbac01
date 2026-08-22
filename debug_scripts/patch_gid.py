# -*- coding: utf-8 -*-
import re

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf-8') as f:
    code = f.read()

search_inject = r"if \(gid1\) empRowsArrays\.push\(await fetchSheetJSONP\(CONFIG\.ARCHIVE_SHEET_ID, gid1\)\);\s*if \(gid2\) empRowsArrays\.push\(await fetchSheetJSONP\(CONFIG\.ARCHIVE_SHEET_ID, gid2\)\);"

replace_inject = """if (gid1) {
                            const r1 = await fetchSheetJSONP(CONFIG.ARCHIVE_SHEET_ID, gid1);
                            r1.forEach((r, idx) => { if(r) { r._gid = (r[r.length-2] || '').toString(); r._sheetRow = parseInt(r[r.length-1]) || (idx+2); } });
                            empRowsArrays.push(r1);
                        }
                        if (gid2) {
                            const r2 = await fetchSheetJSONP(CONFIG.ARCHIVE_SHEET_ID, gid2);
                            r2.forEach((r, idx) => { if(r) { r._gid = (r[r.length-2] || '').toString(); r._sheetRow = parseInt(r[r.length-1]) || (idx+2); } });
                            empRowsArrays.push(r2);
                        }"""

code = re.sub(search_inject, replace_inject, code)

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf-8') as f:
    f.write(code)

print("Gid patched")
