const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

const fetchFunc = `
// BỔ SUNG BIỂN SỐ XE TỪ LINK T5
async function fetchSupplementaryPlates() {
    return new Promise((resolve) => {
        const map = new Map();
        let loaded = 0;
        const urls = ['1iwCBlTN3fEspMvkKpeXRnhcUO8suWIyTj2SdkCNxx2k', '1nuYvpAKTgZoW50o9PcLLNmAI2K76eAU5w6AQgX1DBrc'];
        
        urls.forEach((sheetId, idx) => {
            const cbName = '_plateCB_' + idx + '_' + Date.now();
            window[cbName] = function(data) {
                delete window[cbName];
                if (data && data.table && data.table.rows) {
                    data.table.rows.forEach(r => {
                        if (r.c && r.c[0] && r.c[0].v && r.c[1] && r.c[1].v) {
                            let plate = String(r.c[1].v).trim();
                            if (typeof formatPlate === 'function') plate = formatPlate(plate);
                            map.set(String(r.c[0].v).trim(), plate);
                        }
                    });
                }
                loaded++;
                if (loaded === urls.length) resolve(map);
            };
            const script = document.createElement('script');
            const q = encodeURIComponent('SELECT D, MAX(M) WHERE D is not null GROUP BY D');
            script.src = \`https://docs.google.com/spreadsheets/d/\${sheetId}/gviz/tq?tqx=responseHandler:\${cbName}&tq=\${q}\`;
            document.body.appendChild(script);
        });
        
        setTimeout(() => {
            if (loaded < urls.length) {
                loaded = urls.length;
                resolve(map);
            }
        }, 15000); // 15s timeout
    });
}
`;

const replaceStr = `
    // Tích hợp bổ sung biển số xe tháng 5 từ link ngoài
    console.log('🔄 Đang nạp bổ sung biển số xe tháng 5...');
    try {
        const pMap = await fetchSupplementaryPlates();
        if (pMap.size > 0) {
            let filledCount = 0;
            lastmileData.forEach(r => {
                if (!r.plate && r.tripCode && pMap.has(r.tripCode)) {
                    r.plate = pMap.get(r.tripCode);
                    filledCount++;
                }
            });
            console.log('✅ Đã bổ sung thành công ' + filledCount + ' biển số từ 2 link phụ!');
        }
    } catch(e) {
        console.error('Lỗi nạp biển số phụ:', e);
    }
    
    tripsData = lastmileData; // Use lastmileData directly`;

if (!code.includes('fetchSupplementaryPlates')) {
    const loadLastmileIdx = code.indexOf('async function loadLastmileData()');
    code = code.substring(0, loadLastmileIdx) + fetchFunc + '\n' + code.substring(loadLastmileIdx);
    
    code = code.replace('tripsData = lastmileData; // Use lastmileData directly', replaceStr);
    
    fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
    console.log('Patched T5 plates successfully');
}
