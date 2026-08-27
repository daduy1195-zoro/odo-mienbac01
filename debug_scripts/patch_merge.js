const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const loadCloudPatch = `async function loadCloudData() {
    if (!SYNC_API_URL) return;
    try {
        const res = await fetch(SYNC_API_URL);
        const json = await res.json();
        if (json.status === 'success' && json.data) {
            const localOverrides = JSON.parse(localStorage.getItem('GHN_NCC_TRIP_OVERRIDES') || '{}');
            const localNotes = JSON.parse(localStorage.getItem('GHN_NCC_TRIP_NOTES') || '{}');
            const localLogs = JSON.parse(localStorage.getItem('GHN_ACTION_LOGS') || '{}');
            
            const cloudOverrides = json.data.overrides || {};
            const cloudNotes = json.data.notes || {};
            const cloudLogs = json.data.logs || {};

            const allLocalKeys = new Set([...Object.keys(localOverrides), ...Object.keys(localNotes)]);
            for (let key of allLocalKeys) {
                const lCode = localOverrides[key];
                const cCode = cloudOverrides[key];
                const lNote = localNotes[key];
                const cNote = cloudNotes[key];
                
                if ((lCode && !cCode) || (lNote && !cNote)) {
                    syncToCloud(key, lCode, lNote, localLogs[key]);
                }
            }

            const mergedOverrides = { ...localOverrides, ...cloudOverrides };
            const mergedNotes = { ...localNotes, ...cloudNotes };
            const mergedLogs = { ...localLogs, ...cloudLogs };

            localStorage.setItem('GHN_NCC_TRIP_OVERRIDES', JSON.stringify(mergedOverrides));
            localStorage.setItem('GHN_NCC_TRIP_NOTES', JSON.stringify(mergedNotes));
            localStorage.setItem('GHN_ACTION_LOGS', JSON.stringify(mergedLogs));
            console.log('✅ Đã tải và hợp nhất dữ liệu đồng bộ từ Cloud thành công!');
        }
    } catch(e) {
        console.error('Lỗi tải dữ liệu cloud:', e);
    }
}`;

code = code.replace(/async function loadCloudData\(\) \{[\s\S]*?console\.error\('Lỗi tải dữ liệu cloud:', e\);\r?\n    \}\r?\n\}/, loadCloudPatch);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Merge patched.');
