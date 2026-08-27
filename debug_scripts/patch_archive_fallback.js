const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8').replace(/\r\n/g, '\n');

const search1 = `                // BỔ SUNG: Luôn kéo dữ liệu ODO từ Archive (public) phòng hờ HTMLView bị CORS
                if (CONFIG.ARCHIVE_SHEET_ID) {
                    try {
                        const gid1 = CONFIG.ARCHIVE_GIDS['odo_data'];
                        const gid2 = CONFIG.ARCHIVE_GIDS['odo_data_2'];
                        if (gid1) {
                            const r1 = await fetchSheetJSONP(CONFIG.ARCHIVE_SHEET_ID, gid1);
                            r1.forEach((r, idx) => { if(r) { r._gid = (r[r.length-2] || '').toString(); r._sheetRow = parseInt(r[r.length-1]) || (idx+2); } });
                            empRowsArrays.push(r1);
                        }
                        if (gid2) {
                            const r2 = await fetchSheetJSONP(CONFIG.ARCHIVE_SHEET_ID, gid2);
                            r2.forEach((r, idx) => { if(r) { r._gid = (r[r.length-2] || '').toString(); r._sheetRow = parseInt(r[r.length-1]) || (idx+2); } });
                            empRowsArrays.push(r2);
                        }
                    } catch(e) { console.warn('Lỗi bổ sung archive:', e); }
                }`;

const replace1 = `                // BỔ SUNG: Luôn kéo dữ liệu ODO từ Archive (public) phòng hờ HTMLView bị CORS
                if (CONFIG.ARCHIVE_SHEET_ID) {
                    try {
                        const archTabs = await getSheetTabNames(CONFIG.ARCHIVE_SHEET_ID);
                        const odoTabs = archTabs.filter(t => t.name.startsWith('odo_data'));
                        for (const tab of odoTabs) {
                            const r = await fetchSheetJSONP(CONFIG.ARCHIVE_SHEET_ID, tab.gid);
                            if (r && r.length > 0) {
                                r.forEach((row, idx) => { if(row) { row._gid = (row[row.length-2] || '').toString(); row._sheetRow = parseInt(row[row.length-1]) || (idx+2); } });
                                empRowsArrays.push(r);
                            }
                        }
                    } catch(e) { console.warn('Lỗi bổ sung archive:', e); }
                }`;

if (code.includes(search1)) {
    code = code.replace(search1, replace1);
    console.log("Replaced 1");
} else { console.log("Failed 1"); }

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
