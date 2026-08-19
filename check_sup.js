const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    userDataDir: "C:\\Users\\MSI\\Desktop\\App_tai_xe\\odo_script\\chrome_profile_ghn",
    args: ["--no-sandbox", "--disable-gpu"]
  });
  
  try {
    const page = await browser.newPage();
    await page.goto("https://docs.google.com/spreadsheets/d/14zXhTqxD7VsN_PE3OxNY7hLss8zxG4zUNT_cNN9QV90/edit", { waitUntil: "networkidle2" });
    await page.waitForTimeout(5000);
    
    // Evaluate the grid data (just read the first few cells to see columns)
    const data = await page.evaluate(() => {
      // Very hacky way to extract cell text from the DOM
      const cells = Array.from(document.querySelectorAll('.cell-input')).map(el => el.textContent);
      return cells;
    });
    console.log("Found cells length:", data.length);
    
    await browser.close();
  } catch(e) {
    console.error(e);
    await browser.close();
  }
})();
