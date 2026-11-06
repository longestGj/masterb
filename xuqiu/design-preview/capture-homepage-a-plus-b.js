const path = require("node:path");
const { chromium } = require("@playwright/test");

const outputDir = path.resolve(__dirname, "output");
const stylesheet = path.resolve(__dirname, "homepage-a-plus-b.css");
const baseUrl = process.env.MB_LIVE_BASE_URL || "https://gzh.hzscf.site";

async function preparePage(browser, viewport) {
  const page = await browser.newPage({ viewport });
  await page.goto(`${baseUrl}/?design-preview=a-plus-b`, {
    waitUntil: "networkidle",
  });
  await page.addStyleTag({ path: stylesheet });
  await page.evaluate(() => {
    const note = document.querySelector(".mtm-home-hero__note");
    if (note && !document.querySelector(".mtm-home-hero__specs")) {
      const specs = document.createElement("div");
      specs.className = "wp-block-group mtm-home-hero__specs";
      specs.innerHTML = [
        ["Materials", "Black / White / Color"],
        ["Process fit", "Film / Molding / Extrusion"],
        ["Review basis", "Grade + application"],
      ]
        .map(
          ([label, value]) =>
            `<p class="mtm-home-hero__spec"><span>${label}</span><strong>${value}</strong></p>`,
        )
        .join("");
      note.after(specs);
    }

    const images = [
      ["guide-black-granules.jpg", "Black masterbatch granules"],
      ["guide-white-granules.jpg", "White masterbatch granules"],
      ["guide-color-granules.jpg", "Mixed-color masterbatch granules"],
    ];
    document
      .querySelectorAll(".mtm-home-products .mtm-home-card")
      .forEach((card, index) => {
        if (card.querySelector(".mtm-home-product-thumb")) return;
        const heading = card.querySelector("h3");
        const figure = document.createElement("figure");
        figure.className = "wp-block-image mtm-home-product-thumb";
        figure.innerHTML = `<img src="/wp-content/themes/mtm-b2b-masterbatch/assets/images/${images[index][0]}" alt="${images[index][1]}" />`;
        heading.before(figure);
      });
  });
  return page;
}

(async () => {
  const fs = require("node:fs");
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  for (const [name, viewport] of [
    ["desktop", { width: 1440, height: 1000 }],
    ["mobile", { width: 390, height: 844 }],
  ]) {
    const page = await preparePage(browser, viewport);
    const metrics = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
      h1: document.querySelectorAll("h1").length,
      productImages: document.querySelectorAll(
        ".mtm-home-products .mtm-home-product-thumb img",
      ).length,
    }));
    console.log(JSON.stringify({ name, ...metrics }));
    await page.screenshot({
      path: path.join(outputDir, `homepage-a-plus-b-${name}-hero.png`),
    });
    await page.screenshot({
      path: path.join(outputDir, `homepage-a-plus-b-${name}.png`),
      fullPage: true,
    });
    console.log(path.join(outputDir, `homepage-a-plus-b-${name}.png`));
    await page.close();
  }

  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
