const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Fix fetchSheetJSONP empty gid
html = html.replace(
    /script\.src = `https:\/\/docs\.google\.com\/spreadsheets\/d\/\$\{sheetId\}\/gviz\/tq\?tqx=responseHandler:\$\{callbackName\};reqId:\$\{Date\.now\(\)\}&gid=\$\{gid\}&range=A1:AH&headers=\$\{headersCount\}&_cb=\$\{Date\.now\(\)\}`;/g,
    "let url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=responseHandler:${callbackName};reqId:${Date.now()}&range=A1:AH&headers=${headersCount}&_cb=${Date.now()}`; if (gid !== undefined && gid !== '') url += `&gid=${gid}`; script.src = url;"
);

// 2. Add toast
html = html.replace(
    /\} catch\(e\) \{\s*console\.warn\(`⚠️ Lỗi tải \$\{sheet\.ncc\} \(\$\{sheet\.id\}\):`, e\.message\);\s*\}/g,
    "} catch(e) { console.warn(`⚠️ Lỗi tải ${sheet.ncc} (${sheet.id}):`, e.message); if (sheet.ncc === 'ALL') showToast('⚠️', 'Lỗi tải file tổng hợp (ALL): ' + e.message); }"
);

// 3. Add debug text to first empty state
html = html.replace(
    /if \(filtered\.length === 0\) \{\s*container\.innerHTML = '<div class="empty-state"><div class="icon">🔍<\/div><p>Không có dữ liệu cho lọc này\.<\/p><\/div>';\s*return;\s*\}/g,
    "if (filtered.length === 0) { container.innerHTML = `<div class=\"empty-state\"><div class=\"icon\">🔍</div><p>Không có dữ liệu cho lọc này.</p><p style=\"color:var(--text-muted);font-size:12px;margin-top:5px\">Tổng dữ liệu nccTripData (trước lọc): ${nccTripData.length} chuyến</p></div>`; return; }"
);

fs.writeFileSync('index.html', html);
console.log('Applied fixes');
