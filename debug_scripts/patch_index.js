const fs = require('fs');
let code = fs.readFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'utf8');

// 1. Inject fetching raw archive ODO into empRowsArrays
const searchInject = /fetchSheetByNameJSONP\(CONFIG\.SHEET_MASTER_ID, 'CTV'\)\.catch\(e => \[\]\)\n\s*\]\);/;
const replaceInject = \etchSheetByNameJSONP(CONFIG.SHEET_MASTER_ID, 'CTV').catch(e => [])
                ]);
                
                // ?? B? SUNG: Luôn kéo d? li?u ODO t? Archive (public) phòng h? HTMLView b? CORS
                if (CONFIG.ARCHIVE_SHEET_ID) {
                    try {
                        const gid1 = CONFIG.ARCHIVE_GIDS['odo_data'];
                        const gid2 = CONFIG.ARCHIVE_GIDS['odo_data_2'];
                        if (gid1) empRowsArrays.push(await fetchSheetJSONP(CONFIG.ARCHIVE_SHEET_ID, gid1));
                        if (gid2) empRowsArrays.push(await fetchSheetJSONP(CONFIG.ARCHIVE_SHEET_ID, gid2));
                    } catch(e) { console.warn('L?i b? sung archive:', e); }
                }\;
code = code.replace(searchInject, replaceInject);

// 2. Remove old archivedOdo fetches
const searchOldFetch = /const archivedOdo1[\s\S]*?const newOdoToArchive = \[\];/;
const replaceOldFetch = "const dedupeSet = new Set();";
code = code.replace(searchOldFetch, replaceOldFetch);

// 3. Replace push logic with dedupe
const searchPush = /\/\/ Luôn luu d? li?u dã làm ODO[\s\S]*?newOdoToArchive\.push\(archiveEntry\);\n\s*\}/;
const replacePush = \// Luôn luu d? li?u dã làm ODO
            if (!dedupeSet.has(entry.id)) {
                dedupeSet.add(entry.id);
                employeeData.push(entry);
            }\;
code = code.replace(searchPush, replacePush);

// 4. Remove old archive append logic
const searchOldAppend = /\/\/ ?? B? sung d? li?u cu t? archive[\s\S]*?saveToArchive\('odo_data', newOdoToArchive\);/;
const replaceOldAppend = "";
code = code.replace(searchOldAppend, replaceOldAppend);

fs.writeFileSync('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', code, 'utf8');
console.log("Patch done!");
