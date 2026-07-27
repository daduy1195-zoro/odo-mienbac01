
/* ==============================================
   JAVASCRIPT - PHẦN XỬ LÝ DỮ LIỆU
   
   CHÚ THÍCH CHO NGƯỜI KHÔNG BIẾT CODE:
   - Phần này tự động chạy, bạn KHÔNG cần chỉnh sửa
   - Nếu link Google Sheet thay đổi, chỉ cần sửa phần CONFIG bên dưới
   ============================================== */

// ====== CẤU HÌNH (Config) ======
const CONFIG = {
    // Link Google Sheet dữ liệu nhân viên điền ODO
    SHEET_EMPLOYEE_ID: '1vI_rzcjX6F12SOm06QvEo9W2s5kiDjYcRtvm2kWuCXo',
    SHEET_EMPLOYEE_GID: '409459817',

    // Link Google Sheet đối soát nhà cung cấp xe
    SHEET_SUPPLIER_ID: '14zXhTqxD7VsN_PE3OxNY7hLss8zxG4zUNT_cNN9QV90',
    SHEET_SUPPLIER_GID: '0',

    // Link Google Sheet danh sách NV chuẩn (master list)
    SHEET_MASTER_ID: '1RMe38TNV-EoIAradnynYmk8mt7l9pNWqJELM9O84Wxc',
    SHEET_MASTER_GID: '1254809645',

    // Telegram Proxy (token ẩn trên server Google Apps Script)
    TELEGRAM_PROXY_URL: 'https://script.google.com/macros/s/AKfycbxpf65_UM-GJL9dtt_HhGj4YJoygjPIQip9-TNxiWkRwVzdAIAMZIDLBbOnRgJ8cNgHWg/exec',

    // Tự động refresh mỗi 30 phút (đơn vị: miligiây)
    REFRESH_INTERVAL: 30 * 60 * 1000,
};
Object.freeze(CONFIG);

// ====== 4 KHO ANH QUẢN LÝ ======
// Bảng đối chiếu tên kho: tên dài (NV điền) ↔ tên ngắn (file NCC)
const MY_WAREHOUSES = {
    'Hải Dương': ['Kho Giao Hàng Nặng Hải Dương', 'Kho GXT Hải Dương'],
    'Hải Phòng': ['Kho Giao Hàng Nặng Hải Phòng', 'Kho GXT Hải Phòng'],
    'Hưng Yên':  ['Kho Giao Hàng Nặng Hưng Yên',  'Kho GXT Hưng Yên',
                  'Kho Giao Hàng Nặng Miền Bắc',   'Kho GXT Miền Bắc',
                  'Kho Giao Hàng Nặng Miền Bắng',  'Kho GXT Miền Bắng'],
    'Thái Bình': ['Kho Giao Hàng Nặng Thái Bình',  'Kho GXT Thái Bình'],
};

const TELEGRAM_GROUPS = {
    'Hải Dương': { chatId: '-1003955414942', tag: '@Messi_haiduong' },
    'Hải Phòng': { chatId: '-1003838432995', tag: '@Tuan210593' },
    'Hưng Yên':  { chatId: '-1003915590818', tag: '@NguyenHue_3101082' },
    'Thái Bình': { chatId: '-1003927320437', tag: '@oanh1505' },
};

// Hàm bỏ dấu tiếng Việt → ASCII (để so sánh không bị lỗi Unicode)
function removeDiacritics(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase().trim();
}

// Hàm chuẩn hóa Unicode tiếng Việt
function norm(str) {
    return str ? str.normalize('NFC').toLowerCase().trim() : '';
}

// 4 kho: dùng từ khóa ASCII để match chắc chắn (tránh lỗi Unicode)
const WAREHOUSE_KEYWORDS = {
    'Hải Dương': ['hai duong'],
    'Hải Phòng': ['hai phong'],
    'Hưng Yên':  ['hung yen', 'mien bac', 'mien bang'],
    'Thái Bình': ['thai binh'],
};

// Hàm kiểm tra 1 tên kho có thuộc 4 kho của mình không
function isMyWarehouse(warehouseName) {
    if (!warehouseName) return false;
    const ascii = removeDiacritics(warehouseName);
    for (const keywords of Object.values(WAREHOUSE_KEYWORDS)) {
        if (keywords.some(kw => ascii.includes(kw))) return true;
    }
    return false;
}

// Hàm rút gọn tên kho cho gọn gàng
function shortWarehouse(warehouseName) {
    if (!warehouseName) return '';
    const ascii = removeDiacritics(warehouseName);
    for (const [short, keywords] of Object.entries(WAREHOUSE_KEYWORDS)) {
        if (keywords.some(kw => ascii.includes(kw))) return short;
    }
    return warehouseName;
}

// Tách tên kho ra khỏi tên NV (NV ghi nhầm kho vào ô tên)
// VD: "Kho Giao Hàng Nặng Hưng Nguyễn Văn Hiểu" → "Nguyễn Văn Hiểu"
function stripWarehouseFromName(rawName) {
    if (!rawName) return rawName;
    const ascii = removeDiacritics(rawName);

    // Các pattern tên kho có thể xuất hiện đầu tên NV (ASCII, không dấu)
    const whPrefixes = [
        'kho giao hang nang hai duong',
        'kho giao hang nang hai phong',
        'kho giao hang nang hung yen',
        'kho giao hang nang hung',
        'kho giao hang nang mien bac',
        'kho giao hang nang mien bang',
        'kho giao hang nang thai binh',
        'kho gxt hai duong',
        'kho gxt hai phong',
        'kho gxt hung yen',
        'kho gxt hung',
        'kho gxt mien bac',
        'kho gxt mien bang',
        'kho gxt thai binh',
        'kho giao hang nang',
        'kho gxt',
    ];

    // Sắp xếp dài → ngắn để match pattern dài nhất trước
    whPrefixes.sort((a, b) => b.length - a.length);

    for (const prefix of whPrefixes) {
        if (ascii.startsWith(prefix)) {
            // Lấy phần còn lại sau prefix
            const remaining = rawName.substring(prefix.length).trim();
            // Kiểm tra phần còn lại có phải tên người (ít nhất 2 từ)
            if (remaining && remaining.split(/\s+/).length >= 2) {
                return remaining;
            }
        }
    }

    return rawName;
}

// ====== CHUẨN HÓA DẤU TIẾNG VIỆT ======
// Đưa các dấu gõ sai kiểu cũ (OÀ, UỶ) về chuẩn mới (ÒA, ỦY)
function normalizeTone(str) {
    if (!str) return str;
    return str
        .replace(/OÀ/g, 'ÒA').replace(/OÁ/g, 'ÓA').replace(/OẢ/g, 'ỎA').replace(/OÃ/g, 'ÕA').replace(/OẠ/g, 'ỌA')
        .replace(/OÈ/g, 'ÒE').replace(/OÉ/g, 'ÓE').replace(/OẺ/g, 'ỎE').replace(/OẼ/g, 'ÕE').replace(/OẸ/g, 'ỌE')
        .replace(/UỲ/g, 'ÙY').replace(/UÝ/g, 'ÚY').replace(/UỶ/g, 'ỦY').replace(/UỸ/g, 'ŨY').replace(/UỴ/g, 'ỤY');
}

// ====== FORMAT BIỂN SỐ XE ======
// Tự động thêm dấu gạch ngang chuẩn (VD: 17A53240 -> 17A-53240)
function formatPlate(p) {
    if (!p) return '';
    let s = p.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const match = s.match(/^(\d{2}[A-Z]{1,2})(\d{4,5})$/);
    if (match) {
        return match[1] + '-' + match[2];
    }
    return s;
}

// ====== KỲ ĐỐI SOÁT NCC ======
// Kỳ = từ ngày 26 tháng này → 25 tháng sau
// VD: Kỳ 05/2026 = 26/05/2026 → 25/06/2026
function getCycleRange(monthStr) {
    if (!monthStr) return null;
    const [y, m] = monthStr.split('-').map(Number);
    const start = new Date(y, m - 1, 26); // 26 tháng này
    const end = new Date(y, m, 25);       // 25 tháng sau
    return { start, end };
}

function isInCycle(dateObj, monthStr) {
    if (!dateObj || !monthStr) return false;
    const range = getCycleRange(monthStr);
    if (!range) return false;
    // So sánh chỉ ngày (bỏ giờ)
    const d = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    return d >= range.start && d <= range.end;
}

// ====== LEVENSHTEIN DISTANCE (Đo độ tương tự 2 chuỗi) ======
function levenshtein(a, b) {
    if (!a || !b) return Math.max((a||'').length, (b||'').length);
    const m = a.length, n = b.length;
    const dp = Array.from({length: m + 1}, (_, i) => [i]);
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            dp[i][j] = a[i-1] === b[j-1]
                ? dp[i-1][j-1]
                : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
        }
    }
    return dp[m][n];
}

