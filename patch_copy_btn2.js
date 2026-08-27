const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const btnHtml = `<button class="btn btn-primary" onclick="copyThcpAC()" style="padding:6px 14px;font-size:13px;background:#10b981;border-color:#10b981;" title="Copy toàn bộ mã chuyến đi đã ghép để dán thẳng vào cột AC của file THCP">📋 Copy cột AC (THCP)</button>`;

const targetHtml = `<select id="filterNccStatus"`;

const copyFunc = `
// ==========================================
// COPY CỘT AC CHO FILE THCP
// ==========================================
function copyThcpAC() {
    if (typeof nccTripData === 'undefined' || !nccTripData || nccTripData.length === 0) {
        showToast('error', 'Chưa có dữ liệu, vui lòng đợi tải xong!');
        return;
    }
    
    // Lọc các dòng thuộc file THCP
    const thcpTrips = nccTripData.filter(r => String(r.sheetId || '') === '1tATkbxYOtiBuJC1GRto3QI81q_fkGzKYylufz4WtuAA');
    if (thcpTrips.length === 0) {
        showToast('error', 'Không tìm thấy dữ liệu của file THCP!');
        return;
    }
    
    let maxRow = 0;
    thcpTrips.forEach(r => {
        if (r.sourceRow > maxRow) maxRow = r.sourceRow;
    });
    
    // Mảng chứa dữ liệu cột AC, mặc định rỗng
    const colData = new Array(maxRow + 1).fill('');
    
    thcpTrips.forEach(r => {
        let code = r.ghnTripCode || '';
        if (code === 'NCC OFF' || code === 'GHN OFF' || code === 'Phạt') {
            // Giữ nguyên trạng thái để paste vào sheet
        }
        colData[r.sourceRow] = code;
    });
    
    // Data thật bắt đầu từ sheet row 4 (tức là sourceRow = 3)
    // Cắt mảng từ index 3 đến hết
    const copyArr = colData.slice(3);
    const textToCopy = copyArr.join('\\n');
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert('✅ Đã copy ' + copyArr.length + ' dòng!\\n\\nBây giờ hãy:\\n1. Mở file THCP\\n2. Click chuột vào ô đầu tiên của cột AC (ô AC4)\\n3. Ấn Ctrl+V để dán toàn bộ dữ liệu.');
    }).catch(err => {
        alert('Lỗi copy: ' + err);
    });
}
`;

if (code.includes('id="filterNccStatus"')) {
    code = code.replace(targetHtml, btnHtml + '\n' + targetHtml);
    
    const targetScript = 'function renderNccTrip() {';
    code = code.replace(targetScript, copyFunc + '\n' + targetScript);
    
    fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
    console.log('Patched copy button successfully');
} else {
    console.log('Could not find target html');
}
