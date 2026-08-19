import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const USER_DATA_DIR = path.join(__dirname, '..', '..', 'App_tai_xe', 'odo_script', 'chrome_profile_ghn');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    userDataDir: USER_DATA_DIR
  });
  const page = await browser.newPage();
  await page.goto('https://docs.google.com/spreadsheets/d/174ZaGkN2_oTrDmNfY9Tr99zHxdvjX4lOVCMwlEcyvLU/edit', { waitUntil: 'networkidle2' });
  
  await new Promise(r => setTimeout(r, 5000));
  
  const sheetInfo = await page.evaluate(() => {
    // This is hard to get from DOM, let's just grab all tab names
    const tabs = Array.from(document.querySelectorAll('.docs-sheet-tab-name'));
    return tabs.map(t => t.textContent).join(', ');
  });
  console.log('Tabs:', sheetInfo);
  
  await browser.close();
})();
