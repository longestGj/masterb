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

function readWordPressFile(relativePath) {
  return fs.readFileSync(path.join(WORDPRESS_ROOT, relativePath), "utf8");
}

function parseContentPackage(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    throw new Error("Homepage content package has invalid Front Matter.");
  }
  return {
    frontMatter: match[1],
    body: match[2].trim(),
  };
}

function pairedBlockNames(content) {
  const stack = [];
  const pairs = [];
  const allowedBlocks = new Set([
    "group",
    "columns",
    "column",
    "paragraph",
    "heading",
    "buttons",
    "button",
    "image",
    "list",
    "list-item",
    "table",
  ]);

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    const close = trimmed.match(/^<!--\s+\/wp:([a-z0-9-]+)\s+-->$/);
    if (close) {
      expect(stack.pop()).toBe(close[1]);
      pairs.push(close[1]);
      continue;
    }

    const open = trimmed.match(
      /^<!--\s+wp:([a-z0-9-]+)(?:\s+\{.*\})?\s+(\/)?-->$/,
    );
    if (open) {
      expect(allowedBlocks.has(open[1])).toBe(true);
      if (!open[2]) {
        stack.push(open[1]);
      }
    }
  }

  expect(stack).toEqual([]);
  return pairs;
}

function renderHomepagePreview() {
  const header = readThemeFile("parts/header.html");
  const footer = readThemeFile("parts/footer.html");
  const homeContent = readThemeFile("parts/home-refresh-content.html");
  const style = readThemeFile("style.css");
  const homeRefreshStyle = readThemeFile("assets/css/home-refresh-v2.css");
  const siteChromeStyle = readThemeFile("assets/css/site-chrome.css");
  const siteChromeScript = readThemeFile("assets/js/site-chrome.js");
  const template = readThemeFile("templates/page-home.html")
    .replace(
      /<!-- wp:template-part \{"slug":"home-refresh-content"\} \/-->/,
      homeContent,
    )
    .replace(
      /<!-- wp:template-part \{"slug":"header"[^>]*\/-->/,
      header,
    )
    .replace(
      /<!-- wp:template-part \{"slug":"footer"[^>]*\/-->/,
      footer,
    );

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Masterbatch Products for Plastic Processing | GE CHEMICAL</title>
  <style>
    :root {
      --wp--preset--color--paper: #f3f0e9;
      --wp--preset--color--ink: #101c23;
      --wp--preset--color--brass: #c99547;
      --wp--preset--color--mist: #d8d8d2;
      --wp--preset--color--line: #d9d4c8;
      --wp--preset--color--white: #ffffff;
      --wp--preset--color--steel: #5e6a70;
      --wp--preset--font-size--eyebrow: 0.72rem;
      --wp--preset--font-size--small: 0.875rem;
      --wp--preset--font-size--medium: 1rem;
      --wp--preset--font-size--large: 1.5rem;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      color: var(--wp--preset--color--ink);
      background: var(--wp--preset--color--white);
      font-family: Arial, Helvetica, sans-serif;
    }
    a { color: inherit; }
    .alignwide { width: 100%; }
    .wp-block-columns {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 0;
    }
    .wp-block-column {
      min-width: 0;
      flex-grow: 1;
    }
    .are-vertically-aligned-center { align-items: center; }
    .are-vertically-aligned-bottom { align-items: flex-end; }
    .wp-block-buttons {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
    }
    .wp-block-button__link {
      display: inline-block;
      padding: 0.75rem 1rem;
      color: inherit;
      text-decoration: none;
      border: 1px solid currentColor;
      border-radius: 0.25rem;
    }
    .has-paper-background-color { background: var(--wp--preset--color--paper); }
    .has-ink-background-color { background: var(--wp--preset--color--ink); }
    .has-brass-background-color { background: var(--wp--preset--color--brass); }
    .has-mist-color { color: var(--wp--preset--color--mist); }
    .has-white-color { color: var(--wp--preset--color--white); }
    .has-ink-color { color: var(--wp--preset--color--ink); }
    .has-large-font-size { font-size: var(--wp--preset--font-size--large); }
    .mtm-eyebrow {
      margin: 0 0 0.5rem;
      font-size: var(--wp--preset--font-size--eyebrow);
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .is-layout-flex {
      display: flex;
      flex-wrap: wrap;
    }
    ${style}
    ${homeRefreshStyle}
    ${siteChromeStyle}
  </style>
</head>
<body class="home">${template}<script>${siteChromeScript}</script></body>
</html>`;
}

test.beforeEach(async ({ page }) => {
  await page.setContent(renderHomepagePreview(), {
    waitUntil: "domcontentloaded",
  });
});

test("renders the eight homepage sections and conversion paths", async ({
  page,
}, testInfo) => {
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText(
    "Masterbatch, tuned to the line.",
  );
  await expect(page.locator(".sketch-basis > div")).toHaveCount(4);
  await expect(page.locator("main > section")).toHaveCount(7);
  const headerSource = readThemeFile("parts/header.html");
  for (const label of [
    "Home",
    "Applications",
    "About Us",
    "Contact",
  ]) {
    expect(headerSource).toContain(`>${label}</a>`);
  }
  expect(headerSource).toContain("Products");
  expect(headerSource).toContain("Resources");
  expect(headerSource).toContain("Buyer Guides");
  expect(headerSource).toContain("Blog");
  expect(headerSource).toContain("Buyer FAQ");
  expect(headerSource).toContain("Technical Documents");
  await expect(page.locator(".site-chrome-header")).toBeVisible();
  await expect(page.locator(".site-chrome-nav > a")).toHaveCount(4);
  await expect(page.locator(".site-chrome-nav-button")).toHaveCount(2);
  await expect(page.locator(".site-chrome-quote")).toContainText("Get a quote");
  await expect(page.locator(".site-chrome-footer")).toBeVisible();
  await expect(page.locator(".site-chrome-footer")).toContainText(
    "GE CHEMICAL & POLYMER GROUP CO., LTD",
  );
  await expect(page.locator(".site-chrome-footer")).toContainText(
    "Binzhou, Shandong, China",
  );
  await expect(page.locator(".site-chrome-footer")).toContainText(
    "Scan to request a quote",
  );
  await expect(page.locator(".site-chrome-footer")).toContainText(
    "Request a Quote",
  );
  if (testInfo.project.name === "desktop") {
    await page.locator("[data-chrome-products-toggle]").click();
    await expect(page.locator("[data-chrome-products-menu]")).toBeVisible();
    await expect(
      page.locator("[data-chrome-products-menu] > a"),
    ).toHaveCount(3);
    await page.keyboard.press("Escape");
    await expect(page.locator("[data-chrome-products-menu]")).toBeHidden();

    await page.locator("[data-chrome-resources-toggle]").click();
    await expect(page.locator("[data-chrome-resources-menu]")).toBeVisible();
    await expect(
      page.locator("[data-chrome-resources-menu] > a"),
    ).toHaveCount(4);
    await page.keyboard.press("Escape");
    await expect(page.locator("[data-chrome-resources-menu]")).toBeHidden();
  }

  const sectionIds = [
    "home",
    "products",
    "applications",
    "documents",
    "about",
    "resources",
    "quote",
  ];
  for (const id of sectionIds) {
    await expect(page.locator(`#${id}`)).toBeVisible();
  }

  await expect(
    page.locator('main a[href="/products/black-masterbatch/"]').first(),
  ).toBeVisible();
  await expect(
    page.locator('main a[href="/products/white-masterbatch/"]').first(),
  ).toBeVisible();
  await expect(
    page.locator('main a[href="/products/color-masterbatch/"]').first(),
  ).toBeVisible();
  await expect(page.locator(".sketch-hero__media img")).toHaveCount(2);
  await expect(page.locator(".sketch-product-card")).toHaveCount(3);
  await expect(page.locator(".sketch-application-grid article")).toHaveCount(4);
  await expect(page.locator(".sketch-factory__photos img")).toHaveCount(3);
  await expect(page.locator(".sketch-product-table")).toHaveCount(0);
  await expect(
    page.getByText(/the material has to work on the line/i),
  ).toBeVisible();
  await expect(
    page.locator('.site-chrome-footer a[href="/privacy-policy/"]'),
  ).toHaveCount(2);
  await expect(page.locator(".sketch-faq details")).toHaveCount(6);
  for (const image of await page.locator("main img").all()) {
    const source = await image.getAttribute("src");
    const alt = await image.getAttribute("alt");
    if (!source.endsWith(".svg")) {
      expect(alt).toMatch(/\S+/);
    }
  }
  expect(
    await page.locator('a[href="/request-a-quote/"]').count(),
  ).toBeGreaterThanOrEqual(3);
  expect(
    await page.locator('a[href="/technical-documents/"]').count(),
  ).toBeGreaterThanOrEqual(3);

  await page.screenshot({
    path: testInfo.outputPath(`homepage-${testInfo.project.name}.png`),
    fullPage: true,
  });
});

test("mobile header opens the compact navigation", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile navigation only.");

  const menuButton = page.locator("[data-site-chrome-menu-button]");
  const mobileMenu = page.locator("[data-site-chrome-menu]");

  await expect(menuButton).toBeVisible();
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");
  await expect(mobileMenu).toHaveAttribute("aria-hidden", "true");

  await menuButton.click();

  await expect(menuButton).toHaveAttribute("aria-expanded", "true");
  await expect(menuButton).toHaveAttribute("aria-label", "Close menu");
  await expect(mobileMenu).toHaveAttribute("aria-hidden", "false");
  await expect(mobileMenu).toBeVisible();
  await expect(page.locator(".site-chrome-mobile-menu nav > a")).toHaveCount(4);
  await expect(
    page.locator(".site-chrome-mobile-menu nav > button"),
  ).toHaveCount(2);
  await page.locator("[data-site-chrome-mobile-products-toggle]").click();
  await expect(page.locator("#site-chrome-mobile-products-menu")).toBeVisible();
  await expect(
    page.locator("#site-chrome-mobile-products-menu a"),
  ).toHaveCount(3);
  await page.locator("[data-site-chrome-mobile-resources-toggle]").click();
  await expect(
    page.locator("#site-chrome-mobile-resources-menu"),
  ).toBeVisible();
  await expect(
    page.locator("#site-chrome-mobile-resources-menu a"),
  ).toHaveCount(4);

  await page.keyboard.press("Escape");

  await expect(menuButton).toHaveAttribute("aria-expanded", "false");
  await expect(menuButton).toHaveAttribute("aria-label", "Open menu");
  await expect(mobileMenu).toHaveAttribute("aria-hidden", "true");
});

