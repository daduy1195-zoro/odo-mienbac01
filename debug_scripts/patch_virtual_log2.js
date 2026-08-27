const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

// Pull JSON.parse out of the loop
const oldLoopStart = `    html += '<th style="width:40px">#</th><th style="width:90px">Ngày</th><th>Mã chuyến</th><th style="width:120px">Biển số</th><th style="width:100px">Kho</th><th style="width:130px">Bắt đầu</th><th style="width:130px">Kết thúc</th><th>Người tạo</th><th style="width:60px">Lấy</th><th style="width:60px">Giao</th><th style="width:60px">Trả</th><th>NVGH</th><th style="width:110px">' + sdtHeader + '</th><th style="min-width:200px;">Tuyến đường</th><th style="width:80px; text-align:center;">Chuyến ảo</th><th style="width:130px; white-space:nowrap;">Đối soát NCC</th><th style="width:40px; text-align:center;" title="Lịch sử thao tác">🕒</th>';
    html += '</tr></thead><tbody>';
    
    for (var m = 0; m < filtered.length; m++) {`;
const newLoopStart = `    html += '<th style="width:40px">#</th><th style="width:90px">Ngày</th><th>Mã chuyến</th><th style="width:120px">Biển số</th><th style="width:100px">Kho</th><th style="width:130px">Bắt đầu</th><th style="width:130px">Kết thúc</th><th>Người tạo</th><th style="width:60px">Lấy</th><th style="width:60px">Giao</th><th style="width:60px">Trả</th><th>NVGH</th><th style="width:110px">' + sdtHeader + '</th><th style="min-width:200px;">Tuyến đường</th><th style="width:80px; text-align:center;">Chuyến ảo</th><th style="width:130px; white-space:nowrap;">Đối soát NCC</th><th style="width:40px; text-align:center;" title="Lịch sử thao tác">🕒</th>';
    html += '</tr></thead><tbody>';
    
    let allLocalLogs = {};
    try { allLocalLogs = JSON.parse(localStorage.getItem('GHN_ACTION_LOGS') || '{}'); } catch(e) {}
    
    for (var m = 0; m < filtered.length; m++) {`;

code = code.replace(oldLoopStart, newLoopStart);

const oldTry = `        try {
            const localLogs = JSON.parse(localStorage.getItem('GHN_ACTION_LOGS') || '{}');
            const vKey = 'VIRTUAL_' + r.tripCode;
            if (localLogs[vKey] && localLogs[vKey].length > 0) {
                logs = logs.concat(localLogs[vKey]);
            }
        } catch(e) {}`;
const newTry = `        const vKey = 'VIRTUAL_' + r.tripCode;
        if (allLocalLogs[vKey] && allLocalLogs[vKey].length > 0) {
            logs = logs.concat(allLocalLogs[vKey]);
        }`;

code = code.replace(oldTry, newTry);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Virtual logs patch 2 applied');
