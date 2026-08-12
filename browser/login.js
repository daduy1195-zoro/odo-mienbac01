/**
 * ============================================
 * LOGIN & LƯU SESSION - Bước 1: Đăng nhập tài khoản GHN
 * ============================================
 * 
 * Chạy: node browser/login.js
 * 
 * Mở trình duyệt Chromium → Mày đăng nhập tài khoản GHN →
 * Đóng trình duyệt → Session tự động lưu vào thư mục browser/session/
 * 
 * Lần sau chạy proxy_server.js sẽ tự dùng session này, không cần đăng nhập lại.
 */

const puppeteer = require('puppeteer');
const path = require('path');

const SESSION_DIR = path.join(__dirname, 'session');
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1vI_rzcjX6F12SOm06QvEo9W2s5kiDjYcRtvm2kWuCXo/edit?gid=409459817';

(async () => {
    console.log('🚀 Đang mở trình duyệt...');
    console.log('📁 Session sẽ lưu tại:', SESSION_DIR);
    console.log('');
    
    const browser = await puppeteer.launch({
        headless: false,  // Mở trình duyệt thật để đăng nhập
        userDataDir: SESSION_DIR,  // Lưu cookies, session, profile
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--window-size=1280,900'
        ],
        defaultViewport: { width: 1280, height: 900 }
    });

    const page = await browser.newPage();
    
    // Mở trang Google Sheet để đăng nhập
    console.log('📋 Đang mở Google Sheet...');
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('  👉 ĐĂNG NHẬP BẰNG TÀI KHOẢN GHN CÔNG TY           ');
    console.log('  👉 Sau khi đăng nhập xong và thấy được bảng tính   ');
    console.log('  👉 Quay lại đây nhấn Enter để lưu session          ');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    
    await page.goto(SHEET_URL, { waitUntil: 'networkidle2', timeout: 120000 }).catch(() => {});
    
    // Đợi user đăng nhập xong
    await new Promise(resolve => {
        process.stdin.setEncoding('utf8');
        process.stdin.once('data', () => resolve());
    });
    
    // Kiểm tra đã đăng nhập chưa
    const title = await page.title();
    const url = page.url();
    
    console.log('📄 Tiêu đề trang:', title);
    console.log('🔗 URL hiện tại:', url);
    
    if (url.includes('accounts.google.com')) {
        console.log('');
        console.log('⚠️ Có vẻ chưa đăng nhập xong. Hãy đăng nhập rồi chạy lại.');
    } else {
        console.log('');
        console.log('✅ Đăng nhập thành công! Session đã lưu.');
        console.log('📁 Session lưu tại:', SESSION_DIR);
        console.log('');
        console.log('👉 Bây giờ chạy: node browser/proxy_server.js');
        console.log('   để khởi động proxy server.');
    }
    
    await browser.close();
    console.log('🔒 Trình duyệt đã đóng.');
    process.exit(0);
})();
