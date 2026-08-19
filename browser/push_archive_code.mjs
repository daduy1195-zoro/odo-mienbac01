import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const USER_DATA_DIR = path.join(__dirname, "..", "..", "App_tai_xe", "odo_script", "chrome_profile_ghn");
const CODE_FILE = "C:/Users/MSI/.gemini/antigravity/brain/c7e65cba-7a2c-4fec-9c6c-dd170166bef5/SyncOdoToArchive.gs";
const SCRIPT_URL = "https://script.google.com/u/0/home/projects/1pjUHvZclOXAyT4auMqaRbgVDdn-U2BWAkRN0qlfMsgutld7fJ8lMViyD/edit";

const newCode = fs.readFileSync(CODE_FILE, "utf-8");
console.log("?? Code archive: " + newCode.length + " ký t?");

console.log("?? Ðang m? Chrome ?n...");
const browser = await puppeteer.launch({
  headless: "new",
  userDataDir: USER_DATA_DIR,
  args: ["--no-sandbox", "--disable-gpu"],
  defaultViewport: { width: 1400, height: 900 }
});

try {
  const page = await browser.newPage();
  page.setDefaultTimeout(60000);
  
  console.log("? Ðang m? Apps Script project...");
  await page.goto(SCRIPT_URL, { waitUntil: "networkidle2", timeout: 60000 });
  
  const currentUrl = page.url();
  if (currentUrl.includes("accounts.google.com")) {
    console.log("? Session h?t h?n! Vui lòng login l?i.");
    await browser.close();
    process.exit(1);
  }
  
  console.log("? Ch? Monaco editor load...");
  await page.waitForSelector(".monaco-editor", { timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));
  
  console.log("?? Tìm file SyncOdoToArchive.gs...");
  const foundFile = await page.evaluate(() => {
    // Th? tìm text trong các th? span/div
    const items = Array.from(document.querySelectorAll("span, div"));
    for(let el of items) {
       if (el.textContent === "SyncOdoToArchive" || el.textContent === "SyncOdoToArchive.gs") {
           el.click();
           return true;
       }
    }
    return false;
  });

  if (!foundFile) {
     console.log("?? Không tìm th?y tên file SyncOdoToArchive, s? ghi dè vào model có ch?a ch? SYNC ODO...");
  }
  
  await new Promise(r => setTimeout(r, 2000));
  
  console.log("?? Ðang ghi code...");
  await page.evaluate((code) => {
    const models = monaco.editor.getModels();
    let target = models[0]; // fallback to first
    for(let m of models) {
       if (m.getValue().includes("SYNC ODO")) {
           target = m;
           break;
       }
    }
    if (target) target.setValue(code);
  }, newCode);
  
  await new Promise(r => setTimeout(r, 2000));
  
  await page.keyboard.down("Control");
  await page.keyboard.press("KeyS");
  await page.keyboard.up("Control");
  console.log("?? Ðang luu...");
  
  await new Promise(r => setTimeout(r, 5000));
  console.log("? PUSH CODE THÀNH CÔNG!");
} catch(e) {
  console.log("? L?i: " + e.message);
} finally {
  await browser.close();
}

