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
const liveThemeVersion =
  process.env.MB_LIVE_THEME_VERSION ||
  fs
    .readFileSync(path.join(THEME_ROOT, "style.css"), "utf8")
    .match(/^Version:\s*(\S+)$/m)?.[1];

function readThemeFile(relativePath) {
  return fs.readFileSync(path.join(THEME_ROOT, relativePath), "utf8");
}

function renderProductPreview() {
  const header = readThemeFile("parts/header.html");
  const footer = readThemeFile("parts/footer.html");
  const template = readThemeFile("templates/page-bk020-product.html")
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
  const productStyle = readThemeFile("assets/css/bk020-product.css");
  const chromeStyle = readThemeFile("assets/css/site-chrome.css");
  const chromeScript = readThemeFile("assets/js/site-chrome.js");

  return `<!doctype html>
<html lang="en" data-type="product">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="page-type" content="product">
  <meta name="site-kind" content="other">
  <title>Black Masterbatch BK020 | 20% Carbon Black</title>
  <meta name="description" content="BK020 is a 20% carbon black masterbatch with a PE carrier and 47.8% CaCO3 filler for trash bags, injection molding and re-granulating.">
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    .wp-site-blocks { display: block; }
    .wp-block-template-part { margin: 0; }
    ${tokenStyle}
    ${baseStyle}
    ${chromeStyle}
    ${productStyle}
  </style>
</head>
<body class="page mtm-bk020-page">
  <div class="wp-site-blocks">${template}</div>
  <script>${chromeScript}</script>
</body>
</html>`;
}

test.beforeEach(async ({ page }) => {
  await page.setContent(renderProductPreview(), {
    waitUntil: "domcontentloaded",
  });
});

test("renders the approved BK020 product page", async ({ page }) => {
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText("Black Masterbatch BK020");
  await expect(page.locator("main > section")).toHaveCount(10);
  await expect(page.locator(".bk-breadcrumb")).toContainText(
    /Products\s*\/\s*Black masterbatch\s*\/\s*BK020/,
  );
  await expect(page.locator(".bk-table-wrap tbody tr")).toHaveCount(15);
  await expect(page.locator(".bk-faq details")).toHaveCount(40);
  await expect(page.locator(".bk-faq-group")).toHaveCount(6);
  await expect(page.locator(".bk-faq-nav a")).toHaveCount(6);

  const questions = await page
    .locator(".bk-faq details summary")
    .allTextContents();
  expect(new Set(questions).size).toBe(40);

  expect(await page.locator(".bk-page").innerText()).not.toMatch(
    /for standard BK020 in stock.*ship quickly|Yes, we support OEM|provide a certificate of analysis.*each lot/i,
  );
});

test("preserves every FAQ title from the approved BK020 source", () => {
  const source = fs.readFileSync(
    path.resolve(
      WORDPRESS_ROOT,
      "..",
      "..",
      "product",
      "BK020-产品页.md",
    ),
    "utf8",
  );
  const template = readThemeFile("templates/page-bk020-product.html");
  const sourceQuestions = [
    ...source.matchAll(/^### (.+)$/gm),
  ].map((match) => match[1]);
  const renderedQuestions = [
    ...template.matchAll(/<details><summary>(.*?)<\/summary>/g),
  ].map((match) => match[1].replaceAll("&amp;", "&"));

  expect(sourceQuestions).toHaveLength(40);
  expect(renderedQuestions).toEqual(sourceQuestions);
});

test("fits the expanded BK020 buyer guide at every core width", async ({
  page,
}) => {
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width <= 390 ? 844 : 900 });
    const layout = await page.evaluate(() => ({
      viewportWidth: document.documentElement.clientWidth,
      documentWidth: document.documentElement.scrollWidth,
      groups: Array.from(document.querySelectorAll(".bk-faq-group")).map(
        (group) => {
          const rect = group.getBoundingClientRect();
          return {
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            width: Math.round(rect.width),
          };
        },
      ),
    }));
    expect(layout.documentWidth, `${width}px`).toBeLessThanOrEqual(
      layout.viewportWidth + 1,
    );
    for (const group of layout.groups) {
      expect(group.left, `${width}px FAQ left`).toBeGreaterThanOrEqual(0);
      expect(group.right, `${width}px FAQ right`).toBeLessThanOrEqual(
        layout.viewportWidth + 1,
      );
      expect(group.width, `${width}px FAQ width`).toBeGreaterThan(0);
    }
  }
});

test("serves the BK020 page on the live product route", async ({ page }) => {
  test.skip(!liveBaseUrl, "Set MB_LIVE_BASE_URL to run live checks.");
  test.setTimeout(120_000);

  const response = await page.goto(
    `${liveBaseUrl}/products/black-masterbatch/bk020/`,
    { waitUntil: "networkidle" },
  );
  expect(response?.status()).toBe(200);
  await expect(page.locator("body")).toHaveClass(/mtm-bk020-page/);
  await expect(page.locator("h1")).toHaveText("Black Masterbatch BK020");
  await expect(page).toHaveTitle(
    "Black Masterbatch BK020 | 20% Carbon Black Grade",
  );
  await expect(page.locator(".bk-table-wrap tbody tr")).toHaveCount(15);
  await expect(page.locator(".bk-faq details")).toHaveCount(40);
  await expect(page.locator(".bk-faq-group")).toHaveCount(6);
  await expect(page.locator(".bk-breadcrumb")).not.toContainText("Home");

  const stylesheet = await page
    .locator('link[rel="stylesheet"][href*="bk020-product.css"]')
    .getAttribute("href");
  expect(stylesheet).toContain(`ver=${liveThemeVersion}`);

  const layout = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
  }));
  expect(layout.document).toBeLessThanOrEqual(layout.viewport + 1);
});
