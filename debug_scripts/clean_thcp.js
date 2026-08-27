const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const s1 = `    // ====== GHI NGƯỢC MÃ CHUYẾN VÀO GOOGLE SHEET (CỘT AC) ======`;
const idx1 = code.indexOf(s1);
if (idx1 > -1) {
    const s2 = `async function loadCloudData() {`;
    const idx2 = code.indexOf(s2, idx1);
    if (idx2 > -1) {
        code = code.substring(0, idx1) + code.substring(idx2);
        
        const callHook = `            // ★ Ghi ngược mã chuyến vào cột AC của sheet THCP
            writeBackToSheet(nccTripData[index], value);`;
        code = code.replace(callHook, '');
        
        fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
        console.log('Removed writeBackToSheet logic');
    }
}
