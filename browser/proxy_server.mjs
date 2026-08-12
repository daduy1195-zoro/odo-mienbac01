/**
 * ============================================
 * LOCAL PROXY SERVER - Đọc dữ liệu sheet GHN qua clipboard scraping
 * ============================================
 * 
 * Chạy: node browser/proxy_server.mjs
 * 
 * Server chạy trên http://localhost:3847
 * Dashboard gọi vào server này để lấy dữ liệu sheet GHN.
 * 
 * Cách hoạt động:
 * - Puppeteer headless mở Google Sheet (dùng session GHN đã lưu)
 * - Ctrl+A → Ctrl+C → Đọc clipboard
 * - Parse TSV → JSON → Trả về cho dashboard
 * 
 * Dùng session từ: App_tai_xe/odo_script/chrome_profile_ghn
 */

import puppeteer from 'puppeteer';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Dùng chung session GHN đã đăng nhập từ app_tai_xe
const SESSION_DIR = path.join(__dirname, '..', '..', 'App_tai_xe', 'odo_script', 'chrome_profile_ghn');
const PORT = 3847;

// Cấu hình các sheet
const SHEETS = {
    employee: {
        id: '1vI_rzcjX6F12SOm06QvEo9W2s5kiDjYcRtvm2kWuCXo',
        gids: { '409459817': 'GXT-MIỀN BẮC', '1274066622': 'Câu trả lời biểu mẫu 5' }
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

// Cache dữ liệu (tránh scrape lại mỗi request)
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 phút

let browser = null;
let page = null;

async function initBrowser() {
    if (browser && page) return;
    console.log('🚀 Khởi động trình duyệt headless...');
    browser = await puppeteer.launch({
        headless: 'new',
        userDataDir: SESSION_DIR,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
    });
    page = await browser.newPage();
    
    // Grant clipboard permission
    const context = browser.defaultBrowserContext();
    await context.overridePermissions('https://docs.google.com', ['clipboard-read', 'clipboard-write']);
    
    console.log('✅ Browser sẵn sàng.');
}

/**
 * Scrape Google Sheet bằng clipboard
 * Mở sheet → Ctrl+A → Ctrl+C → Đọc clipboard → Parse TSV
 */
async function scrapeSheet(sheetId, gid) {
    // Check cache
    const cacheKey = `${sheetId}_${gid}`;
    const cached = cache.get(cacheKey);
    if (cached && (Date.now() - cached.time < CACHE_TTL)) {
        console.log(`📦 Cache hit: ${cacheKey} (${cached.rows.length} rows)`);
        return cached.rows;
    }
    
    await initBrowser();
    
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/edit?gid=${gid}#gid=${gid}`;
    console.log(`📋 Opening sheet: ${sheetId} gid=${gid}`);
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 3000)); // Chờ sheet render
    
    // Ctrl+Home → về A1
    await page.keyboard.down('Control');
    await page.keyboard.press('Home');
    await page.keyboard.up('Control');
    await new Promise(r => setTimeout(r, 500));
    
    // Ctrl+A → Select all
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyA');
    await page.keyboard.up('Control');
    await new Promise(r => setTimeout(r, 1500));
    
    // Ctrl+C → Copy
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyC');
    await page.keyboard.up('Control');
    await new Promise(r => setTimeout(r, 2000));
    
    // Đọc clipboard
    const clipboardData = await page.evaluate(async () => {
        try {
            return await navigator.clipboard.readText();
        } catch(e) {
            return null;
        }
    });
    
    if (!clipboardData) {
        throw new Error('Không đọc được clipboard. Session có thể hết hạn.');
    }
    
    // Parse TSV clipboard → 2D array
    // Google Sheets clipboard: tab-separated, quoted fields may span multiple lines
    const allRows = parseFullTSV(clipboardData);
    
    // Bỏ header row (dòng đầu)
    const rows = allRows.slice(1);
    
    console.log(`✅ Scraped ${rows.length} data rows from gid=${gid} (total ${allRows.length} including header)`);
    
    // Lưu cache
    cache.set(cacheKey, { rows, time: Date.now() });
    
    return rows;
}

/**
 * Parse full TSV text (from Google Sheets clipboard)
 * Handles multi-line cells wrapped in double quotes
 * Returns 2D array of rows
 */
function parseFullTSV(text) {
    const rows = [];
    let currentRow = [];
    let currentCell = '';
    let inQuotes = false;
    
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        const nextCh = text[i + 1];
        
        if (inQuotes) {
            if (ch === '"' && nextCh === '"') {
                // Escaped quote
                currentCell += '"';
                i++;
            } else if (ch === '"') {
                // End quote
                inQuotes = false;
            } else {
                currentCell += ch;
            }
        } else {
            if (ch === '"') {
                inQuotes = true;
            } else if (ch === '\t') {
                currentRow.push(currentCell);
                currentCell = '';
            } else if (ch === '\r') {
                // skip \r
            } else if (ch === '\n') {
                currentRow.push(currentCell);
                currentCell = '';
                if (currentRow.some(c => c.trim() !== '')) {
                    rows.push(currentRow);
                }
                currentRow = [];
            } else {
                currentCell += ch;
            }
        }
    }
    
    // Last row
    if (currentCell || currentRow.length > 0) {
        currentRow.push(currentCell);
        if (currentRow.some(c => c.trim() !== '')) {
            rows.push(currentRow);
        }
    }
    
    return rows;
}

