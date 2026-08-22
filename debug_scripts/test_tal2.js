const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log(msg.text()));
  await page.goto('file:///C:/Users/MSI/Desktop/AI/Odo/index.html');
  await page.waitForTimeout(15000);
  const data = await page.evaluate(() => {
      if (!window.nccTripData) return 'No nccTripData';
      return window.nccTripData
          .filter(r => (r.plate || '').replace(/-/g,'').includes('29E68857'))
          .map(r => ({ date: r.dateStr, plate: r.plate, kmStart: r.kmStart, kmEnd: r.kmEnd, kmDiff: r.kmDiff, tripCode: r.ghnTripCode }));
  });
  console.log('Result:', JSON.stringify(data, null, 2));
  await browser.close();
})();
