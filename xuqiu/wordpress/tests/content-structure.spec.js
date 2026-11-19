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

function readFile(relativePath) {
  return fs.readFileSync(path.join(WORDPRESS_ROOT, relativePath), "utf8");
}

test("ships category and nested-resource breadcrumbs", () => {
  const productGuide = fs.readFileSync(
    path.join(THEME_ROOT, "templates/page-black-masterbatch.html"),
    "utf8",
  );
  const resources = fs.readFileSync(
    path.join(THEME_ROOT, "templates/page-resources.html"),
    "utf8",
  );
  const functions = fs.readFileSync(
    path.join(THEME_ROOT, "functions.php"),
    "utf8",
  );

  expect(productGuide).toContain('class="bm-breadcrumb"');
  expect(resources).toContain("[mb_content_breadcrumb");
  expect(functions).toContain("'mb_content_breadcrumb'");
  expect(functions).toContain("page-resources");
});

test("removes Home from Blog and article breadcrumbs", () => {
  const functions = fs.readFileSync(
    path.join(THEME_ROOT, "functions.php"),
    "utf8",
  );

  expect(functions).not.toContain('<a href="/">Home</a>');
  expect(functions).toContain('<span aria-current="page">Blog</span>');
  expect(functions).toContain('<a href="/blog/">Blog</a>');
});

test("consolidates the retired guides hub into Blog", () => {
  const functions = fs.readFileSync(
    path.join(THEME_ROOT, "functions.php"),
    "utf8",
  );
  const header = fs.readFileSync(
    path.join(THEME_ROOT, "parts/header.html"),
    "utf8",
  );
  const guidesContent = readFile("content/pages/masterbatch-guides.md");

  expect(functions).toContain("is_page( 'masterbatch-guides' )");
  expect(functions).toContain("$target = home_url( '/blog/' )");
  expect(functions).toContain(
    "wp_safe_redirect( esc_url_raw( $target ), 301 )",
  );
  expect(header).not.toContain('href="/resources/"');
  expect(header).toContain("RFQ Checklist");
  expect(header).not.toContain('href="/masterbatch-guides/"');
  expect(guidesContent).toContain('target: "/blog/"');
  expect(guidesContent).toContain('robots: "noindex,nofollow"');
});

test("ships only the current Black and Desiccant product lines", () => {
  expect(fs.existsSync(path.join(WORDPRESS_ROOT, "content/guides/white-masterbatch.md"))).toBe(false);
  expect(fs.existsSync(path.join(WORDPRESS_ROOT, "content/guides/color-masterbatch.md"))).toBe(false);
  expect(
    fs.existsSync(path.join(THEME_ROOT, "templates/page-product-guide.html")),
  ).toBe(false);
});

test("keeps the Desiccant category at product-route depth", () => {
  const content = readFile("content/pages/desiccant-masterbatch.md");
  const body = content.split(/^---$/m).slice(2).join("---");
  const words = body.trim().split(/\s+/).filter(Boolean);

  expect(words.length).toBeGreaterThan(600);
  expect(content).toContain("dm2476g-product-hero.webp");
  expect(content).toContain("dm2476g-factory-exterior.webp");
});

test("keeps the Contact background on a valid theme-relative path", () => {
  const contactStyle = fs.readFileSync(
    path.join(THEME_ROOT, "assets/css/contact-v1.css"),
    "utf8",
  );

  expect(contactStyle).toContain(
    'url("../images/masterbatch-palletized-shipment.webp")',
  );
  expect(contactStyle).not.toContain("../../wordpress/themes");
});

test("adds direct internal routes to PT-450P and DM2476G", () => {
  const blackGuide = fs.readFileSync(
    path.join(THEME_ROOT, "templates/page-black-masterbatch.html"),
    "utf8",
  );
  const bk040 = fs.readFileSync(
    path.join(THEME_ROOT, "templates/page-bk040-product.html"),
    "utf8",
  );

  expect(blackGuide).toContain(
    'href="/products/black-masterbatch/pt-450p/"',
  );
  expect(blackGuide).toContain(
    'href="/products/desiccant-masterbatch/dm2476g/"',
  );
  expect(bk040).toContain(
    'href="/products/black-masterbatch/pt-450p/"',
  );
});

test("serves the repaired live breadcrumbs", async ({ page }) => {
  test.skip(!liveBaseUrl, "Set MB_LIVE_BASE_URL to run live checks.");

  const expected = new Map([
    [
      "/products/black-masterbatch/",
      /Products\s*\/\s*Black masterbatch/,
    ],
    [
      "/products/desiccant-masterbatch/",
      /Products\s*\/\s*Desiccant Masterbatch/i,
    ],
    [
      "/resources/masterbatch-rfq-checklist/",
      /Resources\s*\/\s*Masterbatch RFQ Checklist/,
    ],
  ]);

  for (const [route, text] of expected) {
    await page.goto(`${liveBaseUrl}${route}`, { waitUntil: "networkidle" });
    const crumb = page.locator(".bm-breadcrumb, .mtm-category-crumb").first();
    await expect(crumb).toContainText(text);
    await expect(crumb).not.toContainText("Home");
  }
});

test("removes Home from live blog breadcrumbs", async ({ page }) => {
  test.skip(!liveBaseUrl, "Set MB_LIVE_BASE_URL to run live checks.");

  await page.goto(`${liveBaseUrl}/blog/`, { waitUntil: "networkidle" });
  await expect(page.locator(".blog-crumb")).toHaveText("Blog");
  await expect(page.locator(".blog-crumb")).not.toContainText("Home");

  await page.goto(
    `${liveBaseUrl}/blog/how-to-vet-a-masterbatch-supplier/`,
    { waitUntil: "networkidle" },
  );
  await expect(page.locator(".article-crumb")).toContainText(
    /Blog\s*\/\s*How to Vet a Masterbatch Supplier/,
  );
  await expect(page.locator(".article-crumb")).not.toContainText("Home");
});

test("loads the repaired Contact background without a 404", async ({
  page,
}) => {
  test.skip(!liveBaseUrl, "Set MB_LIVE_BASE_URL to run live checks.");

  const failed = [];
  page.on("response", (response) => {
    if (response.status() >= 400) {
      failed.push({ status: response.status(), url: response.url() });
    }
  });
  await page.goto(`${liveBaseUrl}/request-a-quote/`, {
    waitUntil: "networkidle",
  });
  expect(failed).toEqual([]);
});