// ═══════════════════════════════════════
// HTTP SERVER
// ═══════════════════════════════════════
const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    
    if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }
    
    const parsed = new URL(req.url, 'http://localhost');
    const action = parsed.searchParams.get('action') || 'ping';
    
    try {
        let result;
        
        switch (action) {
            case 'employee': {
                const allRows = [];
                for (const [gid, tabName] of Object.entries(SHEETS.employee.gids)) {
                    console.log(`📡 Scraping tab: ${tabName} (gid=${gid})`);
                    const rows = await scrapeSheet(SHEETS.employee.id, gid);
                    rows.forEach((row, idx) => {
                        row.push(gid);        // _gid
                        row.push(idx + 2);    // _sheetRow
                    });
                    allRows.push(...rows);
                }
                result = { status: 'ok', count: allRows.length, metaCols: ['_gid', '_sheetRow'], rows: allRows };
                break;
            }
            case 'employee_gid': {
                const gid = parsed.searchParams.get('gid') || Object.keys(SHEETS.employee.gids)[0];
                const rows = await scrapeSheet(SHEETS.employee.id, gid);
                result = { status: 'ok', count: rows.length, rows };
                break;
            }
            case 'supplier': {
                const rows = await scrapeSheet(SHEETS.supplier.id, SHEETS.supplier.gid);
                result = { status: 'ok', count: rows.length, rows };
                break;
            }
            case 'master': {
                const rows = await scrapeSheet(SHEETS.master.id, SHEETS.master.gid);
                result = { status: 'ok', count: rows.length, rows };
                break;
            }
            case 'master_nvph': {
                // NVPH tab - scrape by navigating to the named tab
                // For now, try the master sheet with NVPH tab URL
                try {
                    const rows = await scrapeSheetByTabName(SHEETS.master.id, 'NVPH');
                    result = { status: 'ok', count: rows.length, rows };
                } catch(e) {
                    result = { status: 'ok', count: 0, rows: [] };
                }
                break;
            }
            case 'master_ctv': {
                try {
                    const rows = await scrapeSheetByTabName(SHEETS.master.id, 'CTV');
                    result = { status: 'ok', count: rows.length, rows };
                } catch(e) {
                    result = { status: 'ok', count: 0, rows: [] };
                }
                break;
            }
            case 'clear_cache': {
                cache.clear();
                result = { status: 'ok', message: 'Cache cleared' };
                break;
            }
            case 'ping': {
                result = { status: 'ok', timestamp: new Date().toISOString(), session: SESSION_DIR, cacheSize: cache.size };
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

/**
 * Scrape sheet by tab name (click tab in the UI)
 */
async function scrapeSheetByTabName(sheetId, tabName) {
    const cacheKey = `${sheetId}_tab_${tabName}`;
    const cached = cache.get(cacheKey);
    if (cached && (Date.now() - cached.time < CACHE_TTL)) {
        return cached.rows;
    }
    
    await initBrowser();
    
    // Open sheet first
    await page.goto(`https://docs.google.com/spreadsheets/d/${sheetId}/edit`, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 3000));
    
    // Find and click tab by name
    const found = await page.evaluate((name) => {
        const tabs = document.querySelectorAll('.docs-sheet-tab');
        for (const tab of tabs) {
            if (tab.textContent.trim() === name) {
                tab.click();
                return true;
            }
        }
        return false;
    }, tabName);
    
    if (!found) throw new Error(`Tab "${tabName}" not found`);
    await new Promise(r => setTimeout(r, 3000));
    
    // Now scrape
    await page.keyboard.down('Control');
    await page.keyboard.press('Home');
    await page.keyboard.up('Control');
    await new Promise(r => setTimeout(r, 500));
    
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyA');
    await page.keyboard.up('Control');
    await new Promise(r => setTimeout(r, 1500));
    
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyC');
    await page.keyboard.up('Control');
    await new Promise(r => setTimeout(r, 2000));
    
    const clipData = await page.evaluate(async () => {
        try { return await navigator.clipboard.readText(); } catch(e) { return null; }
    });
    
    if (!clipData) throw new Error('Clipboard failed');
    
    const allRows = parseFullTSV(clipData);
    const rows = allRows.slice(1); // skip header
    
    cache.set(cacheKey, { rows, time: Date.now() });
    console.log(`✅ Scraped ${rows.length} rows from tab "${tabName}"`);
    return rows;
}

server.listen(PORT, () => {
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`  🌐 Proxy Server đang chạy: http://localhost:${PORT}`);
    console.log(`  📁 Session: ${SESSION_DIR}`);
    console.log(`  ⏱️ Cache TTL: ${CACHE_TTL/1000}s`);
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log('  API endpoints:');
    console.log(`    GET http://localhost:${PORT}/?action=ping`);
    console.log(`    GET http://localhost:${PORT}/?action=employee`);
    console.log(`    GET http://localhost:${PORT}/?action=supplier`);
    console.log(`    GET http://localhost:${PORT}/?action=master`);
    console.log(`    GET http://localhost:${PORT}/?action=clear_cache`);
    console.log('');
});

process.on('SIGINT', async () => {
    console.log('\n🔒 Đang tắt server...');
    if (browser) await browser.close();
    process.exit(0);
});
process.on('uncaughtException', (err) => console.error('Uncaught:', err.message));
