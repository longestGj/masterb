const { expect, test } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");

const WORDPRESS_ROOT = path.resolve(__dirname, "..");
const THEME_ROOT = path.join(
  WORDPRESS_ROOT,
  "themes",
  "mtm-b2b-masterbatch",
);

function readThemeFile(relativePath) {
  return fs.readFileSync(path.join(THEME_ROOT, relativePath), "utf8");
}

function renderAboutPreview() {
  const header = readThemeFile("parts/header.html");
  const footer = readThemeFile("parts/footer.html");
  const template = readThemeFile("templates/page-about-quality.html")
    .replace(
      /<!-- wp:template-part \{"slug":"header"[^>]*\/-->/,
      header,
    )
    .replace(
      /<!-- wp:template-part \{"slug":"footer"[^>]*\/-->/,
      footer,
    );
  const designTokens = readThemeFile("assets/css/design-tokens.css");
  const themeStyle = readThemeFile("style.css");
  const aboutStyle = readThemeFile("assets/css/about-field-manual.css");
  const siteChromeStyle = readThemeFile("assets/css/site-chrome.css");
  const siteChromeScript = readThemeFile("assets/js/site-chrome.js");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <base href="http://mb-about.test/">
  <title>About / Quality | GE CHEMICAL</title>
  <style>
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { margin: 0; }
    img { max-width: 100%; }
    ${designTokens}
    ${themeStyle}
    ${aboutStyle}
    ${siteChromeStyle}
  </style>
</head>
<body class="mtm-about-field">
${template}
<script>${siteChromeScript}</script>
</body>
</html>`;
}

function contentType(filePath) {
  switch (path.extname(filePath).toLowerCase()) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}

test.beforeEach(async ({ page }) => {
  await page.route(
    "http://mb-about.test/wp-content/themes/mtm-b2b-masterbatch/**",
    async (route) => {
      const url = new URL(route.request().url());
      const prefix = "/wp-content/themes/mtm-b2b-masterbatch/";
      const relativePath = decodeURIComponent(
        url.pathname.slice(prefix.length),
      );
      const filePath = path.join(THEME_ROOT, relativePath);
      await route.fulfill({
        status: 200,
        contentType: contentType(filePath),
        body: fs.readFileSync(filePath),
      });
    },
  );

  await page.setContent(renderAboutPreview(), {
    waitUntil: "domcontentloaded",
  });
  await page.evaluate(async () => {
    document.querySelectorAll("img[loading='lazy']").forEach((image) => {
      image.loading = "eager";
    });
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((resolve) => setTimeout(resolve, 50));
    window.scrollTo(0, 0);
  });
  await page.waitForFunction(
    () =>
      Array.from(document.images).every(
        (image) => image.complete && image.naturalWidth > 0,
      ),
    null,
    { timeout: 15000 },
  );
});

test("renders the approved eleven-section About structure", async ({
  page,
}, testInfo) => {
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText(
    "How we review a masterbatch inquiry.",
  );
  await expect(page.locator("main > section")).toHaveCount(11);

  for (const heading of [
    "Company facts used in every inquiry.",
    "Reviewed from the application, not a catalog.",
    "Three product routes, one review method.",
    "Prepare the application before discussing the product.",
    "What happens after you send an inquiry.",
    "Document review.",
    "Claim limits.",
    "Buyer checks.",
    "Choose your next step.",
    "Send us the run.",
  ]) {
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
  }

  await expect(page.locator(".mtm-about-company__facts > div")).toHaveCount(6);
  await expect(page.locator(".mtm-about-products__index > a")).toHaveCount(3);
  await expect(
    page.locator(
      '.mtm-about-products__index > a[href="/products/black-masterbatch/"]',
    ),
  ).toBeVisible();
  await expect(
    page.locator(
      '.mtm-about-products__index > a[href="/products/white-masterbatch/"]',
    ),
  ).toBeVisible();
  await expect(
    page.locator(
      '.mtm-about-products__index > a[href="/products/color-masterbatch/"]',
    ),
  ).toBeVisible();
  await expect(
    page.locator(".mtm-about-applications__grid article"),
  ).toHaveCount(4);
  await expect(page.locator(".mtm-about-process__grid li")).toHaveCount(4);
  await expect(page.locator(".mtm-about-boundary li")).toHaveCount(5);
  await expect(page.locator(".mtm-about-verify__grid li")).toHaveCount(4);
  await expect(page.locator(".mtm-about-next__table > a")).toHaveCount(4);
  await expect(page.locator("main details")).toHaveCount(0);
  await expect(page.locator("main img")).toHaveCount(4);

  for (const image of await page.locator("main img").all()) {
    expect(await image.getAttribute("alt")).toMatch(/\S+/);
  }

  await page.screenshot({
    path: testInfo.outputPath(`about-quality-${testInfo.project.name}.png`),
    fullPage: true,
  });
});

test("keeps About claims inside the approved evidence boundary", async ({
  page,
}) => {
  const bodyText = (await page.locator("main").innerText()).toLowerCase();

  for (const claim of [
    "wudi longda",
    "binzhou leachy",
    "shandong beihong",
    "12 production lines",
    "50,000",
    "more than 30 markets",
    "download tds",
    "instant download",
    "all grades are",
    "all white masterbatch is fda",
  ]) {
    expect(bodyText).not.toContain(claim);
  }

  await expect(
    page.locator(".mtm-about-company__facts dd").getByText(
      "Binzhou, Shandong, China",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    page.locator(".mtm-about-company__facts dd").getByText(
      "GE CHEMICAL & POLYMER GROUP CO., LTD",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Compliance-related documents, if available, apply only to specific tested grades or samples.",
    ),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Detailed street address, phone number or a manufacturer positioning.",
    ),
  ).toBeVisible();
});

test("uses compact headings and conversion routes without layout overflow", async ({
  page,
}, testInfo) => {
  for (const headingText of [
    "Document review.",
    "Claim limits.",
    "Buyer checks.",
  ]) {
    const heading = page.getByRole("heading", { name: headingText });
    const lines = await heading.evaluate((element) => {
      const style = getComputedStyle(element);
      const lineHeight = Number.parseFloat(style.lineHeight);
      return Math.round(element.getBoundingClientRect().height / lineHeight);
    });
    expect(lines, headingText).toBe(1);
  }

  const dimensions = await page.evaluate(() => ({
    viewportWidth: document.documentElement.clientWidth,
    documentWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.documentWidth).toBeLessThanOrEqual(
    dimensions.viewportWidth + 1,
  );

  await expect(
    page.locator('main a[href="/request-a-quote/"]'),
  ).toHaveCount(3);
  await expect(
    page.locator('main a[href="/technical-documents/"]'),
  ).toHaveCount(3);
  await expect(page.locator('main a[href="/faq/"]')).toBeVisible();

  if (testInfo.project.name === "mobile") {
    for (const control of await page
      .locator(
        ".mtm-about-actions a, .mtm-about-text-link, .mtm-about-final__actions a",
      )
      .all()) {
      expect(
        (await control.boundingBox()).height,
      ).toBeGreaterThanOrEqual(44);
    }
  }
});

test("holds the About layout at tablet and narrow-phone widths", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "One responsive sweep.");

  for (const viewport of [
    { width: 1024, height: 900 },
    { width: 768, height: 1024 },
    { width: 320, height: 720 },
  ]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(50);

    const dimensions = await page.evaluate(() => ({
      viewportWidth: document.documentElement.clientWidth,
      documentWidth: document.documentElement.scrollWidth,
      mainSections: document.querySelectorAll("main > section").length,
      h1Count: document.querySelectorAll("h1").length,
    }));

    expect(dimensions.documentWidth).toBeLessThanOrEqual(
      dimensions.viewportWidth + 1,
    );
    expect(dimensions.mainSections).toBe(11);
    expect(dimensions.h1Count).toBe(1);
  }
});
