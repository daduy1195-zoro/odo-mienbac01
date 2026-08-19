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
  
  // Choose syncAllToArchive from the dropdown
  await page.evaluate(() => {
    // This is tricky, let's just find the Run button and click it, it should run whatever is selected (usually syncAllToArchive or syncEmployeeOdo)
    const btns = Array.from(document.querySelectorAll("div[role='button']"));
    const runBtn = btns.find(b => b.innerText && b.innerText.includes("Ch?y"));
    if (runBtn) {
      runBtn.click();
    }
  });
  
  console.log("Clicked run. Waiting for execution...");
  
  // Wait for execution to finish
  await new Promise(r => setTimeout(r, 15000));
  
  console.log("Done waiting.");
  
} catch(e) {
  console.log("Error:", e.message);
} finally {
  await browser.close();
}

