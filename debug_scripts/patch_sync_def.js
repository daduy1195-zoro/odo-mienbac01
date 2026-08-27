const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const syncCode = `// ====== ĐỒNG BỘ CLOUD ======
const SYNC_API_URL = 'https://script.google.com/macros/s/AKfycbwJr2pgITDURfuT_H3zGUYXUEC2SzvM0V_JNSFPqLwexGLElVlGPSpzPXMXpmE4R25e4g/exec';

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

async function loadAllData() {`;
code = code.replace(/async function loadAllData\(\) \{/g, syncCode);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Sync defs patched.');
