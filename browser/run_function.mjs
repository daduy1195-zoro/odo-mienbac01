import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const USER_DATA_DIR = path.join(__dirname, "..", "..", "App_tai_xe", "odo_script", "chrome_profile_ghn");
const SCRIPT_URL = "https://script.google.com/u/0/home/projects/1pjUHvZclOXAyT4auMqaRbgVDdn-U2BWAkRN0qlfMsgutld7fJ8lMViyD/edit";

const FUNCTION_NAME = process.argv[2] || 'syncNccTrips';

const browser = await puppeteer.launch({
  headless: "new",
  userDataDir: USER_DATA_DIR,
  args: ["--no-sandbox", "--disable-gpu"],
  defaultViewport: { width: 1400, height: 900 }
});

try {
  const page = await browser.newPage();
  page.setDefaultTimeout(120000);
  console.log(`Opening Apps Script to run: ${FUNCTION_NAME}...`);
  await page.goto(SCRIPT_URL, { waitUntil: "networkidle2" });
  await new Promise(r => setTimeout(r, 5000));

  // Click the function dropdown
  console.log("Clicking function dropdown...");
  await page.evaluate(() => {
    const spans = Array.from(document.querySelectorAll('span, div'));
    for (const s of spans) {
      const text = s.textContent.trim();
      if ((text === 'setupSyncTrigger' || text === 'syncAllToArchive' || text === 'syncNccTrips' || text === 'syncEmployeeOdo') && s.childElementCount === 0) {
        const rect = s.getBoundingClientRect();
        if (rect.top > 50 && rect.top < 110) {
          let target = s;
          for (let i = 0; i < 5; i++) {
            target = target.parentElement;
            if (!target) break;
            if (target.getAttribute('role') === 'listbox') { target.click(); return; }
          }
          s.click();
          return;
        }
      }
    }
  });
  await new Promise(r => setTimeout(r, 1500));

  // Select the target function
  console.log(`Selecting ${FUNCTION_NAME}...`);
  const selected = await page.evaluate((fnName) => {
    const items = document.querySelectorAll('[role="menuitem"], [role="option"], .goog-menuitem-content');
    for (const item of items) {
      if (item.textContent.trim() === fnName || item.textContent.includes(fnName)) {
        item.click();
        return true;
      }
    }
    // Fallback: find any element with exact text
    const allEls = Array.from(document.querySelectorAll('*'));
    for (const el of allEls) {
      if (el.childElementCount === 0 && el.textContent.trim() === fnName && el.offsetParent !== null) {
        el.click();
        return true;
      }
    }
    return false;
  }, FUNCTION_NAME);
  console.log("Selected:", selected);
  await new Promise(r => setTimeout(r, 1000));

  // Click Run
  console.log("Clicking Run...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, [role="button"]'));
    for (const b of btns) {
      const label = b.getAttribute('aria-label') || '';
      if (label.includes('Chạy') || label.includes('Run')) { b.click(); return; }
    }
  });
  
  console.log("Waiting for execution (up to 400s)...");
  for (let i = 0; i < 80; i++) {
    await new Promise(r => setTimeout(r, 5000));
    if (i % 12 === 0) console.log(`  [${(i+1)*5}s] Still running...`);
  }
  
  await page.screenshot({ path: "sync_ncc_final.png" });
  console.log("Done. Screenshot: sync_ncc_final.png");

} catch(e) {
  console.log("Error:", e.message);
} finally {
  await browser.close();
}