test("keeps public claims within the approved evidence boundary", async ({
  page,
}) => {
  const bodyText = await page.locator("body").innerText();
  const forbiddenClaims = [
    "Wudi Longda",
    "BINZHOU LEACHY",
    "SHANDONG BEIHONG",
    "12 production lines",
    "50,000",
    "more than 30",
    "Tosaf",
    "all grades are",
    "all white masterbatch is FDA",
    "download TDS",
    "instant download",
  ];

  for (const claim of forbiddenClaims) {
    expect(bodyText.toLowerCase()).not.toContain(claim.toLowerCase());
  }

  await expect(
    page.getByText(/documents follow the grade/i),
  ).toBeVisible();
  await expect(
    page.getByText(/tested grade or sample scope only/i),
  ).toBeVisible();
});

test("does not overflow horizontally", async ({ page }) => {
  const dimensions = await page.evaluate(() => ({
    viewportWidth: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.documentWidth).toBeLessThanOrEqual(
    dimensions.viewportWidth + 1,
  );
});

test("desktop navigation fits before the mobile breakpoint", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Desktop breakpoint check.");

  for (const width of [1024, 981]) {
    await page.setViewportSize({ width, height: 900 });
    const dimensions = await page.evaluate(() => ({
      viewportWidth: document.documentElement.clientWidth,
      documentWidth: document.documentElement.scrollWidth,
      navWidth: Math.round(
        document.querySelector(".site-chrome-nav").getBoundingClientRect().width,
      ),
      headerWidth: Math.round(
        document
          .querySelector(".site-chrome-header__inner")
          .getBoundingClientRect().width,
      ),
    }));

    expect(dimensions.documentWidth, `${width}px`).toBeLessThanOrEqual(
      dimensions.viewportWidth + 1,
    );
    expect(dimensions.navWidth, `${width}px`).toBeLessThan(
      dimensions.headerWidth,
    );
  }
});

test("ships a WordPress-importable homepage package", async ({ page }) => {
  const source = readWordPressFile("content/pages/home.md");
  const homePackage = parseContentPackage(source);

  expect(homePackage.frontMatter).toContain('content_id: "home"');
  expect(homePackage.frontMatter).toContain('content_type: "home"');
  expect(homePackage.frontMatter).toContain(
    'body_format: "gutenberg-blocks-v1"',
  );
  expect(homePackage.frontMatter).toContain('slug: "home"');
  expect(homePackage.frontMatter).toContain('template: "page-home"');
  expect(homePackage.frontMatter).toContain("body_h1_allowed: true");
  expect(homePackage.frontMatter).toContain("front_page: true");
  expect(homePackage.body.match(/<h1\b/g)).toHaveLength(1);
  expect(pairedBlockNames(homePackage.body).length).toBeGreaterThan(100);

  await expect(page.locator("main#main")).toBeVisible();
  await expect(page.locator(".sketch-products")).toBeVisible();

  for (const templateName of [
    "templates/front-page.html",
    "templates/page-home.html",
  ]) {
    const template = readThemeFile(templateName);
    expect(template).toContain('"slug":"home-refresh-content"');
    expect(template).not.toContain("[mb_page_content]");
  }

  expect(readThemeFile("parts/home-refresh-content.html")).toContain(
    '<main id="main">',
  );
  expect(readThemeFile("functions.php")).toContain("home-refresh-v2.css");
});

test("ships an implementation-aligned privacy policy package", async () => {
  const source = readWordPressFile("content/pages/privacy-policy.md");
  const privacy = parseContentPackage(source);

  expect(privacy.frontMatter).toContain('content_id: "privacy.policy"');
  expect(privacy.frontMatter).toContain('slug: "privacy-policy"');
  expect(privacy.body).toContain("## How the inquiry form works");
  expect(privacy.body).toContain("private WordPress inquiry record");
  expect(privacy.body).not.toMatch(/^#\s+/m);
});

test("wires the RFQ form for secure server-side submission", async () => {
  const themeFunctions = readThemeFile("functions.php");
  const rfqPlugin = readWordPressFile("mu-plugins/mb-rfq-submissions.php");

  for (const token of [
    "admin-post.php",
    "mb_submit_rfq",
    "mb_rfq_nonce",
    "website_url",
    "privacy_consent",
    "ga_client_id",
    "intent_map",
    "mb_ga4_measurement_id",
    "rfq_submit_success",
    "documents_submit_success",
    "rfq_submit_error",
    "documents_submit_error",
  ]) {
    expect(themeFunctions).toContain(token);
  }

  for (const token of [
    "admin_post_nopriv_mb_submit_rfq",
    "wp_verify_nonce",
    "register_post_type",
    "_mb_rfq_email_sent",
    "document_purpose",
    "'documents' === $data['form_context']",
    "MASTERBATCH_GA4_API_SECRET",
    "rfq_email_delivery_failed",
    "documents_email_delivery_failed",
    "wp_safe_redirect",
  ]) {
    expect(rfqPlugin).toContain(token);
  }
});

test("ships the page-closure content packages and templates", async () => {
  for (const contentPath of [
    "content/guides/white-masterbatch.md",
    "content/guides/color-masterbatch.md",
    "content/pages/technical-documents.md",
    "content/pages/resources.md",
    "content/pages/masterbatch-rfq-checklist.md",
  ]) {
    const source = readWordPressFile(contentPath);
    expect(source).toMatch(/^---\n/);
    expect(source).not.toMatch(/^#\s+/m);
  }

  for (const templatePath of [
    "templates/page-document-request.html",
    "templates/page-resources.html",
  ]) {
    const template = readThemeFile(templatePath);
    expect(template).toContain("<!-- wp:post-content");
    expect(template).toContain('slug":"footer"');
  }

  expect(readThemeFile("templates/page-document-request.html")).toContain(
    '[mb_rfq_form context="documents"]',
  );
  expect(readThemeFile("parts/footer.html")).toContain('href="/#applications"');
});
