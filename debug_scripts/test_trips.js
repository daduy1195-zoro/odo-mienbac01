const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file:///C:/Users/MSI/Desktop/AI/Odo/index.html');
  await page.waitForTimeout(10000);
  const data = await page.evaluate(() => {
      try {
          return eval('tripsData').filter(r => (r.plate || '').replace(/-/g,'').includes('29E68857')).map(r => ({ date: r.dateStr, plate: r.plate, tripCode: r.tripCode }));
      } catch(e) { return e.toString(); }
  });
  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
