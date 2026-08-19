import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const USER_DATA_DIR = path.join(__dirname, "..", "..", "App_tai_xe", "odo_script", "chrome_profile_ghn");
const SCRIPT_URL = "https://script.google.com/u/0/home/projects/1pjUHvZclOXAyT4auMqaRbgVDdn-U2BWAkRN0qlfMsgutld7fJ8lMViyD/edit";

const browser = await puppeteer.launch({
  headless: "new",
  userDataDir: USER_DATA_DIR,
  args: ["--no-sandbox", "--disable-gpu"],
  defaultViewport: { width: 1400, height: 900 }
});

try {
  const page = await browser.newPage();
  page.setDefaultTimeout(60000);
  console.log("Opening Apps Script...");
  await page.goto(SCRIPT_URL, { waitUntil: "networkidle2" });
  
  await new Promise(r => setTimeout(r, 5000));
  
  await page.screenshot({ path: "apps_script_screenshot.png", fullPage: true });
  console.log("Screenshot saved to apps_script_screenshot.png");
  
  // also dump all button texts
  const btns = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("button, div[role='button']")).map(b => b.innerText || b.getAttribute("aria-label"));
  });
  console.log("Buttons found:", btns.filter(b => b && b.trim() !== "").join(" | "));
  
} catch(e) {
  console.log("Error:", e.message);
} finally {
  await browser.close();
}

