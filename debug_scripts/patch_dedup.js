const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const regexParse = /sourceRow\s*\n\s*\}\);/;
const replacementParse = `sourceRow,\n            isAllSheet: (nccName === 'ALL')\n        });`;

if (code.match(regexParse)) {
    code = code.replace(regexParse, replacementParse);
    console.log('Added isAllSheet');
} else {
    console.log('regexParse not found');
}

const regexDedup = /\/\/ Deduplicate archive items by keeping longest route[\s\S]*?allNccData\.forEach\(r => \{/;
const replacementDedup = `// Lọc trùng (Deduplicate) thông minh:
        // Nếu cùng 1 ngày, 1 xe, 1 NCC mà có dữ liệu từ file ALL và file lẻ -> Chỉ lấy của file ALL, vứt file lẻ.
        // Giữ lại TẤT CẢ các chuyến của file được chọn (vì 1 xe có thể chạy 2 chuyến/ngày).
        const groupMap = new Map();
        allNccData.forEach(r => {
            const key = \`\${normalizeStr(r.dateStr)}_\${normalizeStr(r.plate)}_\${normalizeStr(r.ncc)}\`;
            if (!groupMap.has(key)) groupMap.set(key, []);
            groupMap.get(key).push(r);
        });

        allNccData = [];
        groupMap.forEach(trips => {
            const hasAllSheet = trips.some(t => t.isAllSheet);
            if (hasAllSheet) {
                allNccData.push(...trips.filter(t => t.isAllSheet));
            } else {
                allNccData.push(...trips);
            }
        });

        allNccData.forEach(r => {`;

if (code.match(regexDedup)) {
    code = code.replace(regexDedup, replacementDedup);
    fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
    console.log('Deduplication logic fixed.');
} else {
    console.log('regexDedup not found');
}
