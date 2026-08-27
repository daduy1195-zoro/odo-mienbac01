const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const s1 = `"Trạng thái": (r.ghnTripCode === "GHN OFF" || r.ghnTripCode === "GHN_OFF") ? "GHN OFF" : ((r.ghnTripCode === "Phạt" || r.ghnTripCode === "PHẠT") ? "Phạt" : ((r.ghnTripCode === "NCC OFF" || r.ghnTripCode === "NCC_OFF" || r.ghnTripCode === "OFF") ? "NCC OFF" : (r.ghnTripCode ? (r.isManualMatch ? "Khớp tay" : "Đã khớp") : "Thiếu mã"))),`;
const r1 = `"Trạng thái": (r.ghnTripCode === "GHN OFF" || r.ghnTripCode === "GHN_OFF") ? "GHN OFF" : ((r.ghnTripCode === "Phạt" || r.ghnTripCode === "PHẠT") ? "Phạt" : ((r.ghnTripCode === "NCC OFF" || r.ghnTripCode === "NCC_OFF" || r.ghnTripCode === "OFF") ? "NCC OFF" : (r.ghnTripCode ? (String(r.ghnTripCode).includes('|') ? (r.isManualMatch ? "Đa chuyến (Khớp tay)" : "Đa chuyến") : (r.isManualMatch ? "Khớp tay" : "Đã khớp")) : "Thiếu mã"))),`;

if (code.includes(s1)) {
    code = code.replace(s1, r1);
    fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
    console.log('DONE EXPORT');
} else {
    console.log('NOT FOUND EXPORT');
}
