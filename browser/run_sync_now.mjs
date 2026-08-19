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
  page.setDefaultTimeout(120000);
  console.log("Opening Apps Script...");
  await page.goto(SCRIPT_URL, { waitUntil: "networkidle2" });
  await new Promise(r => setTimeout(r, 5000));

  // STRATEGY: Click the dropdown, use keyboard to type function name
  console.log("Step 1: Click function dropdown...");
  
  // Find the dropdown - it's the element showing "setupSyncTrigger" with a dropdown arrow
  // In Apps Script v2 IDE, this is a custom select widget
  const dropClicked = await page.evaluate(() => {
    // Look for the dropdown arrow icon next to the function name
    const spans = Array.from(document.querySelectorAll('span, div'));
    for (const s of spans) {
      const text = s.textContent.trim();
      // The dropdown shows current function name with arrow_drop_down icon
      if (text === 'setupSyncTrigger' && s.childElementCount === 0) {
        const rect = s.getBoundingClientRect();
        if (rect.top > 50 && rect.top < 110) { // toolbar area
          // Click the parent clickable element
          let target = s;
          for (let i = 0; i < 5; i++) {
            target = target.parentElement;
            if (!target) break;
            const role = target.getAttribute('role');
            if (role === 'button' || role === 'listbox' || target.tagName === 'SELECT') {
              target.click();
              return 'clicked parent ' + i + ' role=' + role;
            }
          }
          // Just click the span itself
          s.click();
          return 'clicked span directly';
        }
      }
    }
    
    // Alternative: find by arrow_drop_down near toolbar
    for (const s of spans) {
      if (s.textContent.trim() === 'arrow_drop_down' || s.textContent.trim().includes('▼')) {
        const rect = s.getBoundingClientRect();
        if (rect.top > 50 && rect.top < 110 && rect.left > 400 && rect.left < 800) {
          s.click();
          return 'clicked arrow_drop_down';
        }
      }
    }
    
    return 'not found';
  });
  console.log("  Result:", dropClicked);
  await new Promise(r => setTimeout(r, 1500));
  
  // Screenshot the open dropdown
  await page.screenshot({ path: "dropdown_open.png" });
  
  // Try to click syncAllToArchive in the dropdown menu
  const fnSelected = await page.evaluate(() => {
    // Look in all visible elements
    const allEls = Array.from(document.querySelectorAll('*'));
    const candidates = [];
    for (const el of allEls) {
      if (el.textContent.trim() === 'syncAllToArchive' && el.childElementCount === 0 && el.offsetParent !== null) {
        candidates.push({
          tag: el.tagName,
          class: el.className,
          rect: el.getBoundingClientRect()
        });
        el.click();
        return { clicked: true, candidates };
      }
    }
    
    // Also check for goog-menuitem-content  
    const menuItems = document.querySelectorAll('.goog-menuitem-content, [role="menuitem"], [role="option"]');
    for (const item of menuItems) {
      if (item.textContent.includes('syncAllToArchive')) {
        item.click();
        return { clicked: true, via: 'menuitem' };
      }
    }
    
    return { clicked: false, candidates };
  });
  console.log("  Function selected:", JSON.stringify(fnSelected));
  await new Promise(r => setTimeout(r, 1000));
  
  // Verify
  await page.screenshot({ path: "after_select.png" });
  
  // Step 2: Click Run
  console.log("Step 2: Clicking Run...");
  const runResult = await page.evaluate(() => {
    // Find the play_arrow button specifically
    const btns = Array.from(document.querySelectorAll('button, [role="button"]'));
    for (const b of btns) {
      const ariaLabel = b.getAttribute('aria-label') || '';
      const title = b.getAttribute('title') || '';
      if (ariaLabel.includes('Chạy') || ariaLabel.includes('Run') || title.includes('Run')) {
        b.click();
        return 'clicked via aria-label';
      }
    }
    // Try by content
    for (const b of btns) {
      const text = (b.textContent || '').trim();
      if (text === 'play_arrow\nChạy' || text === 'play_arrowChạy' || text === 'Chạy') {
        b.click();
        return 'clicked via text: ' + text.substring(0, 30);
      }
    }
    return 'not found';
  });
  console.log("  Run result:", runResult);
  
  // Wait and check for auth (should be already authorized from previous run)
  await new Promise(r => setTimeout(r, 4000));
  
  const needsAuth = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.some(b => b.textContent.includes('Xem lại quyền') || b.textContent.includes('Review'));
  });
  
  if (needsAuth) {
    console.log("  Still needs auth! Will need manual intervention.");
    await page.screenshot({ path: "needs_auth.png" });
  } else {
    console.log("  No auth needed - execution should be running!");
  }
  
  // Step 3: Wait for execution
  console.log("Step 3: Waiting for sync execution (up to 300s)...");
  let foundCompletion = false;
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 5000));
    
    // Take periodic screenshots
    if (i % 12 === 0) {
      await page.screenshot({ path: `sync_progress_${Math.floor(i/12)}.png` });
    }
    
    // Check execution log
    const logContent = await page.evaluate(() => {
      // The execution log panel is below the editor
      const panels = document.querySelectorAll('div');
      for (const p of panels) {
        const cls = p.className || '';
        if (cls.includes('execution') || cls.includes('console') || cls.includes('log')) {
          const text = p.innerText || '';
          if (text.includes('Da ghi') || text.includes('Execution completed') || text.includes('LOI') || text.includes('Exception') || text.includes('error')) {
            return text.substring(0, 1000);
          }
        }
      }
      return null;
    });
    
    if (logContent) {
      console.log(`  [${(i+1)*5}s] FOUND LOG: ${logContent.substring(0, 200)}`);
      foundCompletion = true;
      break;
    }
    
    if (i % 6 === 0) {
      console.log(`  [${(i+1)*5}s] Still running...`);
    }
  }
  
  if (!foundCompletion) {
    console.log("  Timed out waiting for logs, but execution may have completed.");
  }
  
  await page.screenshot({ path: "sync_final.png" });
  console.log("Final screenshot saved.");

} catch(e) {
  console.log("Error:", e.message);
} finally {
  await browser.close();
  console.log("Done.");
}
