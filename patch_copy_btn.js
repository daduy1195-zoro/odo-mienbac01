const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const btnHtml = `<button onclick="copyThcpAC()" style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: bold; margin-left: auto; box-shadow: 0 2px 4px rgba(0,0,0,0.2);" title="Copy toàn bộ mã chuyến đi đã ghép để dán thẳng vào cột AC của file THCP">📋 Copy cột AC (THCP)</button>`;

const targetHtml = `<select id="nccTripNccFilter" onchange="renderNccTrip()" style="background:var(--bg-secondary);color:var(--text);border:1px solid var(--border);padding:6px 12px;border-radius:6px;font-size:13px;">
                <option value="ALL">🏢 Tất cả NCC</option>`;

const copyFunc = `
// ==========================================
// COPY CỘT AC CHO FILE THCP
// ==========================================
function copyThcpAC() {
    if (!nccTripData || nccTripData.length === 0) {
        showToast('error', 'Chưa có dữ liệu, vui lòng đợi tải xong!');
        return;
    }
    
    // Lọc các dòng thuộc file THCP
    const thcpTrips = nccTripData.filter(r => r.sheetId === '1tATkbxYOtiBuJC1GRto3QI81q_fkGzKYylufz4WtuAA');
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
            // Có thể giữ nguyên chữ OFF để user biết
        }
        colData[r.sourceRow] = code;
    });
    
    // Data thật bắt đầu từ sheet row 4 (tức là sourceRow = 3)
    // Cắt mảng từ index 3 đến hết
    const copyArr = colData.slice(3);
    const textToCopy = copyArr.join('\\n');
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert('✅ Đã copy ' + copyArr.length + ' dòng!\\n\\nBây giờ hãy:\\n1. Mở file THCP\\n2. Click chuột vào ô đầu tiên của cột AC (ô AC4)\\n3. Ấn Ctrl+V để dán dữ liệu.');
    }).catch(err => {
        alert('Lỗi copy: ' + err);
    });
}
`;

if (code.includes('id="nccTripNccFilter"')) {
    code = code.replace(targetHtml, btnHtml + '\n            ' + targetHtml);
    
    const targetScript = 'function renderNccTrip() {';
    code = code.replace(targetScript, copyFunc + '\n' + targetScript);
    
    fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
    console.log('Patched copy button');
} else {
    console.log('Could not find target html');
}
