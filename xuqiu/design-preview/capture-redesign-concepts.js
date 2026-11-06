const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("@playwright/test");

const concepts = ["lab", "atlas", "factory", "field-manual"];
const outputDir = path.resolve(__dirname, "concepts/output");

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  for (const concept of concepts) {
    const source = path.resolve(__dirname, `concepts/concept-${concept}.html`);
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
      }));
      const filename = path.join(
        outputDir,
        `concept-${concept}-${device}.png`,
      );
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
