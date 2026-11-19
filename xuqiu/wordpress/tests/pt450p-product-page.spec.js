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
const liveThemeVersion =
  process.env.MB_LIVE_THEME_VERSION || themeVersion;

function readThemeFile(relativePath) {
  return fs.readFileSync(path.join(THEME_ROOT, relativePath), "utf8");
}

function renderProductPreview() {
  const header = readThemeFile("parts/header.html");
  const footer = readThemeFile("parts/footer.html");
  const template = readThemeFile("templates/page-pt450p-product.html")
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
  const productStyle = readThemeFile("assets/css/pt450p-product.css");
  const chromeStyle = readThemeFile("assets/css/site-chrome.css");
  const chromeScript = readThemeFile("assets/js/site-chrome.js");

  return `<!doctype html>
<html lang="en" data-type="product">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="page-type" content="product">
  <meta name="site-kind" content="other">
  <title>Black Masterbatch PT-450P | 42% P-Type, No Filler</title>
  <meta name="description" content="PT-450P is a 42% P-type virgin carbon black masterbatch with a virgin LLDPE carrier and no filler for film blowing and injection molding.">
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
<body class="page mtm-pt450p-page">
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

test("renders the approved PT-450P product page", async ({
  page,
}, testInfo) => {
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText(
    "Black Masterbatch PT-450P",
  );
  await expect(page.locator("main > section")).toHaveCount(10);
  await expect(page.locator(".bk-breadcrumb")).toContainText(
    /Products\s*\/\s*Black masterbatch\s*\/\s*PT-450P/,
  );
  await expect(page.locator(".bk-breadcrumb [aria-current='page']")).toHaveText(
    "PT-450P",
  );
  await expect(page.locator(".bk-grade-track li")).toHaveCount(5);
  await expect(page.locator(".bk-table-wrap tbody tr")).toHaveCount(16);
  await expect(page.locator(".bk-faq details")).toHaveCount(50);
  await expect(page.locator(".bk-faq-group")).toHaveCount(6);
  await expect(page.locator(".bk-faq-nav a")).toHaveCount(6);
  await expect(page.locator(".bk-final__fields span")).toHaveCount(4);

  await expect(page.locator(".bk-faq")).toContainText(
    "carries 42% P-type virgin carbon black",
  );
  await expect(page.locator(".bk-faq")).toContainText(
    "42% P-type carbon black with a true without-filler design",
  );

  const faqQuestions = await page
    .locator(".bk-faq details summary")
    .allTextContents();
  expect(new Set(faqQuestions).size).toBe(50);
  expect(await page.locator(".bk-page").innerText()).not.toMatch(
    /13475435062|0086 134|HUANGHE 5TH ROAD|PENGLI SUB-DISTRICT/i,
  );

  const images = page.locator("main img");
  await expect(images).toHaveCount(5);
  for (const source of await images.evaluateAll((items) =>
    items.map((image) => image.getAttribute("src")),
  )) {
    expect(source).toMatch(
      /^\/wp-content\/themes\/mtm-b2b-masterbatch\/assets\/images\/pt450p-.*\.webp$/,
    );
  }
  for (const alt of await images.evaluateAll((items) =>
    items.map((image) => image.getAttribute("alt")),
  )) {
    expect(alt).toMatch(/\S+/);
  }

  await expect(
    page.locator(
      'main a[href*="product_grade=PT-450P"][href$="source=pt450p"]',
    ),
  ).toHaveCount(2);
  await expect(
    page.locator(
      'main a[href*="product_grade=PT-450P"][href*="source=pt450p-sample"]',
    ),
  ).toHaveCount(3);

  const layout = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    applicationRows: Array.from(
      document.querySelectorAll(".bk-application-route"),
    ).map((row) => Math.round(row.getBoundingClientRect().height)),
  }));
  expect(layout.document).toBeLessThanOrEqual(layout.viewport + 1);
  expect(Math.max(...layout.applicationRows)).toBeLessThanOrEqual(
    testInfo.project.name === "desktop" ? 150 : 190,
  );

  const firstFaq = page.locator(".bk-faq details").first();
  await firstFaq.locator("summary").click();
  await expect(firstFaq).toHaveAttribute("open", "");

  await page.screenshot({
    path: testInfo.outputPath(`pt450p-product-${testInfo.project.name}.png`),
    fullPage: true,
  });
});

test("resolves PT-450P under the Black Masterbatch hierarchy", async () => {
  const template = readThemeFile("templates/page-pt450p-product.html");
  const content = fs.readFileSync(
    path.join(WORDPRESS_ROOT, "content", "products", "pt450p.md"),
    "utf8",
  );

  expect(template).toContain("<span>Products</span>");
  expect(template).toContain('href="/products/black-masterbatch/"');
  expect(template).toContain('href="/products/black-masterbatch/pt-300/"');
  expect(template).toContain('href="/products/black-masterbatch/bk040/"');
  expect(template).not.toContain("127.0.0.1");
  expect(template).not.toContain("localhost");
  expect(content).toContain('path: "/products/black-masterbatch/pt-450p/"');
  expect(content).toContain('parent_slug: "black-masterbatch"');
  expect(content).toContain('body_format: "template-rendered-v1"');
  expect(content).toContain('"product/PT-450P-产品页.md"');
  expect(content).not.toContain('"product/x.md"');
});

test("preserves every FAQ title from the approved PT-450P source", async () => {
  const source = fs.readFileSync(
    path.resolve(WORDPRESS_ROOT, "..", "..", "product", "PT-450P-产品页.md"),
    "utf8",
  );
  const template = readThemeFile("templates/page-pt450p-product.html");
  const sourceQuestions = [...source.matchAll(/^### (.+)$/gm)].map(
    (match) => match[1],
  );
  const renderedQuestions = [
    ...template.matchAll(/<details><summary>(.*?)<\/summary>/g),
  ].map((match) => match[1].replaceAll("&amp;", "&"));

  expect(sourceQuestions).toHaveLength(50);
  expect(renderedQuestions).toEqual(sourceQuestions);
});

test("fits the expanded PT-450P buyer guide at every core width", async ({
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

test("serves the PT-450P page on the live product route", async ({
  page,
}, testInfo) => {
  test.skip(!liveBaseUrl, "Set MB_LIVE_BASE_URL to run live checks.");
  test.setTimeout(120_000);

  const response = await page.goto(
    `${liveBaseUrl}/products/black-masterbatch/pt-450p/`,
    { waitUntil: "networkidle" },
  );
  expect(response?.status()).toBe(200);
  await expect(page.locator("body")).toHaveClass(/mtm-pt450p-page/);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText(
    "Black Masterbatch PT-450P",
  );
  await expect(page).toHaveTitle(
    "Black Masterbatch PT-450P | 42% P-Type, No Filler",
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /42% P-type virgin carbon black.*virgin LLDPE.*no filler.*film blowing.*injection molding/i,
  );
  await expect(page.locator(".bk-table-wrap tbody tr")).toHaveCount(16);
  await expect(page.locator(".bk-faq details")).toHaveCount(50);
  await expect(page.locator(".bk-faq-group")).toHaveCount(6);
  await expect(page.locator('html')).toHaveAttribute("data-type", "product");

  const stylesheet = await page
    .locator('link[rel="stylesheet"][href*="pt450p-product.css"]')
    .getAttribute("href");
  expect(stylesheet).toContain(`ver=${liveThemeVersion}`);

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
});
