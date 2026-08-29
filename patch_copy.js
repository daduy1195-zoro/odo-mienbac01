const fs = require('fs');
let c = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const htmlOld = '<button class="btn btn-primary" onclick="copyThcpAC()" style="padding:6px 14px;font-size:13px;background:#10b981;border-color:#10b981;" title="Copy toàn b? mã chuy?n di và ghi chú d? dán th?ng vào c?t AC, AD c?a file THCP">?? Copy c?t AC, AD (THCP)</button>';
const htmlNew = '<button class="btn btn-primary" onclick="copyThcpAC(\\'1tATkbxYOtiBuJC1GRto3QI81q_fkGzKYylufz4WtuAA\\', \\'THCP\\')" style="padding:6px 14px;font-size:13px;background:#10b981;border-color:#10b981;" title="Copy mã chuy?n di và ghi chú c?a file THCP">?? Copy AC, AD (THCP)</button>\\n            <button class="btn btn-primary" onclick="copyThcpAC(\\'1uzpRdyDq-ayFgpos6rWXDcJDC7OL3r5fzct_E4mMYgo\\', \\'Tháng 8\\')" style="padding:6px 14px;font-size:13px;background:#3b82f6;border-color:#3b82f6;" title="Copy mã chuy?n di và ghi chú c?a file Tháng 8">?? Copy AC, AD (Tháng 8)</button>';
c = c.replace(htmlOld, htmlNew);

const funcOld1 = 'window.copyThcpAC = function() {';
const funcNew1 = 'window.copyThcpAC = function(sheetId, label) {';
c = c.replace(funcOld1, funcNew1);

const funcOld2 = 'const thcpTrips = nccTripData.filter(r => r.isAllSheet);';
const funcNew2 = 'const thcpTrips = nccTripData.filter(r => String(r.sheetId || \\'\\') === sheetId);';
c = c.replace(funcOld2, funcNew2);

const funcOld3 = 'if(typeof showToast === \\'function\\') showToast(\\'error\\', \\'Không tìm th?y d? li?u c?a file THCP!\\');';
const funcNew3 = 'if(typeof showToast === \\'function\\') showToast(\\'error\\', \\'Không tìm th?y d? li?u c?a file \\' + label + \\'!\\');';
c = c.replace(funcOld3, funcNew3);

const funcOld4 = 'alert(\\'? Ðã copy \\' + copyArr.length + \\' dòng!\\\\n\\\\nBây gi? hãy:\\\\n1. M? file THCP\\\\n2. Click chu?t vào ô d?u tiên c?a c?t AC (ô AC4)\\\\n3. ?n Ctrl+V d? dán toàn b? d? li?u.\\');';
const funcNew4 = 'alert(\\'? Ðã copy \\' + copyArr.length + \\' dòng!\\\\n\\\\nBây gi? hãy:\\\\n1. M? file \\' + label + \\'\\\\n2. Click chu?t vào ô d?u tiên c?a c?t AC (ô AC4)\\\\n3. ?n Ctrl+V d? dán toàn b? d? li?u AC và AD.\\');';
c = c.replace(funcOld4, funcNew4);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', c);
console.log('Patched');
