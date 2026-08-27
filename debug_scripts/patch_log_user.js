const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

// Replace saveActionLog to include user info
const oldSaveActionLog = `function saveActionLog(key, action, details) {
    try {
        const logs = JSON.parse(localStorage.getItem('GHN_ACTION_LOGS') || '{}');
        if (!logs[key]) logs[key] = [];
        logs[key].push({
            time: new Date().toLocaleString('vi-VN'),
            action: action,
            details: details
        });
        localStorage.setItem('GHN_ACTION_LOGS', JSON.stringify(logs));
    } catch(e) {}
}`;

const newSaveActionLog = `function saveActionLog(key, action, details) {
    try {
        const logs = JSON.parse(localStorage.getItem('GHN_ACTION_LOGS') || '{}');
        if (!logs[key]) logs[key] = [];
        
        // Get user info if available
        let userName = 'Ẩn danh';
        if (typeof currentUser !== 'undefined' && currentUser && currentUser.name) {
            userName = currentUser.name;
        }
        
        logs[key].push({
            time: new Date().toLocaleString('vi-VN'),
            action: action,
            details: details,
            user: userName
        });
        localStorage.setItem('GHN_ACTION_LOGS', JSON.stringify(logs));
    } catch(e) {}
}`;

code = code.replace(oldSaveActionLog, newSaveActionLog);

// Also replace the direct array pushes:
// nccTripData[index].actionLogs.push({ time: new Date().toLocaleString('vi-VN'), action: 'Khớp tay', details: value });
code = code.replace(/actionLogs\.push\(\{ time: new Date\(\)\.toLocaleString\('vi-VN'\), action: ([^,]+), details: ([^ \}]+) \}\)/g, 
    "actionLogs.push({ time: new Date().toLocaleString('vi-VN'), action: $1, details: $2, user: (typeof currentUser !== 'undefined' && currentUser ? currentUser.name : 'Ẩn danh') })");

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
console.log('Action log patched with user info.');
