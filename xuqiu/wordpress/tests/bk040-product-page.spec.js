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
const themeVersion = fs
  .readFileSync(path.join(THEME_ROOT, "style.css"), "utf8")
  .match(/^Version:\s*(\S+)$/m)?.[1];

function readThemeFile(relativePath) {
  return fs.readFileSync(path.join(THEME_ROOT, relativePath), "utf8");
}

function renderProductPreview() {
  const header = readThemeFile("parts/header.html");
  const footer = readThemeFile("parts/footer.html");
  const template = readThemeFile("templates/page-bk040-product.html")
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
  const productStyle = readThemeFile("assets/css/bk040-product.css");
  const chromeStyle = readThemeFile("assets/css/site-chrome.css");
  const chromeScript = readThemeFile("assets/js/site-chrome.js");

  return `<!doctype html>
<html lang="en" data-type="product">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="page-type" content="product">
  <meta name="site-kind" content="other">
  <title>40% Carbon Black Masterbatch (BK040) | Film &amp; Molding</title>
  <meta name="description" content="BK040 uses 40% carbon black in a PE carrier with 5.8% CaCO3 filler for film and injection molding. Review specs, dosage and request a sample.">
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
<body class="page mtm-bk040-page">
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

test("renders the approved BK040 product page", async ({
  page,
}, testInfo) => {
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText(
    "40% Carbon Black Masterbatch — BK040",
  );
  await expect(page.locator("main > section")).toHaveCount(10);
  await expect(page.locator(".bk-breadcrumb a")).toHaveCount(1);
  await expect(page.locator(".bk-breadcrumb a")).toHaveText(
    "Black masterbatch",
  );
  await expect(page.locator(".bk-breadcrumb")).toContainText(
    /Products\s*\/\s*Black masterbatch\s*\/\s*BK040/,
  );
  await expect(page.locator(".bk-breadcrumb [aria-current='page']")).toHaveText(
    "BK040",
  );
  await expect(page.locator(".bk-breadcrumb")).not.toContainText("Home");

  await expect(page.locator(".bk-grade-track li")).toHaveCount(5);
  await expect(page.locator(".bk-table-wrap tbody tr")).toHaveCount(13);
  await expect(page.locator(".bk-faq details")).toHaveCount(8);
  await expect(page.locator(".bk-final__fields span")).toHaveCount(4);

  const images = page.locator("main img");
  await expect(images).toHaveCount(5);
  for (const source of await images.evaluateAll((items) =>
    items.map((image) => image.getAttribute("src")),
  )) {
    expect(source).toMatch(
      /^\/wp-content\/themes\/mtm-b2b-masterbatch\/assets\/images\/bk040-.*\.webp$/,
    );
  }
  for (const alt of await images.evaluateAll((items) =>
    items.map((image) => image.getAttribute("alt")),
  )) {
    expect(alt).toMatch(/\S+/);
  }

  const quoteLinks = page.locator(
    'main a[href*="product_grade=BK040"][href$="source=bk040"]',
  );
  const sampleLinks = page.locator(
    'main a[href*="product_grade=BK040"][href*="source=bk040-sample"]',
  );
  await expect(quoteLinks).toHaveCount(2);
  await expect(sampleLinks).toHaveCount(3);

  const layout = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    applicationRows: Array.from(
      document.querySelectorAll(".bk-application-route"),
    ).map((row) => Math.round(row.getBoundingClientRect().height)),
    tdsGap: Math.round(
      document.querySelector(".bk-specs__note .bk-button").getBoundingClientRect()
        .top -
        document.querySelector(".bk-packaging-media").getBoundingClientRect()
          .bottom,
    ),
  }));
  expect(layout.document).toBeLessThanOrEqual(layout.viewport + 1);
  expect(layout.tdsGap).toBeGreaterThanOrEqual(20);
  expect(Math.max(...layout.applicationRows)).toBeLessThanOrEqual(
    testInfo.project.name === "desktop" ? 120 : 170,
  );

  const firstFaq = page.locator(".bk-faq details").first();
  await firstFaq.locator("summary").click();
  await expect(firstFaq).toHaveAttribute("open", "");

  await page.screenshot({
    path: testInfo.outputPath(`bk040-product-${testInfo.project.name}.png`),
    fullPage: true,
  });
});

test("resolves under the Black Masterbatch hierarchy", async () => {
  const template = readThemeFile("templates/page-bk040-product.html");
  const content = fs.readFileSync(
    path.join(WORDPRESS_ROOT, "content", "products", "bk040.md"),
    "utf8",
  );

  expect(template).toContain("<span>Products</span>");
  expect(template).toContain('href="/products/black-masterbatch/"');
  expect(template).not.toContain("127.0.0.1");
  expect(template).not.toContain("localhost");
  expect(template).not.toContain("design-preview");
  expect(content).toContain('path: "/products/black-masterbatch/bk040/"');
  expect(content).toContain('parent_slug: "black-masterbatch"');
});

test("serves the BK040 page on the live product route", async ({
  page,
}, testInfo) => {
  test.skip(!liveBaseUrl, "Set MB_LIVE_BASE_URL to run live checks.");
  test.setTimeout(120_000);

  const response = await page.goto(
    `${liveBaseUrl}/products/black-masterbatch/bk040/`,
    { waitUntil: "networkidle" },
  );
  expect(response?.status()).toBe(200);
  await expect(page.locator("body")).toHaveClass(/mtm-bk040-page/);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText(
    "40% Carbon Black Masterbatch — BK040",
  );
  await expect(page).toHaveTitle(
    "40% Carbon Black Masterbatch (BK040) | Film & Molding",
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /40% carbon black.*5\.8% CaCO3.*film.*injection molding/i,
  );
  await expect(page.locator("main > section")).toHaveCount(10);
  await expect(page.locator(".bk-table-wrap tbody tr")).toHaveCount(13);
  await expect(page.locator(".bk-faq details")).toHaveCount(8);
  await expect(page.locator('html')).toHaveAttribute("data-type", "product");
  await expect(page.locator('meta[name="page-type"]')).toHaveAttribute(
    "content",
    "product",
  );
  await expect(page.locator('meta[name="site-kind"]')).toHaveAttribute(
    "content",
    "other",
  );

  const stylesheet = await page
    .locator('link[rel="stylesheet"][href*="bk040-product.css"]')
    .getAttribute("href");
  expect(stylesheet).toContain(`ver=${themeVersion}`);

  await page.evaluate(async () => {
    document.querySelectorAll("img[loading='lazy']").forEach((image) => {
      image.loading = "eager";
    });
    const step = Math.max(window.innerHeight * 0.8, 500);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 35));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForFunction(
    () =>
      Array.from(document.querySelectorAll(".bk-page img")).every(
        (image) => image.complete && image.naturalWidth > 0,
      ),
    null,
    { timeout: 90_000 },
  );

  const metrics = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    brokenImages: Array.from(document.querySelectorAll(".bk-page img"))
      .filter((image) => !image.complete || image.naturalWidth === 0)
      .map((image) => image.getAttribute("src")),
  }));
  expect(metrics.document).toBeLessThanOrEqual(metrics.viewport + 1);
  expect(metrics.brokenImages).toEqual([]);

  if (process.env.MB_EXPECT_NOINDEX === "1") {
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
      "content",
      /noindex/i,
    );
  }

  await page.screenshot({
    path: testInfo.outputPath(
      `live-bk040-product-${testInfo.project.name}.png`,
    ),
    fullPage: true,
  });
});