// ====== PHÁT HIỆN GÕ SAI (Typo Detection) ======
// Logic: nhóm các (tên+mã+biển số) giống nhau theo tần suất.
// Tổ hợp xuất hiện nhiều nhất = "đúng". Tổ hợp tương tự nhưng ít hơn = "sai".
function detectTypos(data) {
    // Bước 1: Đếm tần suất mỗi tổ hợp (tên, mã NV)
    const freqMap = {}; // key = "TÊN|MÃ" → { count, entries[] }
    data.forEach(e => {
        const key = e.name + '|' + e.code;
        if (!freqMap[key]) freqMap[key] = { name: e.name, code: e.code, count: 0, entries: [] };
        freqMap[key].count++;
        freqMap[key].entries.push(e);
    });

    // Bước 2: Sắp xếp theo tần suất giảm dần
    const sorted = Object.values(freqMap).sort((a, b) => b.count - a.count);

    // Bước 3: Đánh dấu canonical (đúng) vs typo (sai)
    const canonical = []; // Những combo được coi là đúng
    const typos = [];     // Những combo nghi ngờ sai

    sorted.forEach(item => {
        // Tìm xem item có giống combo nào đã đúng không
        let bestMatch = null;
        let bestScore = Infinity;

        for (const can of canonical) {
            const nameDist = levenshtein(item.name, can.name);
            const codeDist = levenshtein(item.code, can.code);

            // Cùng tên, mã khác 1-2 số → typo mã
            // Cùng mã, tên khác 1-3 chữ → typo tên
            // Cả hai đều gần → typo
            const isSimilar = (
                (nameDist <= 3 && codeDist <= 2 && (nameDist + codeDist) > 0) ||
                (nameDist === 0 && codeDist > 0 && codeDist <= 3) ||
                (codeDist === 0 && nameDist > 0 && nameDist <= 3)
            );

            if (isSimilar) {
                const score = nameDist + codeDist;
                if (score < bestScore) {
                    bestScore = score;
                    bestMatch = can;
                }
            }
        }

        if (bestMatch && item.count < bestMatch.count) {
            // Ít hơn → nghi sai
            typos.push({
                wrong: item,
                correct: bestMatch,
                nameDist: levenshtein(item.name, bestMatch.name),
                codeDist: levenshtein(item.code, bestMatch.code)
            });
        } else {
            // Nhiều hơn hoặc bằng → coi là đúng
            canonical.push(item);
        }
    });

    // Bước 4: Kiểm tra biển số NV gõ có trong danh sách chuẩn (Master) không
    // (Bỏ dùng supplierData vì supplierData chỉ chứa các chuyến lỗi/chưa báo cáo, biển đúng có thể đã bị xóa)
    const masterPlates = new Set();
    const masterPlateList = [];
    masterList.forEach(m => {
        if (m.plate) {
            const p = m.plate.toUpperCase().replace(/[\s\-\.]/g, '');
            masterPlates.add(p);
            masterPlateList.push(p);
        }
    });

    const plateTypos = [];
    const plateWrongMap = {}; // Gom các biển sai giống nhau

    data.forEach(e => {
        if (!e.plate) return;
        const pNorm = e.plate.toUpperCase().replace(/[\s\-\.]/g, '');

        // Kiểm tra có khớp chính xác với 1 biển nào đó trong danh sách Master không
        if (masterPlates.has(pNorm)) return; // Đúng → bỏ qua

        // Không có → nghi ngờ gõ sai. Tìm gợi ý đúng nhất.
        let bestPlate = null;

        // Ưu tiên 1: Tìm biển số cố định của chính NV đó trong Master list (dựa vào mã NV hoặc tên)
        const matchedMaster = masterList.find(m => m.code === e.code || m.name === e.name);
        if (matchedMaster && matchedMaster.plate) {
            bestPlate = matchedMaster.plate;
        } else {
            // Ưu tiên 2: Tìm biển gần giống nhất trong toàn bộ Master list
            let bestDist = Infinity;
            for (const mp of masterPlateList) {
                const dist = levenshtein(pNorm, mp);
                if (dist < bestDist && dist <= 3) {
                    bestDist = dist;
                    bestPlate = mp;
                }
            }
        }

        // Gom theo biển sai
        const key = pNorm;
        if (!plateWrongMap[key]) {
            plateWrongMap[key] = {
                wrongPlate: e.plate,
                correctPlate: formatPlate(bestPlate) || '(không tìm thấy)',
                count: 0,
                entries: []
            };
        }
        plateWrongMap[key].count++;
        plateWrongMap[key].entries.push(e);
    });

    Object.values(plateWrongMap).forEach(pw => {
        plateTypos.push(pw);
    });

    // Bước 5: Đối chiếu với danh sách NV chuẩn (Master)
    // So sánh tên+mã NV báo cáo với master list
    const masterMismatches = [];
    if (masterList.length > 0) {
        // Gom unique NV từ báo cáo (theo mã)
        const reportedByCode = {};
        data.forEach(e => {
            if (!e.code) return;
            const key = e.code;
            if (!reportedByCode[key]) {
                reportedByCode[key] = { name: e.name, code: e.code, count: 0, entries: [] };
            }
            reportedByCode[key].count++;
            reportedByCode[key].entries.push(e);
        });

        // So sánh từng NV trong master
        masterList.forEach(master => {
            const reported = reportedByCode[master.code];
            if (!reported) return; // NV chưa báo cáo → bỏ qua

            const nameDist = levenshtein(reported.name, master.name);
            if (nameDist > 0 && nameDist <= 5) {
                // Tên khác so với master
                masterMismatches.push({
                    reported: reported,
                    master: master,
                    type: 'name',
                    distance: nameDist
                });
            }
        });

        // Tìm NV báo cáo có mã KHÔNG CÓ trong master
        Object.values(reportedByCode).forEach(rep => {
            const inMaster = masterList.some(m => m.code === rep.code);
            if (!inMaster) {
                // Tìm master gần nhất theo tên
                let bestMaster = null;
                let bestDist = Infinity;
                for (const m of masterList) {
                    const dist = levenshtein(rep.name, m.name);
                    if (dist < bestDist) {
                        bestDist = dist;
                        bestMaster = m;
                    }
                }
                if (bestMaster && bestDist <= 3) {
                    masterMismatches.push({
                        reported: rep,
                        master: bestMaster,
                        type: 'code',
                        distance: bestDist
                    });
                }
            }
        });
    }

    return { typos, plateTypos, masterMismatches };
}

// ====== BIẾN TOÀN CỤC ======
let employeeData = [];   // Dữ liệu NV điền ODO (đã lọc theo 4 kho)
let supplierData = [];   // Dữ liệu đối soát NCC (đã lọc theo 4 kho)
let masterList = [];     // Danh sách NV chuẩn (master)
let allEmployeeNames = new Set();
let refreshTimer = null;
let countdownTimer = null;
let nextRefreshTime = null;

// ====== KHỞI CHẠY ======
document.addEventListener('DOMContentLoaded', () => {
    // Tự động tính kỳ đối soát hiện tại (ngày < 26 → tháng trước, ngày >= 26 → tháng này)
    const now = new Date();
    let cycleYear = now.getFullYear();
    let cycleMonth = now.getMonth(); // 0-indexed
    if (now.getDate() < 26) {
        cycleMonth -= 1;
        if (cycleMonth < 0) { cycleMonth = 11; cycleYear -= 1; }
    }
    const monthStr = `${cycleYear}-${String(cycleMonth + 1).padStart(2, '0')}`;
    document.getElementById('filterMonth').value = monthStr;

    // Hiển thị nhãn kỳ
    const cycle = getCycleRange(monthStr);
    const startStr = `${String(cycle.start.getDate()).padStart(2,'0')}/${String(cycle.start.getMonth()+1).padStart(2,'0')}`;
    const endStr = `${String(cycle.end.getDate()).padStart(2,'0')}/${String(cycle.end.getMonth()+1).padStart(2,'0')}/${cycle.end.getFullYear()}`;
    document.getElementById('cycleLabel').textContent = `📅 ${startStr} → ${endStr}`;

    // Gắn sự kiện lọc
    document.getElementById('filterWarehouse').addEventListener('change', renderAll);
    document.getElementById('filterEmployee').addEventListener('change', renderAll);

    // Tải dữ liệu lần đầu
    loadAllData();

    // Hẹn giờ tự động refresh
    startAutoRefresh();
});

// ====== HÀM TẢI DỮ LIỆU TỪ GOOGLE SHEET ======
// Dùng JSONP (script injection) — KHÔNG BỊ LỖI CORS khi mở file từ máy tính
// Cách hoạt động: tạo thẻ <script> trỏ tới Google Sheet, Google trả dữ liệu
// qua hàm callback, không cần fetch() nên không bị chặn.
let _jsonpCounter = 0;

