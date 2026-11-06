const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("../../wordpress/node_modules/@playwright/test");

const concepts = ["field-note", "technical-dossier", "material-map"];
const outputDir = path.resolve(__dirname, "output");

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  for (const concept of concepts) {
    const source = path.resolve(__dirname, `article-${concept}.html`);
    const url = pathToFileURL(source).href;

    for (const [device, viewport] of [
      ["desktop", { width: 1440, height: 1000 }],
      ["mobile", { width: 390, height: 844 }],
    ]) {
      const page = await browser.newPage({ viewport });
      await page.goto(url, { waitUntil: "networkidle" });
      const metrics = await page.evaluate(() => ({
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
        h1Count: document.querySelectorAll("h1").length,
      }));
      const filename = path.join(outputDir, `${concept}-${device}.png`);
      await page.screenshot({ path: filename, fullPage: true });
      console.log(JSON.stringify({ concept, device, ...metrics, filename }));
      await page.close();
    }
  }

  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
