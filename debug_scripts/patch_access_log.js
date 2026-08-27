const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

// 1. Modifying renderUserInfo
const oldRender = `    if (currentUser) {
        var avatarHtml = currentUser.picture ? '<img src="' + currentUser.picture + '" style="width:24px;height:24px;border-radius:50%;" referrerpolicy="no-referrer" onerror="this.style.display=\\'none\\'">' : '<span style="width:24px;height:24px;border-radius:50%;background:#00c2a8;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;color:#fff;">' + escapeHtml(currentUser.name.charAt(0).toUpperCase()) + '</span>';
        userInfoEl.innerHTML = avatarHtml + ' <span>' + escapeHtml(currentUser.name) + '</span>';
    }`;

const newRender = `    if (currentUser) {
        var avatarHtml = currentUser.picture ? '<img src="' + currentUser.picture + '" style="width:28px;height:28px;border-radius:50%;" referrerpolicy="no-referrer" onerror="this.style.display=\\'none\\'">' : '<span style="width:28px;height:28px;border-radius:50%;background:#00c2a8;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;color:#fff;">' + escapeHtml(currentUser.name.charAt(0).toUpperCase()) + '</span>';
        var adminBtn = (currentUser.email === 'daduy1195@gmail.com') ? '<button onclick="showAccessLogs()" style="background:none;border:none;color:#00c2a8;cursor:pointer;font-size:11px;padding:0;text-decoration:underline;">Lịch sử truy cập</button>' : '';
        userInfoEl.innerHTML = avatarHtml + ' <div style="display:flex;flex-direction:column;align-items:flex-start;line-height:1.2;"><span style="font-weight:bold;color:#fff;">' + escapeHtml(currentUser.name) + '</span>' + adminBtn + '</div>';
    }`;

code = code.replace(oldRender, newRender);

// 2. Modifying loadCloudData to log access
const oldLoadCloudDataEnd = `            localStorage.setItem('GHN_NCC_TRIP_OVERRIDES', JSON.stringify(localOverrides));
            localStorage.setItem('GHN_NCC_TRIP_NOTES', JSON.stringify(localNotes));
            localStorage.setItem('GHN_ACTION_LOGS', JSON.stringify(localLogs));
            console.log('✅ loadCloudData: Đã gộp dữ liệu local và cloud');
        }
    } catch(e) {
        console.error('Lỗi loadCloudData:', e);
    }`;

const newLoadCloudDataEnd = `            localStorage.setItem('GHN_NCC_TRIP_OVERRIDES', JSON.stringify(localOverrides));
            localStorage.setItem('GHN_NCC_TRIP_NOTES', JSON.stringify(localNotes));
            localStorage.setItem('GHN_ACTION_LOGS', JSON.stringify(localLogs));
            console.log('✅ loadCloudData: Đã gộp dữ liệu local và cloud');
            
            // Log access after loading data
            if (typeof currentUser !== 'undefined' && currentUser && !sessionStorage.getItem('GHN_ACCESS_LOGGED')) {
                sessionStorage.setItem('GHN_ACCESS_LOGGED', '1');
                if (!localLogs['__ACCESS__']) localLogs['__ACCESS__'] = [];
                localLogs['__ACCESS__'].unshift({
                    time: new Date().toLocaleString('vi-VN'),
                    user: currentUser.name,
                    email: currentUser.email
                });
                if (localLogs['__ACCESS__'].length > 150) localLogs['__ACCESS__'].pop();
                localStorage.setItem('GHN_ACTION_LOGS', JSON.stringify(localLogs));
                syncToCloud('__ACCESS__', undefined, undefined, localLogs['__ACCESS__']);
            }
        }
    } catch(e) {
        console.error('Lỗi loadCloudData:', e);
    }`;

code = code.replace(oldLoadCloudDataEnd, newLoadCloudDataEnd);


// 3. Add showAccessLogs function
const scriptEnd = `
function showAccessLogs() {
    let modal = document.getElementById('accessLogModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'accessLogModal';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:10001;display:flex;align-items:center;justify-content:center;';
        document.body.appendChild(modal);
    }
    
    const logs = JSON.parse(localStorage.getItem('GHN_ACTION_LOGS') || '{}')['__ACCESS__'] || [];
    let html = '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;width:90%;max-width:600px;max-height:80vh;display:flex;flex-direction:column;box-shadow:0 10px 40px rgba(0,0,0,0.5);">';
    html += '<div style="padding:15px 20px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">';
    html += '<h3 style="margin:0;color:var(--text-primary);font-size:18px;">🔒 Lịch sử truy cập hệ thống</h3>';
    html += '<button onclick="document.getElementById(\\'accessLogModal\\').style.display=\\'none\\'" style="background:none;border:none;color:var(--text-secondary);font-size:24px;cursor:pointer;">&times;</button>';
    html += '</div>';
    html += '<div style="padding:0;overflow-y:auto;flex:1;">';
    
    if (logs.length === 0) {
        html += '<div style="padding:30px;text-align:center;color:var(--text-muted);">Chưa có dữ liệu truy cập.</div>';
    } else {
        html += '<table class="data-table" style="width:100%;">';
        html += '<thead><tr><th>Thời gian</th><th>Người truy cập</th><th>Email</th></tr></thead><tbody>';
        logs.forEach(l => {
            html += '<tr>';
            html += '<td style="white-space:nowrap;color:var(--text-secondary);">' + escapeHtml(l.time) + '</td>';
            html += '<td style="font-weight:bold;color:var(--text-primary);">' + escapeHtml(l.user) + '</td>';
            html += '<td><span class="badge badge-info">' + escapeHtml(l.email) + '</span></td>';
            html += '</tr>';
        });
        html += '</tbody></table>';
    }
    html += '</div></div>';
    
    modal.innerHTML = html;
    modal.style.display = 'flex';
}

</script>
</body>
</html>
`;

code = code.replace('</script>\n</body>\n</html>', scriptEnd);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Access log added.');
