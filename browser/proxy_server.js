/**
 * ============================================
 * LOCAL PROXY SERVER - Bước 2: Phục vụ dữ liệu sheet
 * ============================================
 * 
 * Chạy: node browser/proxy_server.js
 * 
 * Server chạy trên http://localhost:3847
 * Dashboard gọi vào server này để lấy dữ liệu sheet GHN.
 * 
 * Server dùng session đã lưu (browser/session/) → 
 * Puppeteer headless tự fetch dữ liệu → trả JSON về cho dashboard.
 */

const puppeteer = require('puppeteer');
const http = require('http');
const path = require('path');
const url = require('url');

const SESSION_DIR = path.join(__dirname, 'session');
const PORT = 3847;

// Cấu hình các sheet cần đọc
const SHEETS = {
    employee: {
        id: '1vI_rzcjX6F12SOm06QvEo9W2s5kiDjYcRtvm2kWuCXo',
        gids: ['409459817', '1274066622']
    },
    supplier: {
        id: '14zXhTqxD7VsN_PE3OxNY7hLss8zxG4zUNT_cNN9QV90',
        gid: '0'
    },
    master: {
        id: '1RMe38TNV-EoIAradnynYmk8mt7l9pNWqJELM9O84Wxc',
        gid: '1254809645'
    }
};

let browser = null;
let page = null;

async function initBrowser() {
    if (browser) return;
    console.log('🚀 Khởi động trình duyệt headless...');
    browser = await puppeteer.launch({
        headless: 'new',
        userDataDir: SESSION_DIR,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
    });
    page = await browser.newPage();
    
    // Chặn tải ảnh, CSS, font để nhanh hơn
    await page.setRequestInterception(true);
    page.on('request', req => {
        const type = req.resourceType();
        if (['image', 'stylesheet', 'font', 'media'].includes(type)) {
            req.abort();
        } else {
            req.continue();
        }
    });
    
    console.log('✅ Trình duyệt headless sẵn sàng.');
}

/**
 * Fetch dữ liệu từ Google Sheet qua gviz/tq endpoint
 * Trả về mảng 2D (rows) - đã bỏ header
 */
