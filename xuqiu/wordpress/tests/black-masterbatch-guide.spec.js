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

function renderGuidePreview() {
  const header = readThemeFile("parts/header.html");
  const footer = readThemeFile("parts/footer.html");
  const template = readThemeFile("templates/page-black-masterbatch.html")
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
  const guideStyle = readThemeFile(
    "assets/css/black-masterbatch-guide.css",
  );
  const chromeStyle = readThemeFile("assets/css/site-chrome.css");
  const chromeScript = readThemeFile("assets/js/site-chrome.js");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Black Masterbatch Manufacturer: 20%–40% BK Grades</title>
  <meta name="description" content="Compare BK020–BK040 black masterbatch grades from 20% to 40% carbon black for film, molding and recycling. Request a quote or free sample.">
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    .wp-site-blocks { display: block; }
    .wp-block-template-part { margin: 0; }
    ${tokenStyle}
    ${baseStyle}
    ${chromeStyle}
    ${guideStyle}
  </style>
</head>
<body class="page mtm-black-guide-page">
  <div class="wp-site-blocks">${template}</div>
  <script>${chromeScript}</script>
</body>
</html>`;
}

test.beforeEach(async ({ page }) => {
  await page.setContent(renderGuidePreview(), {
    waitUntil: "domcontentloaded",
  });
});

test("renders the approved 10-angle Black Masterbatch guide", async ({
  page,
}, testInfo) => {
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText(
    "Black Masterbatch & Carbon Black Masterbatch",
  );
  await expect(page.locator("main > section")).toHaveCount(10);

  const sectionIds = [
    "basics",
    "grade-selection",
    "carrier",
    "performance",
    "applications",
    "quality",
    "purchasing",
    "company",
    "faq",
  ];
  for (const id of sectionIds) {
    await expect(page.locator(`#${id}`)).toBeVisible();
  }

  await expect(page.locator("main > section").last()).toHaveAttribute(
    "id",
    "faq",
  );
  await expect(page.locator(".bm-md-grade-table tbody tr")).toHaveCount(5);
  await expect(page.locator(".bm-faq-group")).toHaveCount(6);
  await expect(page.locator(".bm-faq-group details")).toHaveCount(36);
  await expect(page.locator(".bm-guide-map a")).toHaveCount(9);
  await expect(page.locator(".bm-guide-map a").last()).toHaveAttribute(
    "href",
    "#faq",
  );
  await expect(page.locator(".bm-breadcrumb")).toContainText(
    /Products\s*\/\s*Black masterbatch/,
  );
  await expect(page.locator(".bm-breadcrumb")).not.toContainText("Home");
  await expect(page.locator(".bm-breadcrumb a")).toHaveCount(0);

  for (const grade of ["BK020", "BK025", "BK030", "BK035", "BK040"]) {
    await expect(page.locator(".bm-md-grade-table")).toContainText(grade);
  }
  await expect(
    page.locator(
      '.bm-family-panel a[href="/products/black-masterbatch/bk040/"]',
    ),
  ).toHaveText("BK040");
  for (const group of [
    "A. Product basics",
    "B. Carbon black loading and grade selection",
    "C. Carrier resin",
    "D. Dispersion and quality",
    "E. Purchasing and verification",
    "F. Application scenarios",
  ]) {
    await expect(page.locator(".bm-faq-group h3", { hasText: group })).toHaveCount(1);
  }

  for (const source of await page.locator("main img").evaluateAll((images) =>
    images.map((image) => image.getAttribute("src")),
  )) {
    expect(source).toMatch(
      /^\/wp-content\/themes\/mtm-b2b-masterbatch\/assets\/images\//,
    );
  }
  for (const alt of await page.locator("main img").evaluateAll((images) =>
    images.map((image) => image.getAttribute("alt")),
  )) {
    expect(alt).toMatch(/\S+/);
  }

  const firstFaq = page.locator(".bm-faq-group details").first();
  await firstFaq.locator("summary").click();
  await expect(firstFaq).toHaveAttribute("open", "");

  const layout = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
  }));
  expect(layout.document).toBeLessThanOrEqual(layout.viewport + 1);

  await page.screenshot({
    path: testInfo.outputPath(
      `black-masterbatch-${testInfo.project.name}.png`,
    ),
    fullPage: true,
  });
});

test("does not retain preview-only paths", async () => {
  const template = readThemeFile("templates/page-black-masterbatch.html");
  const css = readThemeFile("assets/css/black-masterbatch-guide.css");

  for (const source of [template, css]) {
    expect(source).not.toContain("127.0.0.1");
    expect(source).not.toContain("localhost");
    expect(source).not.toContain("design-preview");
    expect(source).not.toContain("../../wordpress");
    expect(source).not.toContain("black-masterbatch-preview");
  }
});

test("serves the 10-angle guide on the live route", async ({
  page,
}, testInfo) => {
  test.skip(!liveBaseUrl, "Set MB_LIVE_BASE_URL to run live checks.");
  test.setTimeout(120_000);

  const response = await page.goto(
    `${liveBaseUrl}/products/black-masterbatch/`,
    { waitUntil: "networkidle" },
  );
  expect(response?.status()).toBe(200);
  await expect(page.locator("body")).toHaveClass(/mtm-black-guide-page/);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText(
    "Black Masterbatch & Carbon Black Masterbatch",
  );
  await expect(page.locator("main > section")).toHaveCount(10);
  await expect(page.locator("main > section").last()).toHaveAttribute(
    "id",
    "faq",
  );
  await expect(page.locator(".bm-md-grade-table tbody tr")).toHaveCount(5);
  await expect(page.locator(".bm-faq-group")).toHaveCount(6);
  await expect(page.locator(".bm-faq-group details")).toHaveCount(36);
  await expect(page).toHaveTitle(
    "Black Masterbatch Manufacturer: BK020–BK040 Grades",
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /BK020.*BK040.*black masterbatch/i,
  );

  const stylesheet = await page
    .locator('link[rel="stylesheet"][href*="black-masterbatch-guide.css"]')
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
      Array.from(document.querySelectorAll(".bm-page img")).every(
        (image) => image.complete && image.naturalWidth > 0,
      ),
    null,
    { timeout: 90000 },
  );

  const metrics = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    brokenImages: Array.from(document.querySelectorAll(".bm-page img"))
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
      `live-black-masterbatch-${testInfo.project.name}.png`,
    ),
    fullPage: true,
  });
});
