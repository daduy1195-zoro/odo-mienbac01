/**
 * Push code proxy_apps_script.js lên Apps Script GHN (CHẠY ẨN)
 * Dùng chung session chrome_profile_ghn từ app_tai_xe
 * 
 * Chạy: node browser/push_proxy_code.mjs
 */
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Dùng chung session GHN đã đăng nhập từ app_tai_xe
const USER_DATA_DIR = path.join(__dirname, '..', '..', 'App_tai_xe', 'odo_script', 'chrome_profile_ghn');

// Code proxy cần push
const CODE_FILE = path.join(__dirname, '..', 'proxy_apps_script.js');

// Apps Script project mà sếp chỉ định
const SCRIPT_URL = 'https://script.google.com/u/0/home/projects/1pjUHvZclOXAyT4auMqaRbgVDdn-U2BWAkRN0qlfMsgutld7fJ8lMViyD/edit';

// Đọc code
const newCode = fs.readFileSync(CODE_FILE, 'utf-8');
console.log('📄 Code proxy: ' + newCode.length + ' ký tự');

console.log('🚀 Đang mở Chrome ẩn (dùng session GHN từ app_tai_xe)...');
const browser = await puppeteer.launch({
  headless: 'new',
  userDataDir: USER_DATA_DIR,
  args: ['--no-sandbox', '--disable-gpu'],
  defaultViewport: { width: 1400, height: 900 }
});

try {
  const page = await browser.newPage();
  page.setDefaultTimeout(60000);
  
  console.log('🌐 Đang mở Apps Script project...');
  await page.goto(SCRIPT_URL, { waitUntil: 'networkidle2', timeout: 60000 });
  
  // Check xem có bị redirect về login không
  const currentUrl = page.url();
  if (currentUrl.includes('accounts.google.com')) {
    console.log('❌ Session hết hạn! Chạy lại login_ghn.js trước.');
    await browser.close();
    process.exit(1);
  }
  
  console.log('⏳ Chờ Monaco editor load...');
  await page.waitForSelector('.monaco-editor', { timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));
  
  // Dùng Monaco API trực tiếp để set code
  console.log('📝 Đang ghi code proxy...');
  await page.evaluate((code) => {
    const editor = monaco.editor.getModels()[0];
    if (editor) {
      editor.setValue(code);
    }
  }, newCode);
  
  await new Promise(r => setTimeout(r, 2000));
  
  // Ctrl+S: Lưu
  await page.keyboard.down('Control');
  await page.keyboard.press('KeyS');
  await page.keyboard.up('Control');
  console.log('💾 Đang lưu...');
  
  await new Promise(r => setTimeout(r, 5000));
  
  console.log('');
  console.log('✅✅✅ PUSH CODE PROXY THÀNH CÔNG! ✅✅✅');
  console.log('');
  console.log('Code đã được ghi vào Apps Script project:');
  console.log(SCRIPT_URL);
  console.log('');
  console.log('👉 Bước tiếp: Deploy web app từ trang Apps Script:');
  console.log('   Deploy → New deployment → Web app → Execute as: Me → Anyone → Deploy');
  console.log('   → Copy URL → Dán vào PROXY_API_URL trong index.html');
  
} catch(e) {
  console.log('❌ Lỗi: ' + e.message);
} finally {
  await browser.close();
}
