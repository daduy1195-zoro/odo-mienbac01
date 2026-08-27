const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const syncCode = `// ====== ĐỒNG BỘ CLOUD ======
const SYNC_API_URL = ''; // Sẽ điền sau khi có link Web App

async function syncToCloud(key, overrides, note, logs) {
    if (!SYNC_API_URL) return;
    try {
        const payload = { key: key };
        if (overrides !== undefined) payload.code = overrides;
        if (note !== undefined) payload.note = note;
        if (logs !== undefined) payload.logs = logs;

        fetch(SYNC_API_URL, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'text/plain;charset=utf-8' }
        }).catch(e => console.error('Lỗi đồng bộ cloud:', e));
    } catch(e) {}
}

async function loadCloudData() {
    if (!SYNC_API_URL) return;
    try {
        const res = await fetch(SYNC_API_URL);
        const json = await res.json();
        if (json.status === 'success' && json.data) {
            localStorage.setItem('GHN_NCC_TRIP_OVERRIDES', JSON.stringify(json.data.overrides || {}));
            localStorage.setItem('GHN_NCC_TRIP_NOTES', JSON.stringify(json.data.notes || {}));
            localStorage.setItem('GHN_ACTION_LOGS', JSON.stringify(json.data.logs || {}));
            console.log('✅ Đã tải dữ liệu đồng bộ từ Cloud thành công!');
        }
    } catch(e) {
        console.error('Lỗi tải dữ liệu cloud:', e);
    }
}

// ====== DATA GLOBALS ======`;
code = code.replace(/\/\/ ====== DATA GLOBALS ======/g, syncCode);

code = code.replace(
    /        let empRowsArrays, supRows, masterRowsGH, masterRowsPH, ctvRows;/g,
    "        await loadCloudData();\n        let empRowsArrays, supRows, masterRowsGH, masterRowsPH, ctvRows;"
);

const updateCodePatch = `            localStorage.setItem('GHN_NCC_TRIP_OVERRIDES', JSON.stringify(overrides));
            saveActionLog(key, 'Chốt mã chuyến', value || 'Xóa mã');
            if (nccTripData[index]) {
                if (!nccTripData[index].actionLogs) nccTripData[index].actionLogs = [];
                nccTripData[index].actionLogs.push({ time: new Date().toLocaleString('vi-VN'), action: 'Chốt mã chuyến', details: value || 'Xóa mã' });
            }
            syncToCloud(key, value, undefined, nccTripData[index]?.actionLogs);
        } catch(e) {}`;
code = code.replace(/            localStorage\.setItem\('GHN_NCC_TRIP_OVERRIDES', JSON\.stringify\(overrides\)\);\r?\n            saveActionLog\(key, 'Chốt mã chuyến', value \|\| 'Xóa mã'\);\r?\n            if \(nccTripData\[index\]\) \{\r?\n                if \(\!nccTripData\[index\]\.actionLogs\) nccTripData\[index\]\.actionLogs = \[\];\r?\n                nccTripData\[index\]\.actionLogs\.push\(\{ time: new Date\(\)\.toLocaleString\('vi-VN'\), action: 'Chốt mã chuyến', details: value \|\| 'Xóa mã' \}\);\r?\n            \}\r?\n        \} catch\(e\) \{\}/g, updateCodePatch);

const updateNotePatch = `            localStorage.setItem("GHN_NCC_TRIP_NOTES", JSON.stringify(notes));
            saveActionLog(key, 'Sửa ghi chú', value || 'Xóa ghi chú');
            if (nccTripData[index]) {
                if (!nccTripData[index].actionLogs) nccTripData[index].actionLogs = [];
                nccTripData[index].actionLogs.push({ time: new Date().toLocaleString('vi-VN'), action: 'Sửa ghi chú', details: value || 'Xóa ghi chú' });
            }
            syncToCloud(key, undefined, value, nccTripData[index]?.actionLogs);
        } catch(e) {}`;
code = code.replace(/            localStorage\.setItem\("GHN_NCC_TRIP_NOTES", JSON\.stringify\(notes\)\);\r?\n            saveActionLog\(key, 'Sửa ghi chú', value \|\| 'Xóa ghi chú'\);\r?\n            if \(nccTripData\[index\]\) \{\r?\n                if \(\!nccTripData\[index\]\.actionLogs\) nccTripData\[index\]\.actionLogs = \[\];\r?\n                nccTripData\[index\]\.actionLogs\.push\(\{ time: new Date\(\)\.toLocaleString\('vi-VN'\), action: 'Sửa ghi chú', details: value \|\| 'Xóa ghi chú' \}\);\r?\n            \}\r?\n        \} catch\(e\) \{\}/g, updateNotePatch);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Sync patched.');