async function fetchSheetData(sheetId, gid) {
    await initBrowser();
    
    const gvizUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&gid=${gid}&headers=1&_cb=${Date.now()}`;
    
    console.log(`📡 Fetching: ${sheetId} gid=${gid}`);
    
    const response = await page.goto(gvizUrl, { 
        waitUntil: 'networkidle2', 
        timeout: 30000 
    });
    
    const text = await page.evaluate(() => document.body.innerText || document.body.textContent);
    
    // Parse gviz response: google.visualization.Query.setResponse({...})
    // or /*O_o*/\ngoogle.visualization.Query.setResponse({...});
    let jsonStr = text;
    
    // Tìm JSON object trong response
    const startIdx = jsonStr.indexOf('{');
    const endIdx = jsonStr.lastIndexOf('}');
    if (startIdx === -1 || endIdx === -1) {
        throw new Error('Invalid gviz response: ' + jsonStr.substring(0, 200));
    }
    jsonStr = jsonStr.substring(startIdx, endIdx + 1);
    
    const data = JSON.parse(jsonStr);
    
    if (data.status !== 'ok') {
        throw new Error('Sheet error: ' + (data.errors?.[0]?.message || JSON.stringify(data.errors)));
    }
    
    const table = data.table;
    const rows = [];
    
    if (table.rows) {
        table.rows.forEach(row => {
            const r = row.c.map(cell => {
                if (!cell) return '';
                if (cell.f) return String(cell.f);
                if (cell.v === null || cell.v === undefined) return '';
                const sv = String(cell.v);
                // Parse Date(yyyy,mm,dd) format
                const dateMatch = sv.match(/^Date\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
                if (dateMatch) {
                    const dd = String(parseInt(dateMatch[3])).padStart(2, '0');
                    const mm = String(parseInt(dateMatch[2]) + 1).padStart(2, '0');
                    return dd + '/' + mm + '/' + dateMatch[1];
                }
                return sv;
            });
            rows.push(r);
        });
    }
    
    console.log(`✅ Got ${rows.length} rows from gid=${gid}`);
    return rows;
}

/**
 * Fetch dữ liệu từ Google Sheet theo tên tab
 */
async function fetchSheetByName(sheetId, tabName) {
    await initBrowser();
    
    const gvizUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(tabName)}&headers=1&_cb=${Date.now()}`;
    
    console.log(`📡 Fetching by name: ${sheetId} tab="${tabName}"`);
    
    await page.goto(gvizUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    const text = await page.evaluate(() => document.body.innerText || document.body.textContent);
    
    let jsonStr = text;
    const startIdx = jsonStr.indexOf('{');
    const endIdx = jsonStr.lastIndexOf('}');
    if (startIdx === -1 || endIdx === -1) return [];
    jsonStr = jsonStr.substring(startIdx, endIdx + 1);
    
    const data = JSON.parse(jsonStr);
    if (data.status !== 'ok') return [];
    
    const rows = [];
    if (data.table && data.table.rows) {
        data.table.rows.forEach(row => {
            const r = row.c.map(cell => {
                if (!cell) return '';
                if (cell.f) return String(cell.f);
                if (cell.v === null || cell.v === undefined) return '';
                const sv = String(cell.v);
                const dateMatch = sv.match(/^Date\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
                if (dateMatch) {
                    const dd = String(parseInt(dateMatch[3])).padStart(2, '0');
                    const mm = String(parseInt(dateMatch[2]) + 1).padStart(2, '0');
                    return dd + '/' + mm + '/' + dateMatch[1];
                }
                return sv;
            });
            rows.push(r);
        });
    }
    
    console.log(`✅ Got ${rows.length} rows from tab="${tabName}"`);
    return rows;
}

// ═══════════════════════════════════════
// HTTP SERVER
// ═══════════════════════════════════════
const server = http.createServer(async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    const parsed = url.parse(req.url, true);
    const action = parsed.query.action || 'ping';
    
    try {
        let result;
        
        switch (action) {
            case 'employee': {
                // Fetch tất cả dữ liệu nhân viên từ cả 2 tab
                const allRows = [];
                for (const gid of SHEETS.employee.gids) {
                    const rows = await fetchSheetData(SHEETS.employee.id, gid);
                    rows.forEach((row, idx) => {
                        // Thêm metadata _gid và _sheetRow vào cuối mỗi row
                        row.push(gid);
                        row.push(idx + 2); // sheetRow (1-indexed, row 1 = header)
                    });
                    allRows.push(...rows);
                }
                result = { status: 'ok', count: allRows.length, metaCols: ['_gid', '_sheetRow'], rows: allRows };
                break;
            }
            case 'employee_gid': {
                const gid = parsed.query.gid || SHEETS.employee.gids[0];
                const rows = await fetchSheetData(SHEETS.employee.id, gid);
                result = { status: 'ok', count: rows.length, rows };
                break;
            }
            case 'supplier': {
                const rows = await fetchSheetData(SHEETS.supplier.id, SHEETS.supplier.gid);
                result = { status: 'ok', count: rows.length, rows };
                break;
            }
            case 'master': {
                const rows = await fetchSheetData(SHEETS.master.id, SHEETS.master.gid);
                result = { status: 'ok', count: rows.length, rows };
                break;
            }
            case 'master_nvph': {
                const rows = await fetchSheetByName(SHEETS.master.id, 'NVPH');
                result = { status: 'ok', count: rows.length, rows };
                break;
            }
            case 'master_ctv': {
                const rows = await fetchSheetByName(SHEETS.master.id, 'CTV');
                result = { status: 'ok', count: rows.length, rows };
                break;
            }
            case 'ping': {
                result = { status: 'ok', timestamp: new Date().toISOString(), session: SESSION_DIR };
                break;
            }
            default:
                result = { error: 'Unknown action: ' + action };
        }
        
        res.writeHead(200);
        res.end(JSON.stringify(result));
        
    } catch (err) {
        console.error('❌ Error:', err.message);
        res.writeHead(500);
        res.end(JSON.stringify({ error: err.message }));
    }
});

server.listen(PORT, () => {
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`  🌐 Proxy Server đang chạy: http://localhost:${PORT}`);
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log('  Dashboard sẽ tự động gọi vào server này.');
    console.log('  Nhấn Ctrl+C để tắt server.');
    console.log('');
    console.log('  API endpoints:');
    console.log(`    GET http://localhost:${PORT}/?action=ping`);
    console.log(`    GET http://localhost:${PORT}/?action=employee`);
    console.log(`    GET http://localhost:${PORT}/?action=supplier`);
    console.log(`    GET http://localhost:${PORT}/?action=master`);
    console.log(`    GET http://localhost:${PORT}/?action=master_nvph`);
    console.log(`    GET http://localhost:${PORT}/?action=master_ctv`);
    console.log('');
});

// Dọn dẹp khi tắt server
process.on('SIGINT', async () => {
    console.log('\n🔒 Đang tắt server...');
    if (browser) await browser.close();
    process.exit(0);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught error:', err.message);
});