function fetchSheetJSONP(sheetId, gid) {
    return new Promise((resolve, reject) => {
        const callbackName = '_sheetCB_' + (++_jsonpCounter) + '_' + Date.now();
        const timeoutMs = 30000; // timeout 30 giây

        // Tạo hàm callback toàn cục
        window[callbackName] = function(data) {
            // Dọn dẹp
            delete window[callbackName];
            if (script.parentNode) script.parentNode.removeChild(script);
            clearTimeout(timer);

            if (!data || data.status !== 'ok') {
                reject(new Error('Google Sheet trả về lỗi: ' + (data?.errors?.[0]?.message || 'Không rõ')));
                return;
            }

            // Chuyển đổi từ format Google Viz sang mảng 2D đơn giản
            const rows = [];
            const table = data.table;

            // Data rows (headers=1 nên không có header trong rows)
            if (table.rows) {
                table.rows.forEach(row => {
                    const r = row.c.map(cell => {
                        if (!cell) return '';
                        // Ưu tiên formatted value (f) cho ngày tháng
                        if (cell.f) return String(cell.f).normalize('NFC');
                        if (cell.v === null || cell.v === undefined) return '';
                        // Xử lý ngày dạng Date(yyyy,mm,dd...) từ Google Viz
                        const sv = String(cell.v).normalize('NFC');
                        const dateMatch = sv.match(/^Date\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
                        if (dateMatch) {
                            const dd = String(parseInt(dateMatch[3])).padStart(2, '0');
                            const mm = String(parseInt(dateMatch[2]) + 1).padStart(2, '0');
                            return dd + '/' + mm + '/' + dateMatch[1];
                        }
                        return sv;
                    });
                    rows.push(r);
                });
            }

            resolve(rows);
        };

        // Timeout nếu Google không phản hồi
        const timer = setTimeout(() => {
            delete window[callbackName];
            if (script.parentNode) script.parentNode.removeChild(script);
            reject(new Error('Hết thời gian chờ (30s). Kiểm tra kết nối internet và quyền chia sẻ Google Sheet.'));
        }, timeoutMs);

        // Tạo thẻ <script> để tải dữ liệu (bypass CORS)
        const script = document.createElement('script');
        script.src = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=responseHandler:${callbackName}&gid=${gid}&headers=1`;
        script.onerror = () => {
            delete window[callbackName];
            clearTimeout(timer);
            reject(new Error('Không thể kết nối Google Sheet. Kiểm tra internet hoặc quyền chia sẻ Sheet.'));
        };
        document.body.appendChild(script);
    });
}

// ====== HÀM TẢI TOÀN BỘ DỮ LIỆU ======
async function loadAllData() {
    showLoading(true);
    try {
        // Tải song song cả 3 sheet bằng JSONP
        const [empRows, supRows, masterRows] = await Promise.all([
            fetchSheetJSONP(CONFIG.SHEET_EMPLOYEE_ID, CONFIG.SHEET_EMPLOYEE_GID),
            fetchSheetJSONP(CONFIG.SHEET_SUPPLIER_ID, CONFIG.SHEET_SUPPLIER_GID),
            fetchSheetJSONP(CONFIG.SHEET_MASTER_ID, CONFIG.SHEET_MASTER_GID)
        ]);

        // Debug log
        console.log(`✅ Loaded: NV=${empRows.length} rows, NCC=${supRows.length} rows, Master=${masterRows.length} rows`);

        // ═══════════════════════════════════════
        // XỬ LÝ DANH SÁCH NV CHUẨN (Master)
        // Cột: A=MãNV, B=Tên, C=Biển số, D=NCC, E=Loại xe, F=Tỉnh, G=Kho
        // ═══════════════════════════════════════
        masterList = [];
        masterRows.forEach(r => {
            if (!r || r.length < 3) return;
            const code = (r[0] || '').replace(/[^0-9]/g, '').trim();
            const name = normalizeTone((r[1] || '').trim().normalize('NFC').toUpperCase());
            const plate = (r[2] || '').trim().toUpperCase().replace(/[\s\-\.]/g, '');
            const ncc = (r[3] || '').trim();
            const province = (r[5] || '').trim();
            const warehouse = (r[6] || '').trim();
            if (!code || !name) return;
            masterList.push({ code, name, plate, ncc, province, warehouse });
        });
        console.log(`✅ Master list: ${masterList.length} NV`);

        // ═══════════════════════════════════════
        // XỬ LÝ DỮ LIỆU NHÂN VIÊN
        // headers=1 → rows chỉ chứa data, bắt đầu từ index 0
        // Chỉ lấy NV thuộc 4 kho anh quản lý
        // ═══════════════════════════════════════
        employeeData = [];
        allEmployeeNames.clear();

        for (let i = 0; i < empRows.length; i++) {
            const r = empRows[i];
            if (!r || r.length < 10) continue;

            const fullName = (r[2] || '').trim();
            if (!fullName) continue;

            const warehouse = (r[6] || '').trim();

            // ★ CHỈ LẤY NV THUỘC 4 KHO CỦA MÌNH ★
            if (!isMyWarehouse(warehouse)) continue;

            // Tách tên và mã NV (tìm 5-8 chữ số ở cuối chuỗi)
            let nameRaw = fullName;
            let code = '';
            const codeMatch = fullName.match(/(\d{5,8})[^\w\d]*$/);
            if (codeMatch) {
                code = codeMatch[1];
                // Cắt phần tên (tất cả những gì trước đoạn code)
                nameRaw = fullName.substring(0, codeMatch.index).trim();
                // Bỏ các ký tự đặc biệt dư thừa nối giữa tên và mã (VD: '-', '_', '(')
                nameRaw = nameRaw.replace(/[\s\-_\(\[\]\,]+$/, '');
            }

            // ★ Tách tên kho khỏi tên NV nếu NV ghi nhầm kho vào tên ★
            nameRaw = stripWarehouseFromName(nameRaw);
            const name = normalizeTone(nameRaw.normalize('NFC').toUpperCase());
            const area = (r[3] || '').trim();
            const dateStr = (r[4] || '').trim();
            const plate = (r[9] || '').trim();
            const supplier = (r[5] || '').trim();
            const kmStart = (r[7] || '').trim();
            const kmEnd = (r[12] || '').trim();
            const hourStart = (r[8] || '').trim();
            const hourEnd = (r[13] || '').trim();
            const matchKey = (r[15] || '').trim(); // Column 16

            // Parse ngày DD/MM/YYYY hoặc DD-MM-YYYY
            const dateParts = dateStr.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
            let dateObj = null;
            if (dateParts) {
                dateObj = new Date(parseInt(dateParts[3]), parseInt(dateParts[2]) - 1, parseInt(dateParts[1]));
            }

            const shortWH = shortWarehouse(warehouse);

            // Lưu dòng gốc trong Sheet (headers=1 → data row 0 = sheet row 2)
            const sheetRow = i + 2;

            const entry = {
                name, code, area, dateStr, dateObj, plate, supplier, warehouse, shortWH,
                kmStart, kmEnd, hourStart, hourEnd, matchKey, fullName, sheetRow
            };

            employeeData.push(entry);
            allEmployeeNames.add(name + (code ? ' ' + code : ''));
        }

        // ═══════════════════════════════════════
        // SỬA TÊN NV BỊ GÕ NHẦM THÀNH BIỂN SỐ XE
        // Nếu "tên" trông giống biển số (VD: 34C-32203), tìm NV thật
        // đã chạy xe đó gần nhất rồi gán lại tên + mã đúng
        // ═══════════════════════════════════════
        const platePattern = /^\d{2}[A-Z]-?\d{3,5}\.?\d{0,2}$/i;
        employeeData.forEach(entry => {
            if (!platePattern.test(entry.name.replace(/\s/g, ''))) return;

            const fakePlate = entry.name.replace(/\s/g, '');
            const realEntries = employeeData.filter(e =>
                !platePattern.test(e.name.replace(/\s/g, '')) &&
                e.plate && e.plate.replace(/[\s\-.]/g, '') === fakePlate.replace(/[\s\-.]/g, '')
            ).sort((a, b) => (b.dateObj || 0) - (a.dateObj || 0));

            if (realEntries.length > 0) {
                const real = realEntries[0];
                entry.name = real.name;
                entry.code = real.code;
            }
        });

        // ═══════════════════════════════════════
        // CHUẨN HÓA TÊN + MÃ NV THEO TẦN SUẤT
        // Tên xuất hiện nhiều nhất = ĐÚNG → gán cho tất cả entries tương tự
        // VD: "NGUYỄN TRỌNG LÂM 3136388" (12 lần) vs "NGUYỄN TRỌNG LÂM" (2 lần, thiếu mã)
        //     → gán mã 3136388 cho cả 2 lần thiếu đó
        // ═══════════════════════════════════════
        const freqMap = {};
        employeeData.forEach(e => {
            const key = e.name + '|' + e.code;
            if (!freqMap[key]) freqMap[key] = { name: e.name, code: e.code, count: 0 };
            freqMap[key].count++;
        });

        // Sắp xếp: ưu tiên mã NV 7 chữ số trước, sau đó theo tần suất giảm dần
        const sortedCombos = Object.values(freqMap).sort((a, b) => {
            const a7 = a.code && a.code.length === 7 ? 1 : 0;
            const b7 = b.code && b.code.length === 7 ? 1 : 0;
            if (b7 !== a7) return b7 - a7; // Mã 7 số lên trước
            return b.count - a.count;       // Rồi mới theo tần suất
        });
        const canonicalList = [];

        sortedCombos.forEach(item => {
            let matched = null;
            for (const can of canonicalList) {
                const nameDist = levenshtein(item.name, can.name);
                const codeDist = levenshtein(item.code, can.code);

                // Cùng tên + mã khác chút
                const isSimilar = (
                    (nameDist <= 3 && codeDist <= 2 && (nameDist + codeDist) > 0) ||
                    (nameDist === 0 && codeDist > 0 && codeDist <= 3) ||
                    (codeDist === 0 && nameDist > 0 && nameDist <= 3) ||
                    // Cùng tên, 1 bên thiếu mã hoặc mã sai số chữ số
                    (nameDist <= 2 && (!item.code || !can.code)) ||
                    // Cùng tên, 1 bên mã 7 số chuẩn, bên kia mã sai (khác độ dài)
                    (nameDist <= 2 && can.code.length === 7 && item.code.length !== 7)
                );
                if (isSimilar) { matched = can; break; }
            }
            if (matched && item.count < matched.count) {
                // item ít hơn → item sai, matched đúng
                matched.aliases = matched.aliases || [];
                matched.aliases.push(item);
            } else {
                canonicalList.push(item);
            }
        });

        // Gán lại tên + mã đúng cho tất cả entries
        employeeData.forEach(entry => {
            for (const can of canonicalList) {
                if (!can.aliases) continue;
                for (const alias of can.aliases) {
                    if (entry.name === alias.name && entry.code === alias.code) {
                        entry.name = can.name;
                        entry.code = can.code;
                        return;
                    }
                }
            }
        });

        // ═══════════════════════════════════════
        // XỬ LÝ DỮ LIỆU NCC
        // headers=1 → Google tự bỏ header, bắt đầu từ index 0
        // Chỉ lấy chuyến xe thuộc 4 kho
        // ═══════════════════════════════════════
        supplierData = [];
        for (let i = 0; i < supRows.length; i++) {
            const r = supRows[i];
            if (!r || r.length < 14) continue;

            const stt = (r[0] || '').trim();
            if (!stt || isNaN(stt)) continue;

            const ncc = (r[1] || '').trim();
            const dateStr = (r[2] || '').trim();
            const plate = (r[3] || '').trim();
            const vehicle = (r[4] || '').trim();
            const note = (r[5] || '').trim();
            const area = (r[6] || '').trim();
            const warehouse = (r[7] || '').trim();
            const nvghStatus = (r[8] || '').trim();  // Cột I: "x" = NV chưa báo cáo
            const matchKey = (r[13] || '').trim();

            // ★ CHỈ LẤY CHUYẾN THUỘC 4 KHO CỦA MÌNH ★
            if (!isMyWarehouse(warehouse)) continue;

            const shortWH = shortWarehouse(warehouse);

            // Parse ngày NCC
            const dateParts = dateStr.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
            let dateObj = null;
            if (dateParts) {
                dateObj = new Date(parseInt(dateParts[3]), parseInt(dateParts[2]) - 1, parseInt(dateParts[1]));
            }

            supplierData.push({
                stt, ncc, dateStr, dateObj, plate, vehicle, note, area, warehouse, shortWH, nvghStatus, matchKey
            });
        }

        // Cập nhật bộ lọc NV
        updateFilters();

        // Vẽ giao diện
        renderAll();

        // Cập nhật thời gian refresh
        const now = new Date();
        document.getElementById('lastRefresh').textContent =
            `Cập nhật: ${now.toLocaleTimeString('vi-VN')}`;

        showToast('✅', `Đã tải ${employeeData.length} bản ghi NV + ${supplierData.length} chuyến NCC`);

    } catch (err) {
        console.error('Lỗi tải dữ liệu:', err);
        showToast('❌', 'Không thể tải dữ liệu. Vui lòng thử lại.');
        document.getElementById('loadingDaily').innerHTML = `
            <div class="empty-state">
                <div class="icon">❌</div>
                <p>Không thể tải dữ liệu. Hãy kiểm tra:<br>
                1. Kết nối internet<br>
                2. File Google Sheet đã mở quyền "Bất kỳ ai có link"<br><br>
                <small style="color:var(--text-muted);">Vui lòng thử lại sau hoặc liên hệ quản trị viên.</small></p>
            </div>`;
    }
}

// ====== CẬP NHẬT BỘ LỌC NV ======
function updateFilters() {
    const empSelect = document.getElementById('filterEmployee');
    const oldEmp = empSelect.value;

    empSelect.innerHTML = '<option value="">Tất cả nhân viên</option>';
    [...allEmployeeNames].sort().forEach(n => {
        empSelect.innerHTML += `<option value="${escapeHtml(n)}">${escapeHtml(n)}</option>`;
    });

    empSelect.value = oldEmp;
}

// ====== RENDER TOÀN BỘ ======
function renderAll() {
    const month = document.getElementById('filterMonth').value;
    const whFilter = document.getElementById('filterWarehouse').value; // Tên ngắn: "Hải Dương", ...
    const empFilter = document.getElementById('filterEmployee').value;

    // Lọc dữ liệu theo kỳ đối soát (26 tháng này → 25 tháng sau) + kho + NV
    let filtered = employeeData.filter(e => {
        if (!e.dateObj) return false;
        if (month && !isInCycle(e.dateObj, month)) return false;
        if (whFilter && e.shortWH !== whFilter) return false;
        if (empFilter && norm(e.name + (e.code ? ' ' + e.code : '')) !== norm(empFilter)) return false;
        return true;
    });

    // Sắp xếp theo ngày mới nhất
    filtered.sort((a, b) => (b.dateObj || 0) - (a.dateObj || 0));

    // Tính toán thống kê
    computeStats(filtered, month);

    // Vẽ bảng theo dõi
    renderDailyTable(filtered);

    // Vẽ xếp hạng
    renderRanking(month, whFilter);

    // Vẽ cảnh báo gõ sai (chỉ trong kỳ)
    renderTypoWarnings(month);

    // Vẽ cảnh báo gian lận (chỉ trong kỳ)
    renderFraudWarnings(filtered);

    showLoading(false);
}

// ====== TÍNH THỐNG KÊ ======
// "Đã báo cáo" = file NV (nhân viên đã gửi form ODO)
// "Chưa báo cáo" = file NCC (chuyến xe NCC hôm nay chưa có ODO tương ứng)
function computeStats(filtered, month) {
    // Tổng NV unique đã từng báo cáo trong tháng
    const uniqueEmployees = new Set(filtered.map(e => e.name + e.code));
    const elTotal = document.getElementById('statTotalEmployees');
    if (elTotal) elTotal.textContent = uniqueEmployees.size;

    // Hôm nay
    const today = new Date();
    const todayStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
    const whFilter = document.getElementById('filterWarehouse').value;

    const reportedToday = filtered.filter(e => e.dateStr === todayStr);
    const reportedKeys = new Set(reportedToday.map(e => e.matchKey).filter(Boolean));
    const elCompleted = document.getElementById('statCompleted');
    if (elCompleted) elCompleted.textContent = reportedToday.length;

    const nccToday = supplierData.filter(s => {
        if (s.dateStr !== todayStr) return false;
        if (whFilter && s.shortWH !== whFilter) return false;
        return true;
    });
    const nccUnreported = nccToday.filter(s => !reportedKeys.has(s.matchKey));
    const elMissing = document.getElementById('statMissing');
    if (elMissing) elMissing.textContent = nccUnreported.length;

    if (month) {
        const cycle = getCycleRange(month);
        let workDays = 0;
        const todayDate = new Date();
        for (let dt = new Date(cycle.start); dt <= cycle.end; dt.setDate(dt.getDate() + 1)) {
            if (dt > todayDate) break;
            if (dt.getDay() !== 0) workDays++;
        }

        const nccMonth = supplierData.filter(s => {
            if (!s.dateObj) return false;
            if (!isInCycle(s.dateObj, month)) return false;
            if (whFilter && s.shortWH !== whFilter) return false;
            return true;
        });
        const empKeysMonth = new Set(filtered.map(e => e.matchKey).filter(Boolean));
        const nccMonthMatched = nccMonth.filter(s => empKeysMonth.has(s.matchKey));
        const rate = nccMonth.length > 0 ? Math.round((nccMonthMatched.length / nccMonth.length) * 100) : 0;

        const elRate = document.getElementById('statRate');
        if (elRate) elRate.textContent = Math.min(rate, 100) + '%';
        const elBar = document.getElementById('rateBar');
        if (elBar) elBar.style.width = Math.min(rate, 100) + '%';

        let warningCount = 0;
        uniqueEmployees.forEach(empKey => {
            const empReports = filtered.filter(e => (e.name + e.code) === empKey).length;
            const empRate = workDays > 0 ? (empReports / workDays) * 100 : 0;
            if (empRate <= 50) warningCount++;
        });
        const elWarning = document.getElementById('statWarning');
        if (elWarning) elWarning.textContent = warningCount;
    }
}

// ====== RENDER BẢNG THEO DÕI ======
function renderDailyTable(filtered) {
    const container = document.getElementById('dailyTableContainer');
    document.getElementById('totalRecords').textContent = `${filtered.length} bản ghi`;

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">📭</div>
                <p>Không có dữ liệu trong tháng này.</p>
            </div>`;
        return;
    }

    const supplierKeys = new Set(supplierData.map(s => s.matchKey).filter(Boolean));

    let html = `<table>
        <thead>
            <tr>
                <th>#</th>
                <th>Ngày</th>
                <th>Họ và tên</th>
                <th>Mã NV</th>
                <th>Biển số xe</th>
                <th>NCC</th>
                <th>Kho</th>
                <th>Giờ đi</th>
                <th>Giờ về</th>
                <th>Tăng ca</th>
                <th>ODO Đi</th>
                <th>ODO Về</th>
                <th>Km</th>
                <th>Đối soát</th>
                <th style="width:60px;">Sửa</th>
            </tr>
        </thead>
        <tbody>`;

    filtered.forEach((e, i) => {
        const km = (parseInt(e.kmEnd) - parseInt(e.kmStart));
        const kmDisplay = isNaN(km) ? '—' : km.toLocaleString();

        // Tính tăng ca: ca cố định 7h-19h, ngoài 19h là tăng ca
        let otDisplay = '—';
        let otColor = 'var(--text-muted)';
        if (e.hourEnd) {
            // Parse giờ về (hỗ trợ nhiều format: "19:30", "19h30", "19:30:00", "7:30:00 PM", v.v.)
            const timeStr = e.hourEnd.replace(/h/gi, ':');
            const timeParts = timeStr.match(/(\d{1,2}):(\d{2})/);
            if (timeParts) {
                let hours = parseInt(timeParts[1]);
                const mins = parseInt(timeParts[2]);
                // Hỗ trợ AM/PM
                if (/PM/i.test(timeStr) && hours < 12) hours += 12;
                if (/AM/i.test(timeStr) && hours === 12) hours = 0;
                const totalMinutes = hours * 60 + mins;
                const shiftEnd = 19 * 60; // 19:00
                if (totalMinutes > shiftEnd) {
                    const otMinutes = totalMinutes - shiftEnd;
                    const otHours = Math.floor(otMinutes / 60);
                    const otMins = otMinutes % 60;
                    otDisplay = otHours > 0 ? `${otHours}h${otMins > 0 ? String(otMins).padStart(2,'0') : ''}` : `${otMins}p`;
                    otColor = otMinutes > 180 ? 'var(--danger)' : otMinutes > 120 ? '#f0ad4e' : 'var(--success)';
                } else {
                    otDisplay = '—';
                }
            }
        }

        let reconBadge = '';
        if (!e.matchKey) {
            reconBadge = '<span class="badge badge-warning">—</span>';
        } else if (supplierKeys.has(e.matchKey)) {
            reconBadge = '<span class="badge badge-danger">⚠️ Lệch thông tin</span>';
        } else {
            reconBadge = '<span class="badge badge-success">✓ Đã đối soát</span>';
        }

        const sheetUrl = `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_EMPLOYEE_ID}/edit#gid=${CONFIG.SHEET_EMPLOYEE_GID}&range=A${e.sheetRow}`;

        html += `<tr>
            <td>${i + 1}</td>
            <td style="white-space:nowrap; font-weight:600;">${escapeHtml(e.dateStr)}</td>
            <td style="font-weight:600;">${escapeHtml(e.name)}</td>
            <td><span class="badge badge-info">${escapeHtml(e.code) || '—'}</span></td>
            <td style="font-family:monospace; font-weight:600;">${escapeHtml(e.plate)}</td>
            <td style="font-size:12px;">${escapeHtml(e.supplier)}</td>
            <td><span class="badge badge-info">${escapeHtml(e.shortWH)}</span></td>
            <td style="font-family:monospace;white-space:nowrap;">${escapeHtml(e.hourStart || '—')}</td>
            <td style="font-family:monospace;white-space:nowrap;">${escapeHtml(e.hourEnd || '—')}</td>
            <td style="font-weight:700;color:${otColor};text-align:center;">${escapeHtml(otDisplay)}</td>
            <td style="font-family:monospace;">${escapeHtml(String(e.kmStart))}</td>
            <td style="font-family:monospace;">${escapeHtml(String(e.kmEnd))}</td>
            <td style="font-weight:600; color:${!isNaN(km) && km < 0 ? 'var(--danger)' : !isNaN(km) && km > 200 ? 'var(--danger)' : !isNaN(km) && km > 150 ? '#f0ad4e' : 'var(--success)'}">${!isNaN(km) && km < 0 ? '⚠️ ' + escapeHtml(String(kmDisplay)) + ' (gõ sai!)' : escapeHtml(String(kmDisplay))}</td>
            <td>${reconBadge}</td>
            <td><a href="${sheetUrl}" target="_blank" onclick="this.style.color='#666';this.style.opacity='0.5';" style="color:var(--primary);text-decoration:underline;font-size:12px;white-space:nowrap;">Dòng ${e.sheetRow}</a></td>
        </tr>`;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

// ====== RENDER XẾP HẠNG ======
function renderRanking(month, whFilter) {
    const grid = document.getElementById('rankingGrid');

    let filtered = employeeData.filter(e => {
        if (!e.dateObj) return false;
        if (month && !isInCycle(e.dateObj, month)) return false;
        if (whFilter && e.shortWH !== whFilter) return false;
        return true;
    });

    // Tính số ngày trong kỳ (26 tháng này → 25 tháng sau, tính đến hôm nay)
    let daysElapsed = 1;
    const allDatesInCycle = [];
    if (month) {
        const cycle = getCycleRange(month);
        const todayDate = new Date();
        daysElapsed = 0;
        for (let dt = new Date(cycle.start); dt <= cycle.end; dt.setDate(dt.getDate() + 1)) {
            if (dt > todayDate) break;
            daysElapsed++;
            const dd = String(dt.getDate()).padStart(2, '0');
            const mm = String(dt.getMonth() + 1).padStart(2, '0');
            allDatesInCycle.push(`${dd}/${mm}/${dt.getFullYear()}`);
        }
    }

    // Gom NV theo kho
    const whMap = {}; 
    filtered.forEach(e => {
        const wh = e.shortWH || 'Khác';
        const key = e.name + '|' + e.code;
        if (!whMap[wh]) whMap[wh] = {};
        if (!whMap[wh][key]) {
            const master = masterList.find(m => m.code === e.code);
            const plate = master ? formatPlate(master.plate) : (e.plate || '');
            whMap[wh][key] = { name: e.name, code: e.code, plate: plate, days: new Set() };
        }
        whMap[wh][key].days.add(e.dateStr);
    });

    // ★ Bổ sung NV từ master list chưa báo cáo (đảm bảo 4 kho luôn hiện)
    if (masterList.length > 0) {
        masterList.forEach(m => {
            const wh = shortWarehouse(m.warehouse);
            if (!wh || wh === m.warehouse) return; // Không thuộc 4 kho
            if (whFilter && wh !== whFilter) return;
            if (!whMap[wh]) whMap[wh] = {};
            const key = m.name + '|' + m.code;
            if (!whMap[wh][key]) {
                whMap[wh][key] = { name: m.name, code: m.code, plate: formatPlate(m.plate), days: new Set() };
            }
        });
    }

    // Nếu không có dữ liệu
    if (Object.keys(whMap).length === 0) {
        grid.innerHTML = '<div class="empty-state"><div class="icon">📭</div><p>Không có dữ liệu trong tháng này.</p></div>';
        return;
    }

    // Lấy tháng hiện tại để format ngày ngắn gọn
    const [yearSel, monthSel] = (month || '').split('-').map(Number);

    // Render từng kho (ưu tiên 4 kho chính, sau đó thêm các kho khác nếu có)
    const preferredOrder = ['Hải Dương', 'Hải Phòng', 'Hưng Yên', 'Thái Bình'];
    const allWarehouses = Object.keys(whMap);
    const warehouseOrder = [...preferredOrder.filter(w => allWarehouses.includes(w)), ...allWarehouses.filter(w => !preferredOrder.includes(w))];
    let html = '';

    warehouseOrder.forEach(wh => {
        const empObj = whMap[wh];
        if (!empObj) return;

        const empList = Object.values(empObj).map(e => {
            const uniqueDays = e.days.size;
            const rate = daysElapsed > 0 ? Math.round((uniqueDays / daysElapsed) * 100) : 0;

            // Tính ngày KHÔNG báo cáo = tất cả ngày trong kỳ - ngày đã báo
            const missingDates = allDatesInCycle.filter(d => !e.days.has(d));
            // Format ngắn: "3/5, 6/5, 8/5" (ngày/tháng)
            const missingShort = missingDates.map(d => {
                const p = d.match(/(\d{1,2})\/(\d{1,2})/);
                return p ? `${parseInt(p[1])}/${parseInt(p[2])}` : d;
            });

            return { ...e, uniqueDays, rate, missingDates: missingShort };
        });

        // Sắp xếp theo % giảm dần
        empList.sort((a, b) => b.rate - a.rate || b.uniqueDays - a.uniqueDays);

        html += `
        <div class="ranking-card" id="ranking-wh-${wh.replace(/\s+/g, '-')}" style="grid-column: 1 / -1;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3>🏢 Kho ${escapeHtml(wh)} <span style="font-weight:400;color:var(--text-muted);font-size:13px;">(${empList.length} NV · ${daysElapsed} ngày)</span></h3>
                <button class="btn btn-primary" onclick="sendWarehouseRankingTelegram('${wh}', event)" style="padding:4px 10px; font-size:11px;">
                    📤 Gửi lên Telegram
                </button>
            </div>
            <table style="width:100%;">
                <thead><tr>
                    <th style="width:40px;">#</th>
                    <th>Họ và tên</th>
                    <th style="width:80px;">Mã NV</th>
                    <th style="width:120px;">Biển số xe</th>
                    <th style="width:80px;">Số ngày ODO</th>
                    <th style="width:160px;">% Hoàn thành</th>
                    <th>Ngày không báo cáo</th>
                </tr></thead>
                <tbody>
                    ${empList.map((e, i) => {
                        const pct = Math.min(e.rate, 100);
                        const color = pct >= 80 ? 'var(--success)' : pct >= 50 ? '#f0ad4e' : 'var(--danger)';
                        const missingHtml = e.missingDates.length > 0
                            ? `<span style="color:var(--danger);font-size:12px;">${e.missingDates.join(', ')}</span>`
                            : '<span style="color:var(--success);font-size:12px;">✅ Đủ</span>';
                        return `<tr>
                            <td>${i + 1}</td>
                            <td style="font-weight:600;">${escapeHtml(e.name)}</td>
                            <td>${e.code || '—'}</td>
                            <td style="font-family:monospace;font-weight:600;">${escapeHtml(e.plate || '—')}</td>
                            <td style="text-align:center;">${e.uniqueDays}/${daysElapsed}</td>
                            <td>
                                <div style="display:flex;align-items:center;gap:8px;">
                                    <div class="progress-bar-container" style="flex:1;margin:0;">
                                        <div class="progress-bar-fill" style="width:${pct}%;background:${color};"></div>
                                    </div>
                                    <span style="font-weight:700;color:${color};min-width:42px;text-align:right;">${pct}%</span>
                                </div>
                            </td>
                            <td>${missingHtml}</td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>`;
    });

    grid.innerHTML = html;
    grid.style.gridTemplateColumns = '1fr'; // 1 cột dọc
}

// ====== RENDER CẢNH BÁO GIAN LẬN ======
function renderFraudWarnings(filtered) {
    const container = document.getElementById('fraudTableContainer');

    // Phát hiện gian lận: Km > 200 hoặc Tăng ca > 3 tiếng (180 phút)
    const fraudEntries = [];
    filtered.forEach(e => {
        const km = parseInt(e.kmEnd) - parseInt(e.kmStart);
        const reasons = [];

        // Kiểm tra Km > 200
        if (!isNaN(km) && km > 200) {
            reasons.push({ type: 'km', value: km });
        }

        // Kiểm tra Km âm (gõ sai ODO)
        if (!isNaN(km) && km < 0) {
            reasons.push({ type: 'km_neg', value: km });
        }

        // Kiểm tra Tăng ca > 3 tiếng
        if (e.hourEnd) {
            const timeStr = e.hourEnd.replace(/h/gi, ':');
            const timeParts = timeStr.match(/(\d{1,2}):(\d{2})/);
            if (timeParts) {
                let hours = parseInt(timeParts[1]);
                const mins = parseInt(timeParts[2]);
                if (/PM/i.test(timeStr) && hours < 12) hours += 12;
                if (/AM/i.test(timeStr) && hours === 12) hours = 0;
                const totalMinutes = hours * 60 + mins;
                const shiftEnd = 19 * 60;
                if (totalMinutes > shiftEnd) {
                    const otMinutes = totalMinutes - shiftEnd;
                    if (otMinutes > 180) {
                        const otH = Math.floor(otMinutes / 60);
                        const otM = otMinutes % 60;
                        reasons.push({ type: 'ot', value: otMinutes, display: `${otH}h${otM > 0 ? String(otM).padStart(2,'0') : ''}` });
                    }
                }
            }
        }

        if (reasons.length > 0) {
            fraudEntries.push({ entry: e, reasons, km: isNaN(km) ? null : km });
        }
    });

    // Cập nhật badge
    document.getElementById('fraudBadge').textContent = fraudEntries.length;
    document.getElementById('fraudCount').textContent = fraudEntries.length + ' trường hợp';

    if (fraudEntries.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="icon">✅</div><p>Không phát hiện gian lận nào trong kỳ này. Tất cả dữ liệu Km và giờ tăng ca đều trong ngưỡng cho phép.</p></div>';
        return;
    }

    const sheetBaseUrl = `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_EMPLOYEE_ID}/edit?gid=${CONFIG.SHEET_EMPLOYEE_GID}#gid=${CONFIG.SHEET_EMPLOYEE_GID}`;

    let html = `<table>
        <thead><tr>
            <th>#</th>
            <th>Ngày</th>
            <th>Họ và tên</th>
            <th>Mã NV</th>
            <th>Biển số</th>
            <th>Kho</th>
            <th>Giờ đi</th>
            <th>Giờ về</th>
            <th>Tăng ca</th>
            <th>ODO Đi</th>
            <th>ODO Về</th>
            <th>Km</th>
            <th>Lý do cảnh báo</th>
            <th>Sửa</th>
        </tr></thead>
        <tbody>`;

    fraudEntries.forEach((f, i) => {
        const e = f.entry;
        const kmDisplay = f.km !== null ? f.km.toLocaleString() : '—';

        // Tính tăng ca hiển thị
        let otDisplay = '—';
        if (e.hourEnd) {
            const timeStr = e.hourEnd.replace(/h/gi, ':');
            const timeParts = timeStr.match(/(\d{1,2}):(\d{2})/);
            if (timeParts) {
                let hours = parseInt(timeParts[1]);
                const mins = parseInt(timeParts[2]);
                if (/PM/i.test(timeStr) && hours < 12) hours += 12;
                if (/AM/i.test(timeStr) && hours === 12) hours = 0;
                const totalMinutes = hours * 60 + mins;
                const shiftEnd = 19 * 60;
                if (totalMinutes > shiftEnd) {
                    const otMin = totalMinutes - shiftEnd;
                    const otH = Math.floor(otMin / 60);
                    const otM = otMin % 60;
                    otDisplay = otH > 0 ? `${otH}h${otM > 0 ? String(otM).padStart(2,'0') : ''}` : `${otM}p`;
                }
            }
        }

        // Render lý do cảnh báo
        const reasonBadges = f.reasons.map(r => {
            if (r.type === 'km') return `<span class="badge badge-danger">🔴 Km: ${r.value}</span>`;
            if (r.type === 'km_neg') return `<span class="badge badge-danger">⚠️ Km âm: ${r.value} (gõ sai!)</span>`;
            if (r.type === 'ot') return `<span class="badge badge-danger">🔴 TC: ${r.display}</span>`;
            return '';
        }).join(' ');

        const editLink = e.sheetRow
            ? `<a href="${sheetBaseUrl}&range=A${e.sheetRow}" target="_blank" style="color:var(--primary);text-decoration:underline;font-size:12px;">Dòng ${e.sheetRow}</a>`
            : '';

        // Tính otMinutes để tô màu
        let fraudOtMins = 0;
        if (e.hourEnd) {
            const ts2 = e.hourEnd.replace(/h/gi, ':');
            const tp2 = ts2.match(/(\d{1,2}):(\d{2})/);
            if (tp2) {
                let h2 = parseInt(tp2[1]);
                const m2 = parseInt(tp2[2]);
                if (/PM/i.test(ts2) && h2 < 12) h2 += 12;
                if (/AM/i.test(ts2) && h2 === 12) h2 = 0;
                const tot2 = h2 * 60 + m2;
                if (tot2 > 19 * 60) fraudOtMins = tot2 - 19 * 60;
            }
        }
        const otColor = fraudOtMins > 180 ? 'var(--danger)' : fraudOtMins > 120 ? '#f0ad4e' : 'var(--success)';

        html += `<tr>
            <td>${i + 1}</td>
            <td style="white-space:nowrap;font-weight:600;">${escapeHtml(e.dateStr)}</td>
            <td style="font-weight:600;">${escapeHtml(e.name)}</td>
            <td><span class="badge badge-info">${escapeHtml(e.code) || '—'}</span></td>
            <td style="font-family:monospace;font-weight:600;">${escapeHtml(e.plate)}</td>
            <td><span class="badge badge-info">${escapeHtml(e.shortWH)}</span></td>
            <td style="font-family:monospace;">${escapeHtml(e.hourStart || '—')}</td>
            <td style="font-family:monospace;">${escapeHtml(e.hourEnd || '—')}</td>
            <td style="font-weight:700;color:${otColor};">${escapeHtml(otDisplay)}</td>
            <td style="font-family:monospace;">${escapeHtml(String(e.kmStart))}</td>
            <td style="font-family:monospace;">${escapeHtml(String(e.kmEnd))}</td>
            <td style="font-weight:700;color:${f.km < 0 || f.km > 200 ? 'var(--danger)' : 'var(--success)'};">${escapeHtml(String(kmDisplay))}</td>
            <td>${reasonBadges}</td>
            <td>${editLink}</td>
        </tr>`;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

// ====== RENDER CẢNH BÁO GÕ SAI ======
function renderTypoWarnings(month) {
    const container = document.getElementById('typoTableContainer');
    // Chỉ lấy dữ liệu trong kỳ đối soát hiện tại
    const cycleData = month
        ? employeeData.filter(e => e.dateObj && isInCycle(e.dateObj, month))
        : employeeData;
    const { typos, plateTypos, masterMismatches } = detectTypos(cycleData);

    const totalIssues = typos.length + plateTypos.length + masterMismatches.length;
    document.getElementById('typoBadge').textContent = totalIssues;
    document.getElementById('typoCount').textContent = totalIssues + ' lỗi';

    if (totalIssues === 0) {
        container.innerHTML = '<div class="empty-state"><div class="icon">✅</div><p>Không phát hiện lỗi gõ sai nào. Tất cả tên, mã NV và biển số đều nhất quán.</p></div>';
        return;
    }

    const sheetBaseUrl = `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_EMPLOYEE_ID}/edit?gid=${CONFIG.SHEET_EMPLOYEE_GID}#gid=${CONFIG.SHEET_EMPLOYEE_GID}`;

    let html = '';

    // Bảng 1: Sai tên / mã NV (so sánh tần suất nội bộ)
    if (typos.length > 0) {
        html += `<h4 style="margin:0 0 8px;color:var(--danger);">🔤 Sai tên / mã nhân viên (${typos.length} lỗi)</h4>`;
        html += `<table style="margin-bottom:24px;"><thead><tr>
            <th style="width:40px;">#</th>
            <th>Đã gõ (SAI)</th>
            <th>Phải là (ĐÚNG)</th>
            <th style="width:60px;">Lần gõ sai</th>
            <th style="width:60px;">Lần đúng</th>
            <th>Kho</th>
            <th>Các ngày gõ sai</th>
            <th style="width:60px;">Sửa</th>
        </tr></thead><tbody>`;

        typos.forEach((t, i) => {
            const wrongName = t.wrong.name + (t.wrong.code ? ' ' + t.wrong.code : '');
            const correctName = t.correct.name + (t.correct.code ? ' ' + t.correct.code : '');
            let wrongHighlighted = escapeHtml(wrongName);

            const dates = t.wrong.entries.map(e => e.dateStr).filter(Boolean)
                .map(d => d.replace(/\/\d{4}$/, ''));
            const rows = t.wrong.entries.map(e => e.sheetRow).filter(Boolean);
            const wh = t.wrong.entries[0]?.shortWH || '';

            const editLinks = rows.map(r =>
                `<a href="${sheetBaseUrl}&range=C${r}" target="_blank" onclick="this.style.color='#666';this.style.opacity='0.5';" style="color:var(--primary);text-decoration:underline;font-size:12px;" title="Mở dòng ${r}">Dòng ${r}</a>`
            ).join(', ');

            html += `<tr>
                <td>${i + 1}</td>
                <td style="color:var(--danger);font-weight:700;">${wrongHighlighted}</td>
                <td style="color:var(--success);font-weight:700;">${escapeHtml(correctName)}</td>
                <td style="text-align:center;font-weight:700;color:var(--danger);">${t.wrong.count}</td>
                <td style="text-align:center;color:var(--success);">${t.correct.count}</td>
                <td>${escapeHtml(wh)}</td>
                <td style="font-size:12px;">${dates.join(', ')}</td>
                <td>${editLinks}</td>
            </tr>`;
        });

        html += '</tbody></table>';
    }

    // Bảng 2: Sai biển số (so với danh sách NCC)
    if (plateTypos.length > 0) {
        html += `<h4 style="margin:0 0 8px;color:#f0ad4e;">🚛 Biển số không có trong NCC (${plateTypos.length} lỗi)</h4>`;
        html += `<p style="color:var(--text-muted);font-size:12px;margin-bottom:8px;">Danh sách NCC là chuẩn. Biển số NV gõ không khớp bất kỳ biển nào trong NCC → nghi gõ sai.</p>`;
        html += `<table style="margin-bottom:24px;"><thead><tr>
            <th style="width:40px;">#</th>
            <th>Biển số NV gõ (SAI)</th>
            <th>Tỉnh</th>
            <th>Gợi ý NCC (ĐÚNG)</th>
            <th>NV đã gõ sai</th>
            <th style="width:60px;">Số lần</th>
            <th>Các ngày</th>
            <th style="width:80px;">Sửa</th>
        </tr></thead><tbody>`;

        plateTypos.forEach((t, i) => {
            const empNames = [...new Set(t.entries.map(e => e.name + (e.code ? ' ' + e.code : '')))];
            const dates = [...new Set(t.entries.map(e => e.dateStr))].filter(Boolean)
                .map(d => d.replace(/\/\d{4}$/, ''));
            const rows = t.entries.map(e => e.sheetRow).filter(Boolean);
            const province = getProvinceFromPlate(t.wrongPlate);

            const editLinks = rows.slice(0, 5).map(r =>
                `<a href="${sheetBaseUrl}&range=J${r}" target="_blank" onclick="this.style.color='#666';this.style.opacity='0.5';" style="color:var(--primary);text-decoration:underline;font-size:12px;">Dòng ${r}</a>`
            ).join(', ') + (rows.length > 5 ? ` +${rows.length - 5}` : '');

            html += `<tr>
                <td>${i + 1}</td>
                <td style="color:var(--danger);font-weight:700;">${escapeHtml(t.wrongPlate)}</td>
                <td style="font-size:12px;white-space:nowrap;">${escapeHtml(province)}</td>
                <td style="color:var(--success);font-weight:700;">${escapeHtml(t.correctPlate)}</td>
                <td style="font-size:12px;">${empNames.map(n => escapeHtml(n)).join(', ')}</td>
                <td style="text-align:center;font-weight:700;color:var(--danger);">${t.count}</td>
                <td style="font-size:12px;">${dates.join(', ')}</td>
                <td>${editLinks}</td>
            </tr>`;
        });

        html += '</tbody></table>';
    }

    // Bảng 3: Lệch so với danh sách NV chuẩn (Master)
    if (masterMismatches.length > 0) {
        html += `<h4 style="margin:0 0 8px;color:#e67e22;">📋 Lệch so với danh sách NV chuẩn (${masterMismatches.length} lỗi)</h4>`;
        html += `<p style="color:var(--text-muted);font-size:12px;margin-bottom:8px;">So sánh tên + mã NV trong báo cáo ODO với file danh sách NV chuẩn. Nếu khác → NV gõ sai.</p>`;
        html += `<table style="margin-bottom:24px;"><thead><tr>
            <th style="width:40px;">#</th>
            <th>Báo cáo gõ</th>
            <th>Danh sách chuẩn</th>
            <th>Loại lỗi</th>
            <th style="width:60px;">Số lần</th>
            <th style="width:80px;">Sửa</th>
        </tr></thead><tbody>`;

        masterMismatches.forEach((mm, i) => {
            const reportedStr = mm.reported.name + ' ' + mm.reported.code;
            const masterStr = mm.master.name + ' ' + mm.master.code;
            const typeLabel = mm.type === 'name' ? '❌ Sai tên' : '❌ Sai mã NV';

            const rows = mm.reported.entries.map(e => e.sheetRow).filter(Boolean);
            const editLinks = rows.slice(0, 5).map(r =>
                `<a href="${sheetBaseUrl}&range=C${r}" target="_blank" onclick="this.style.color='#666';this.style.opacity='0.5';" style="color:var(--primary);text-decoration:underline;font-size:12px;">Dòng ${r}</a>`
            ).join(', ') + (rows.length > 5 ? ` +${rows.length - 5}` : '');

            html += `<tr>
                <td>${i + 1}</td>
                <td style="color:var(--danger);font-weight:700;">${escapeHtml(reportedStr)}</td>
                <td style="color:var(--success);font-weight:700;">${escapeHtml(masterStr)}</td>
                <td><span class="badge badge-warning">${typeLabel}</span></td>
                <td style="text-align:center;font-weight:700;">${mm.reported.count}</td>
                <td>${editLinks}</td>
            </tr>`;
        });

        html += '</tbody></table>';
    }

    // Bảng 4: ODO gõ sai (Km âm)
    const odoErrors = cycleData.filter(e => {
        const km = parseInt(e.kmEnd) - parseInt(e.kmStart);
        return !isNaN(km) && km < 0;
    });

    if (odoErrors.length > 0) {
        // Cập nhật tổng số lỗi
        const newTotal = totalIssues + odoErrors.length;
        document.getElementById('typoBadge').textContent = newTotal;
        document.getElementById('typoCount').textContent = newTotal + ' lỗi';

        html += `<h4 style="margin:0 0 8px;color:var(--danger);">⚠️ ODO gõ sai — Km âm (${odoErrors.length} lỗi)</h4>`;
        html += `<p style="color:var(--text-muted);font-size:12px;margin-bottom:8px;">ODO Về nhỏ hơn ODO Đi → Km âm. Nhân viên gõ sai số ODO, cần sửa lại trên Google Sheet.</p>`;
        html += `<table style="margin-bottom:24px;"><thead><tr>
            <th style="width:40px;">#</th>
            <th>Ngày</th>
            <th>Họ và tên</th>
            <th>Mã NV</th>
            <th>Biển số</th>
            <th>Kho</th>
            <th>ODO Đi</th>
            <th>ODO Về</th>
            <th>Km</th>
            <th style="width:80px;">Sửa</th>
        </tr></thead><tbody>`;

        odoErrors.forEach((e, i) => {
            const km = parseInt(e.kmEnd) - parseInt(e.kmStart);
            const editLink = `<a href="${sheetBaseUrl}&range=H${e.sheetRow}" target="_blank" onclick="this.style.color='#666';this.style.opacity='0.5';" style="color:var(--primary);text-decoration:underline;font-size:12px;">Dòng ${e.sheetRow}</a>`;

            html += `<tr>
                <td>${i + 1}</td>
                <td style="white-space:nowrap;font-weight:600;">${e.dateStr}</td>
                <td style="font-weight:600;">${escapeHtml(e.name)}</td>
                <td><span class="badge badge-info">${e.code || '—'}</span></td>
                <td style="font-family:monospace;">${escapeHtml(e.plate)}</td>
                <td>${escapeHtml(e.shortWH)}</td>
                <td style="font-family:monospace;">${e.kmStart}</td>
                <td style="font-family:monospace;">${e.kmEnd}</td>
                <td style="font-weight:700;color:var(--danger);">⚠️ ${km.toLocaleString()}</td>
                <td>${editLink}</td>
            </tr>`;
        });

        html += '</tbody></table>';
    }

    container.innerHTML = html;
}

// ====== RATE LIMITING ======
let lastTelegramSend = 0;
const TELEGRAM_COOLDOWN = 60000; // 60 giây
function checkTelegramCooldown() {
    const now = Date.now();
    const elapsed = now - lastTelegramSend;
    if (elapsed < TELEGRAM_COOLDOWN) {
        const remaining = Math.ceil((TELEGRAM_COOLDOWN - elapsed) / 1000);
        showToast('⏳', `Vui lòng đợi ${remaining}s trước khi gửi tiếp`);
        return false;
    }
    lastTelegramSend = now;
    return true;
}

// ====== HELPER: GỬI TEXT QUA PROXY (đáng tin cậy) ======
async function sendTextViaProxy(text) {
    const response = await fetch(CONFIG.TELEGRAM_PROXY_URL, {
        method: 'POST',
        redirect: 'follow',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'sendMessage', text: text }),
    });
    try {
        return await response.json();
    } catch (e) {
        return { ok: true, message: 'Sent' };
    }
}

// ====== XÁC THỰC QUẢN TRỊ VIÊN ======
const ADMIN_PASS = 'admin123'; // Mật khẩu bảo vệ nút gửi
function requireAdmin() {
    let key = localStorage.getItem('odo_admin_key');
    if (key === ADMIN_PASS) return true;
    
    key = prompt('Vui lòng nhập mật khẩu quản trị để gửi báo cáo lên Telegram:');
    if (key === ADMIN_PASS) {
        localStorage.setItem('odo_admin_key', key);
        return true;
    } else if (key !== null) {
        alert('❌ Sai mật khẩu! Bạn không có quyền gửi báo cáo.');
    }
    return false;
}

// ====== HELPER: GỬI ẢNH QUA PROXY (fallback text nếu thất bại) ======
async function sendPhotoViaProxy(canvas, caption, chatId) {
    // Chuyển sang JPEG quality 0.5 để giảm dung lượng
    const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
    const base64 = dataUrl.replace(/^data:image\/jpeg;base64,/, '');
    const sizeKB = Math.round(base64.length / 1024);
    console.log('📤 Image size:', sizeKB, 'KB');

    try {
        const payload = JSON.stringify({
            action: 'sendPhoto',
            image: base64,
            caption: caption,
            chat_id: chatId
        });

        const response = await fetch(CONFIG.TELEGRAM_PROXY_URL, {
            method: 'POST',
            redirect: 'follow',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: payload,
        });

        const result = await response.json();
        console.log('📤 Proxy response:', result);
        if (result.ok) return result;
        throw new Error(result.message || 'Image send failed');
    } catch (err) {
        // Ảnh thất bại → gửi text thay thế
        console.warn('📤 Image failed, sending text fallback:', err.message);
        const textResult = await sendTextViaProxy(caption + '\n\n📊 (Ảnh không gửi được qua proxy, gửi text thay thế)');
        return { ok: textResult.ok, message: 'Sent as text', fallback: true };
    }
}

// ====== GỬI BÁO CÁO TELEGRAM (HÌNH ẢNH) ======
async function sendTelegramReport(evt) {
    if (!requireAdmin()) return;
    const btn = evt ? evt.target.closest('.btn') : document.querySelector('.btn[onclick*="sendTelegramReport"]');
    btn.disabled = true;
    btn.innerHTML = '⏳ Đang chụp hình...';
    if (!checkTelegramCooldown()) { btn.disabled = false; btn.innerHTML = '📤 Gửi báo cáo Telegram'; return; }

    try {
        const month = document.getElementById('filterMonth').value;
        const cycle = getCycleRange(month);
        const cycleStr = `${String(cycle.start.getDate()).padStart(2,'0')}/${String(cycle.start.getMonth()+1).padStart(2,'0')} → ${String(cycle.end.getDate()).padStart(2,'0')}/${String(cycle.end.getMonth()+1).padStart(2,'0')}/${cycle.end.getFullYear()}`;
        const timeStr = new Date().toLocaleString('vi-VN');

        const whList = ['Hải Dương', 'Hải Phòng', 'Hưng Yên', 'Thái Bình'];
        const filterSelect = document.getElementById('filterWarehouse');
        const originalWh = filterSelect.value;
        
        let photosSent = 0;

        for (const wh of whList) {
            const groupConf = TELEGRAM_GROUPS[wh];
            if (!groupConf) continue;
            
            // Lọc dữ liệu cho kho này và render lại
            filterSelect.value = wh;
            renderAll();
            await new Promise(r => setTimeout(r, 400));
            
            // ═══════════════════════════════════════
            // ẢNH 1: DANH SÁCH NV (Ranking) CỦA KHO NÀY
            // ═══════════════════════════════════════
            const rankingTab = document.querySelector('.tab[onclick*="ranking"]');
            if (rankingTab) switchTab('ranking', rankingTab);
            await new Promise(r => setTimeout(r, 400));

            const grid = document.getElementById('rankingGrid');
            btn.innerHTML = `⏳ Chụp NV ${wh}...`;
            const canvas1 = await html2canvas(grid, {
                backgroundColor: '#080d0f',
                scale: 2,
                useCORS: true,
                logging: false
            });

            btn.innerHTML = `⏳ Gửi NV ${wh}...`;
            const caption1 = `📊 Báo cáo ODO - Kho ${wh}\n📅 Kỳ ${cycleStr}\n🕐 ${timeStr}\n🏭 Dashboard GHN ODO\n👤 Quản lý: ${groupConf.tag}`;
            await sendPhotoViaProxy(canvas1, caption1, groupConf.chatId);
            photosSent++;

            // ═══════════════════════════════════════
            // ẢNH 2: CẢNH BÁO GIAN LẬN CỦA KHO NÀY (nếu có)
            // ═══════════════════════════════════════
            const fraudCount = parseInt(document.getElementById('fraudBadge').textContent) || 0;
            if (fraudCount > 0) {
                const fraudTab = document.querySelector('.tab[onclick*="fraud"]');
                if (fraudTab) switchTab('fraud', fraudTab);
                await new Promise(r => setTimeout(r, 400));

                const fraudContainer = document.getElementById('fraudTableContainer');
                btn.innerHTML = `⏳ Chụp gian lận ${wh}...`;
                const canvas2 = await html2canvas(fraudContainer, {
                    backgroundColor: '#080d0f',
                    scale: 2,
                    useCORS: true,
                    logging: false
                });

                btn.innerHTML = `⏳ Gửi gian lận ${wh}...`;
                const caption2 = `🚨 CẢNH BÁO GIAN LẬN - KHO ${wh.toUpperCase()}\n⚠️ ${fraudCount} trường hợp cần kiểm tra\n🔴 Km > 200 hoặc Tăng ca > 3 tiếng\n🕒 ${timeStr}\n👤 Quản lý: ${groupConf.tag}`;
                await sendPhotoViaProxy(canvas2, caption2, groupConf.chatId);
                photosSent++;
            }
        }
        
        // Khôi phục filter cũ
        filterSelect.value = originalWh;
        renderAll();
        
        const rankingTab = document.querySelector('.tab[onclick*="ranking"]');
        if (rankingTab) switchTab('ranking', rankingTab);

        showToast('✅', `Đã gửi tổng cộng ${photosSent} ảnh báo cáo vào 4 nhóm Telegram!`);
    } catch (err) {
        console.error('Telegram error:', err);
        showToast('❌', 'Lỗi gửi Telegram. Vui lòng thử lại.');
    }

    btn.disabled = false;
    btn.innerHTML = '📤 Gửi báo cáo Telegram';
}

// ====== GỬI CẢNH BÁO GIAN LẬN TELEGRAM (HÌNH ẢNH) ======
async function sendFraudTelegram(evt) {
    if (!requireAdmin()) return;
    const btn = evt.target.closest('.btn');
    btn.disabled = true;
    btn.innerHTML = '⏳ Đang chụp hình...';
    if (!checkTelegramCooldown()) { btn.disabled = false; btn.innerHTML = '📤 Gửi lên Telegram'; return; }

    try {
        const month = document.getElementById('filterMonth').value;
        const cycle = getCycleRange(month);
        const cycleStr = `${String(cycle.start.getDate()).padStart(2,'0')}/${String(cycle.start.getMonth()+1).padStart(2,'0')} → ${String(cycle.end.getDate()).padStart(2,'0')}/${String(cycle.end.getMonth()+1).padStart(2,'0')}/${cycle.end.getFullYear()}`;
        const timeStr = new Date().toLocaleString('vi-VN');

        const whList = ['Hải Dương', 'Hải Phòng', 'Hưng Yên', 'Thái Bình'];
        const filterSelect = document.getElementById('filterWarehouse');
        const originalWh = filterSelect.value;
        
        let photosSent = 0;

        const fraudTab = document.querySelector('.tab[onclick*="fraud"]');
        if (fraudTab) switchTab('fraud', fraudTab);
        
        for (const wh of whList) {
            const groupConf = TELEGRAM_GROUPS[wh];
            if (!groupConf) continue;
            
            // Lọc gian lận cho kho này
            filterSelect.value = wh;
            renderAll();
            await new Promise(r => setTimeout(r, 400));
            
            const fraudCount = parseInt(document.getElementById('fraudBadge').textContent) || 0;
            if (fraudCount === 0) continue; // Bỏ qua nếu kho này không có gian lận

            const fraudContainer = document.getElementById('fraudTableContainer');
            btn.innerHTML = `⏳ Chụp gian lận ${wh}...`;
            const canvas = await html2canvas(fraudContainer, {
                backgroundColor: '#080d0f',
                scale: 2,
                useCORS: true,
                logging: false
            });

            btn.innerHTML = `⏳ Gửi gian lận ${wh}...`;
            const caption = `🚨 CẢNH BÁO GIAN LẬN - KHO ${wh.toUpperCase()}\n⚠️ ${fraudCount} trường hợp cần kiểm tra\n🔴 Km > 200 hoặc Tăng ca > 3 tiếng\n🕒 ${timeStr}\n👤 Quản lý: ${groupConf.tag}`;
            await sendPhotoViaProxy(canvas, caption, groupConf.chatId);
            photosSent++;
        }
        
        // Khôi phục filter cũ
        filterSelect.value = originalWh;
        renderAll();

        if (photosSent > 0) {
            showToast('✅', `Đã gửi ${photosSent} ảnh cảnh báo gian lận vào các nhóm Telegram!`);
        } else {
            showToast('✅', 'Không có gian lận nào để gửi.');
        }
    } catch (err) {
        console.error('Telegram fraud error:', err);
        showToast('❌', 'Lỗi gửi Telegram. Vui lòng thử lại.');
    }

    btn.disabled = false;
    btn.innerHTML = '📤 Gửi lên Telegram';
}

// ====== GỬI RIÊNG 1 KHO Ở TAB DANH SÁCH NV (RANKING) ======
async function sendWarehouseRankingTelegram(whName, evt) {
    if (!requireAdmin()) return;
    const btn = evt.target.closest('.btn');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '⏳ Đang chụp...';
    if (!checkTelegramCooldown()) { btn.disabled = false; btn.innerHTML = originalText; return; }

    try {
        const groupConf = TELEGRAM_GROUPS[whName];
        if (!groupConf) throw new Error('Không tìm thấy cấu hình kho ' + whName);

        const month = document.getElementById('filterMonth').value;
        const cycle = getCycleRange(month);
        const cycleStr = `${String(cycle.start.getDate()).padStart(2,'0')}/${String(cycle.start.getMonth()+1).padStart(2,'0')} → ${String(cycle.end.getDate()).padStart(2,'0')}/${String(cycle.end.getMonth()+1).padStart(2,'0')}/${cycle.end.getFullYear()}`;
        
        // Tìm element block kho này
        const blockId = `ranking-wh-${whName.replace(/\s+/g, '-')}`;
        const whBlock = document.getElementById(blockId);
        if (!whBlock) throw new Error('Không tìm thấy giao diện kho ' + whName);

        // Ẩn nút gửi trước khi chụp
        btn.style.display = 'none';

        const canvas = await html2canvas(whBlock, {
            backgroundColor: '#080d0f',
            scale: 2,
            useCORS: true,
            logging: false
        });

        // Hiện lại nút
        btn.style.display = '';

        btn.innerHTML = '⏳ Đang gửi...';
        const caption = `👤 DANH SÁCH NHÂN VIÊN - KHO ${whName.toUpperCase()}\n📅 Kỳ ${cycleStr}\n🕐 ${new Date().toLocaleString('vi-VN')}\n👤 Quản lý: ${groupConf.tag}`;

        await sendPhotoViaProxy(canvas, caption, groupConf.chatId);
        showToast('✅', `Đã gửi danh sách NV Kho ${whName} vào Telegram!`);
    } catch (err) {
        console.error('Telegram ranking error:', err);
        showToast('❌', 'Lỗi gửi Telegram. Vui lòng thử lại.');
    }

    btn.disabled = false;
    btn.innerHTML = originalText;
}

// ====== CHUYỂN TAB ======
function switchTab(tab, el) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');

    document.getElementById('tabDaily').style.display = tab === 'daily' ? '' : 'none';
    document.getElementById('tabRanking').style.display = tab === 'ranking' ? '' : 'none';
    document.getElementById('tabFraud').style.display = tab === 'fraud' ? '' : 'none';
    document.getElementById('tabTypo').style.display = tab === 'typo' ? '' : 'none';
}

// ====== TỰ ĐỘNG REFRESH MỖI 30 PHÚT ======
function startAutoRefresh() {
    if (refreshTimer) clearInterval(refreshTimer);
    if (countdownTimer) clearInterval(countdownTimer);

    nextRefreshTime = Date.now() + CONFIG.REFRESH_INTERVAL;

    refreshTimer = setInterval(() => {
        loadAllData();
        nextRefreshTime = Date.now() + CONFIG.REFRESH_INTERVAL;
    }, CONFIG.REFRESH_INTERVAL);

    countdownTimer = setInterval(() => {
        const remaining = Math.max(0, nextRefreshTime - Date.now());
        const mins = Math.floor(remaining / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        document.getElementById('countdown').textContent =
            `Tự refresh sau: ${mins}p ${secs}s`;
    }, 1000);

    // ====== TỰ ĐỘNG GỬI BÁO CÁO TELEGRAM LÚC 10H SÁNG ======
    startAutoTelegramReport();
}

let autoReportTimer = null;
function startAutoTelegramReport() {
    if (autoReportTimer) clearInterval(autoReportTimer);

    // Kiểm tra mỗi 30 giây
    autoReportTimer = setInterval(() => {
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const todayKey = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;

        // Gửi lúc 10:00 (cho phép trong khoảng 10:00 - 10:01)
        if (hour === 10 && minute === 0) {
            const lastSent = localStorage.getItem('lastAutoReport');
            if (lastSent === todayKey) return; // Đã gửi hôm nay rồi

            localStorage.setItem('lastAutoReport', todayKey);
            console.log('🕐 10:00 AM - Tự động gửi báo cáo Telegram...');
            showToast('🕐', 'Đang tự động gửi báo cáo 10h sáng...');

            // Giả lập click nút gửi
            const btn = document.querySelector('.btn[onclick*="sendTelegramReport"]');
            if (btn) btn.click();
        }
    }, 30000); // Kiểm tra mỗi 30 giây
}

// ====== TIỆN ÍCH ======
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Tra tỉnh từ mã biển số xe
function getProvinceFromPlate(plate) {
    if (!plate) return '—';
    const code = String(plate).replace(/[^0-9A-Za-z]/g, '').substring(0, 2);
    const map = {
        '11':'Cao Bằng','12':'Lạng Sơn','14':'Quảng Ninh','15':'Hải Phòng',
        '16':'Hải Phòng','17':'Thái Bình','18':'Nam Định','19':'Phú Thọ',
        '20':'Thái Nguyên','21':'Yên Bái','22':'Tuyên Quang','23':'Hà Giang',
        '24':'Lào Cai','25':'Lai Châu','26':'Sơn La','27':'Điện Biên',
        '28':'Hòa Bình','29':'Hà Nội','30':'Hà Nội','31':'Hà Nội',
        '32':'Hà Nội','33':'Hà Nội','34':'Hải Dương','35':'Ninh Bình',
        '36':'Thanh Hóa','37':'Nghệ An','38':'Hà Tĩnh','39':'Đồng Nai',
        '40':'Hà Nội','41':'Hà Nội','43':'Đà Nẵng','47':'Đắk Lắk',
        '48':'Đắk Nông','49':'Lâm Đồng','50':'TP.HCM','51':'TP.HCM',
        '52':'TP.HCM','53':'TP.HCM','54':'TP.HCM','55':'TP.HCM',
        '56':'TP.HCM','57':'TP.HCM','58':'TP.HCM','59':'TP.HCM',
        '60':'Đồng Nai','61':'Bình Dương','62':'Long An','63':'Tiền Giang',
        '64':'Vĩnh Long','65':'Cần Thơ','66':'Đồng Tháp','67':'An Giang',
        '68':'Kiên Giang','69':'Cà Mau','70':'Tây Ninh','71':'Bến Tre',
        '72':'Bà Rịa-VT','73':'Quảng Bình','74':'Quảng Trị','75':'TT-Huế',
        '76':'Quảng Ngãi','77':'Bình Định','78':'Phú Yên','79':'Khánh Hòa',
        '81':'Gia Lai','82':'Kon Tum','83':'Sóc Trăng','84':'Trà Vinh',
        '85':'Ninh Thuận','86':'Bình Thuận','88':'Vĩnh Phúc','89':'Hưng Yên',
        '90':'Hà Nam','92':'Quảng Nam','93':'Bình Phước','94':'Bạc Liêu',
        '95':'Hậu Giang','97':'Bắc Kạn','98':'Bắc Giang','99':'Bắc Ninh',
    };
    return map[code] || '—';
}

function showLoading(show) {
    const el = document.getElementById('loadingDaily');
    if (el) el.style.display = show ? 'flex' : 'none';
    const el2 = document.getElementById('loadingRecon');
    if (el2) el2.style.display = show ? 'flex' : 'none';
}

function showToast(icon, msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toastIcon').textContent = icon;
    document.getElementById('toastMsg').textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
}
