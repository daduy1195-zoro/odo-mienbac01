const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('file:///C:/Users/MSI/Desktop/AI/Odo/index.html');
  await page.waitForTimeout(10000); // wait for data to load
  
  const data = await page.evaluate(() => {
      if (!window.nccTripData) return 'No nccTripData';
      return window.nccTripData
          .filter(r => (r.plate || '').replace(/-/g,'').includes('29E68857'))
          .map(r => ({
              date: r.dateStr,
              plate: r.plate,
              kmStart: r.kmStart,
              kmEnd: r.kmEnd,
              kmDiff: r.kmDiff,
              tripCode: r.ghnTripCode
          }));
  });
  
  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
