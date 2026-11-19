const { expect, test } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");

const WORDPRESS_ROOT = path.resolve(__dirname, "..");
const THEME_ROOT = path.join(
  WORDPRESS_ROOT,
  "themes",
  "mtm-b2b-masterbatch",
);
const liveBaseUrl = process.env.MB_LIVE_BASE_URL;

function readThemeFile(relativePath) {
  return fs.readFileSync(path.join(THEME_ROOT, relativePath), "utf8");
}

function renderCategoryPreview() {
  const header = readThemeFile("parts/header.html");
  const footer = readThemeFile("parts/footer.html");
  const template = readThemeFile(
    "templates/page-desiccant-masterbatch.html",
  )
    .replace(
      /<!-- wp:template-part \{"slug":"header"[^>]*\/-->/,
      header,
    )
    .replace(
      /<!-- wp:template-part \{"slug":"footer"[^>]*\/-->/,
      footer,
    );
  const tokenStyle = readThemeFile("assets/css/design-tokens.css");
  const baseStyle = readThemeFile("style.css");
  const blackGuideStyle = readThemeFile(
    "assets/css/black-masterbatch-guide.css",
  );
  const categoryStyle = readThemeFile(
    "assets/css/desiccant-category.css",
  );
  const chromeStyle = readThemeFile("assets/css/site-chrome.css");
  const chromeScript = readThemeFile("assets/js/site-chrome.js");

  return `<!doctype html>
<html lang="en" data-type="product">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="page-type" content="product">
  <meta name="site-kind" content="other">
  <title>Desiccant Masterbatch | CaO Moisture Control | GE CHEMICAL</title>
  <meta name="description" content="Review CaO desiccant masterbatch for moisture-exposed injection, extrusion and film blowing. Compare DM2476G and share the resin and process for review.">
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    .wp-site-blocks { display: block; }
    .wp-block-template-part { margin: 0; }
    ${tokenStyle}
    ${baseStyle}
    ${chromeStyle}
    ${blackGuideStyle}
    ${categoryStyle}
  </style>
</head>
<body class="page mtm-black-guide-page mtm-desiccant-category">
  <div class="wp-site-blocks">${template}</div>
  <script>${chromeScript}</script>
</body>
</html>`;
}

test.beforeEach(async ({ page }) => {
  await page.setContent(renderCategoryPreview(), {
    waitUntil: "domcontentloaded",
  });
});

test("renders the approved Desiccant category page", async ({ page }) => {
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText(
    "Desiccant Masterbatch for Moisture-Exposed Plastics",
  );
  await expect(page.locator("main > section")).toHaveCount(10);
  await expect(page.locator(".bm-breadcrumb")).toContainText(
    /Products\s*\/\s*Desiccant Masterbatch/,
  );
  await expect(page.locator(".bm-breadcrumb")).not.toContainText("Home");
  await expect(page.locator(".bm-guide-map a")).toHaveCount(7);
  await expect(page.locator(".bm-md-grade-table tbody tr")).toHaveCount(7);
  await expect(page.locator(".bm-faq-group")).toHaveCount(2);
  await expect(page.locator(".bm-faq-group details")).toHaveCount(8);

  const images = page.locator("main img");
  await expect(images).toHaveCount(5);
  for (const source of await images.evaluateAll((items) =>
    items.map((image) => image.getAttribute("src")),
  )) {
    expect(source).toMatch(
      /^\/wp-content\/themes\/mtm-b2b-masterbatch\/assets\/images\/desiccant-category-.*\.webp$/,
    );
  }
  for (const alt of await images.evaluateAll((items) =>
    items.map((image) => image.getAttribute("alt")),
  )) {
    expect(alt).toMatch(/\S+/);
  }

  const text = await page.locator("main").innerText();
  expect(text).toContain("75.9% CaO");
  expect(text).toContain("24% recycled PE");
  expect(text).toContain("0.10% max");
  expect(text).toContain("1% starting point");
  expect(text).not.toMatch(/Food Grade Yes|FDA approved|REACH compliant/i);
});

test("fits the Desiccant category at core widths", async ({ page }) => {
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width <= 390 ? 844 : 900 });
    const layout = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth,
      h1: document.querySelectorAll("h1").length,
    }));
    expect(layout.document, `${width}px`).toBeLessThanOrEqual(
      layout.viewport + 1,
    );
    expect(layout.h1, `${width}px H1`).toBe(1);
  }
});

test("serves the Desiccant category on the live route", async ({ page }) => {
  test.skip(!liveBaseUrl, "Set MB_LIVE_BASE_URL to run live checks.");
  test.setTimeout(120_000);

  const response = await page.goto(
    `${liveBaseUrl}/products/desiccant-masterbatch/`,
    { waitUntil: "networkidle" },
  );
  expect(response?.status()).toBe(200);
  await expect(page.locator("body")).toHaveClass(
    /mtm-black-guide-page/,
  );
  await expect(page.locator("body")).toHaveClass(
    /mtm-desiccant-category/,
  );
  await expect(page.locator("h1")).toHaveText(
    "Desiccant Masterbatch for Moisture-Exposed Plastics",
  );
  await expect(page.locator(".bm-breadcrumb")).toContainText(
    /Products\s*\/\s*Desiccant Masterbatch/,
  );
  await expect(page.locator(".bm-faq-group details")).toHaveCount(8);

  const layout = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
  }));
  expect(layout.document).toBeLessThanOrEqual(layout.viewport + 1);
});
