const fs = require('fs');
let c = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const htmlOld = '<button class="btn btn-primary" onclick="copyThcpAC()" style="padding:6px 14px;font-size:13px;background:#10b981;border-color:#10b981;" title="Copy toàn b? mã chuy?n di và ghi chú d? dán th?ng vào c?t AC, AD c?a file THCP">?? Copy c?t AC, AD (THCP)</button>';
const htmlNew = '<button class="btn btn-primary" onclick="copyThcpAC(\\'1tATkbxYOtiBuJC1GRto3QI81q_fkGzKYylufz4WtuAA\\', \\'THCP\\')" style="padding:6px 14px;font-size:13px;background:#10b981;border-color:#10b981;" title="Copy mã chuy?n di và ghi chú c?a file THCP">?? Copy AC, AD (THCP)</button>\\n                <button class="btn btn-primary" onclick="copyThcpAC(\\'1uzpRdyDq-ayFgpos6rWXDcJDC7OL3r5fzct_E4mMYgo\\', \\'Tháng 8\\')" style="padding:6px 14px;font-size:13px;background:#3b82f6;border-color:#3b82f6;" title="Copy mã chuy?n di và ghi chú c?a file Tháng 8">?? Copy AC, AD (Tháng 8)</button>';
if (c.includes('onclick="copyThcpAC()"')) {
    c = c.replace(htmlOld, htmlNew);
}

const funcOld = /window\.copyThcpAC = function\(\) \{[\s\S]*?const thcpTrips = nccTripData\.filter\(r => r\.isAllSheet\);[\s\S]*?if\s*\(typeof showToast === 'function'\) showToast\('error',\s*'Không tìm th?y d? li?u c?a file THCP!'\);/;
const funcNew = \window.copyThcpAC = function(sheetId, label) {
    if (typeof nccTripData === 'undefined' || !nccTripData || nccTripData.length === 0) {
        if(typeof showToast === 'function') showToast('error', 'Chua có d? li?u, vui lòng d?i t?i xong!');
        return;
    }

    // L?c các dòng thu?c file truy?n vào
    const thcpTrips = nccTripData.filter(r => String(r.sheetId || '') === sheetId);
    if (thcpTrips.length === 0) {
        if(typeof showToast === 'function') showToast('error', 'Không tìm th?y d? li?u c?a file ' + label + '!');\;
if (funcOld.test(c)) {
    c = c.replace(funcOld, funcNew);
}

const alertOld = /alert\('? Ðã copy ' \+ copyArr\.length \+ ' dòng!\\n\\nBây gi? hãy:\\n1\. M? file THCP\\n/;
const alertNew = "alert('? Ðã copy ' + copyArr.length + ' dòng!\\n\\nBây gi? hãy:\\n1. M? file ' + label + '\\n";
if (alertOld.test(c)) {
    c = c.replace(alertOld, alertNew);
}

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', c);
console.log('Patched');
