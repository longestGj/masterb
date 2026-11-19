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

function read(relativePath) {
  return fs.readFileSync(path.join(WORDPRESS_ROOT, relativePath), "utf8");
}

test("ships the Film and Packaging application template", async () => {
  const template = read(
    "themes/mtm-b2b-masterbatch/templates/page-film-packaging.html",
  );
  const css = read(
    "themes/mtm-b2b-masterbatch/assets/css/film-packaging.css",
  );
  const functions = read("themes/mtm-b2b-masterbatch/functions.php");

  expect(template).toContain('slug":"header"');
  expect(template).toContain('slug":"footer"');
  expect(template).toContain("<h1>Black Masterbatch for Film and Packaging</h1>");
  expect(template).toContain('href="/products/black-masterbatch/bk040/"');
  expect(template).toContain('href="/blog/masterbatch-for-blown-film/"');
  expect(template).toContain('href="/technical-documents/"');
  expect(template).toContain(
    "/assets/images/film-packaging-hero.webp",
  );
  expect(template).toContain('"@type": "FAQPage"');
  expect(template).toContain('"@type": "WebPage"');
  expect(template).toContain('"@type": "BreadcrumbList"');
  expect(css).toContain(".fp-page");
  expect(css).toContain(".fp-table");
  expect(functions).toContain("mb_is_film_packaging_page");
  expect(functions).toContain("film-packaging.css");
});

test("serves the live Film and Packaging page", async ({ page }, testInfo) => {
  test.skip(!liveBaseUrl, "Set MB_LIVE_BASE_URL to run live page checks.");
  test.setTimeout(120_000);

  const response = await page.goto(
    `${liveBaseUrl}/products/black-masterbatch/film-packaging/`,
    { waitUntil: "domcontentloaded" },
  );
  expect(response?.status()).toBe(200);
  await page.waitForSelector(".fp-page");
  await expect(page.locator("body")).toHaveClass(/mtm-film-packaging-page/);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText(
    "Black Masterbatch for Film and Packaging",
  );
  await expect(page.locator(".fp-table tbody tr")).toHaveCount(5);
  await expect(page.locator(".fp-faq details")).toHaveCount(6);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `${liveBaseUrl}/products/black-masterbatch/film-packaging/`,
  );
  await expect(
    page.locator('a[href="/products/black-masterbatch/bk040/"]').first(),
  ).toBeVisible();

  const layout = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
  }));
  expect(layout.document).toBeLessThanOrEqual(layout.viewport + 1);

  await page.screenshot({
    path: testInfo.outputPath(
      `film-packaging-${testInfo.project.name}.png`,
    ),
    fullPage: true,
  });
});
