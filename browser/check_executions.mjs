import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const USER_DATA_DIR = path.join(__dirname, "..", "..", "App_tai_xe", "odo_script", "chrome_profile_ghn");
const SCRIPT_URL = "https://script.google.com/u/0/home/projects/1pjUHvZclOXAyT4auMqaRbgVDdn-U2BWAkRN0qlfMsgutld7fJ8lMViyD/executions";

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    userDataDir: USER_DATA_DIR,
    args: ["--no-sandbox", "--disable-gpu"],
    defaultViewport: { width: 1400, height: 900 }
  });
  
  try {
    const page = await browser.newPage();
    await page.goto(SCRIPT_URL, { waitUntil: "networkidle2", timeout: 60000 });
    await page.waitForTimeout(5000);
    await page.screenshot({ path: "executions.png" });
    console.log("Screenshot saved to executions.png");
    await browser.close();
  } catch(e) {
    console.error(e);
    await browser.close();
  }
})();
