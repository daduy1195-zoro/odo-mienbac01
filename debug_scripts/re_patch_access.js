const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

// 1. Modifying renderUserInfo
const oldRender = `    if (currentUser) {
        var avatarHtml = currentUser.picture ? '<img src="' + currentUser.picture + '" style="width:24px;height:24px;border-radius:50%;" referrerpolicy="no-referrer" onerror="this.style.display=\\'none\\'">' : '<span style="width:24px;height:24px;border-radius:50%;background:#00c2a8;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;color:#fff;">' + escapeHtml(currentUser.name.charAt(0).toUpperCase()) + '</span>';
        userInfoEl.innerHTML = avatarHtml + ' <span>' + escapeHtml(currentUser.name) + '</span>';
    }`;
    
const oldRenderCRLF = `    if (currentUser) {\r
        var avatarHtml = currentUser.picture ? '<img src="' + currentUser.picture + '" style="width:24px;height:24px;border-radius:50%;" referrerpolicy="no-referrer" onerror="this.style.display=\\'none\\'">' : '<span style="width:24px;height:24px;border-radius:50%;background:#00c2a8;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;color:#fff;">' + escapeHtml(currentUser.name.charAt(0).toUpperCase()) + '</span>';\r
        userInfoEl.innerHTML = avatarHtml + ' <span>' + escapeHtml(currentUser.name) + '</span>';\r
    }`;

const newRender = `    if (currentUser) {
        var avatarHtml = currentUser.picture ? '<img src="' + currentUser.picture + '" style="width:28px;height:28px;border-radius:50%;" referrerpolicy="no-referrer" onerror="this.style.display=\\'none\\'">' : '<span style="width:28px;height:28px;border-radius:50%;background:#00c2a8;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;color:#fff;">' + escapeHtml(currentUser.name.charAt(0).toUpperCase()) + '</span>';
        var adminBtn = (currentUser.email === 'daduy1195@gmail.com') ? '<button onclick="showAccessLogs()" style="background:none;border:none;color:#00c2a8;cursor:pointer;font-size:11px;padding:0;text-decoration:underline;">Lịch sử truy cập</button>' : '';
        userInfoEl.innerHTML = avatarHtml + ' <div style="display:flex;flex-direction:column;align-items:flex-start;line-height:1.2;"><span style="font-weight:bold;color:#fff;">' + escapeHtml(currentUser.name) + '</span>' + adminBtn + '</div>';
    }`;

if (code.includes(oldRenderCRLF)) {
    code = code.replace(oldRenderCRLF, newRender);
} else {
    code = code.replace(oldRender, newRender);
}

// 2. Modifying loadCloudData to log access
const newLogBlock = `            localStorage.setItem('GHN_NCC_TRIP_OVERRIDES', JSON.stringify(mergedOverrides));
            localStorage.setItem('GHN_NCC_TRIP_NOTES', JSON.stringify(mergedNotes));
            localStorage.setItem('GHN_ACTION_LOGS', JSON.stringify(mergedLogs));
            console.log('✅ Đã tải và hợp nhất dữ liệu đồng bộ từ Cloud thành công!');
            
            // Log access after loading data
            if (typeof currentUser !== 'undefined' && currentUser && !sessionStorage.getItem('GHN_ACCESS_LOGGED')) {
                sessionStorage.setItem('GHN_ACCESS_LOGGED', '1');
                if (!mergedLogs['__ACCESS__']) mergedLogs['__ACCESS__'] = [];
                mergedLogs['__ACCESS__'].unshift({
                    time: new Date().toLocaleString('vi-VN'),
                    user: currentUser.name,
                    email: currentUser.email
                });
                if (mergedLogs['__ACCESS__'].length > 150) mergedLogs['__ACCESS__'].pop();
                localStorage.setItem('GHN_ACTION_LOGS', JSON.stringify(mergedLogs));
                syncToCloud('__ACCESS__', undefined, undefined, mergedLogs['__ACCESS__']);
            }
        }`;

// We will use substring replacement
let idx = code.indexOf(`            localStorage.setItem('GHN_ACTION_LOGS', JSON.stringify(mergedLogs));`);
let endIdx = code.indexOf(`        }`, idx);
if (idx > -1 && endIdx > -1) {
    code = code.substring(0, idx) + newLogBlock + code.substring(endIdx + 9);
}

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Fixed access log button!');
