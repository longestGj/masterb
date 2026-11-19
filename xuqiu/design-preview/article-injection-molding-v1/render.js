const { chromium } = require('/Users/ssl/workspace/zhou/masterb/xuqiu/wordpress/node_modules/playwright');
const path = require('node:path');

(async () => {
  const dir = __dirname;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(dir, 'cover.html'), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(dir, 'cover.png') });
  await browser.close();
  console.log('rendered cover.png');
})();
