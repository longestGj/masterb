const { expect, test } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");

const WORDPRESS_ROOT = path.resolve(__dirname, "..");
const liveBaseUrl = process.env.MB_LIVE_BASE_URL;

function read(relativePath) {
  return fs.readFileSync(path.join(WORDPRESS_ROOT, relativePath), "utf8");
}

test("ships the Pipe and Profile application template", async () => {
  const template = read(
    "themes/mtm-b2b-masterbatch/templates/page-pipe-profile.html",
  );
  const css = read("themes/mtm-b2b-masterbatch/assets/css/pipe-profile.css");
  const functions = read("themes/mtm-b2b-masterbatch/functions.php");
  const packageFile = read("content/pages/pipe-profile.md");

  expect(template).toContain('slug":"header"');
  expect(template).toContain('slug":"footer"');
  expect(template).toContain(
    "<h1>Black Masterbatch for Pipe and Profile Extrusion</h1>",
  );
  expect(template).toContain('class="pp-table"');
  expect(template).toContain("BK020");
  expect(template).toContain('href="/products/black-masterbatch/bk040/"');
  expect(template).toContain('href="/technical-documents/"');
  expect(template).toContain('"@type": "FAQPage"');
  expect(template).toContain('"@type": "WebPage"');
  expect(template).toContain('"@type": "BreadcrumbList"');
  expect(css).toContain(".pp-page");
  expect(css).toContain(".pp-table");
  expect(functions).toContain("mb_is_pipe_profile_page");
  expect(functions).toContain("pipe-profile.css");
  expect(packageFile).toContain('robots: "noindex,nofollow"');
  expect(packageFile).toContain('template: "page-pipe-profile"');
});

test("serves the live Pipe and Profile page", async ({ page }, testInfo) => {
  test.skip(!liveBaseUrl, "Set MB_LIVE_BASE_URL to run live page checks.");
  test.setTimeout(120_000);

  const response = await page.goto(
    `${liveBaseUrl}/products/black-masterbatch/pipe-profile/`,
    { waitUntil: "domcontentloaded" },
  );
  expect(response?.status()).toBe(200);
  await page.waitForSelector(".pp-page");
  await expect(page.locator("body")).toHaveClass(/mtm-pipe-profile-page/);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText(
    "Black Masterbatch for Pipe and Profile Extrusion",
  );
  await expect(page.locator(".pp-table tbody tr")).toHaveCount(5);
  await expect(page.locator(".pp-faq details")).toHaveCount(6);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `${liveBaseUrl}/products/black-masterbatch/pipe-profile/`,
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /index/i,
  );
  await expect(
    page.locator('a[href="/products/black-masterbatch/bk040/"]').first(),
  ).toBeVisible();

  const layout = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    hero: document.querySelector(".pp-hero__media img")?.naturalWidth || 0,
  }));
  expect(layout.document).toBeLessThanOrEqual(layout.viewport + 1);
  expect(layout.hero).toBe(1600);

  await page.screenshot({
    path: testInfo.outputPath(`pipe-profile-${testInfo.project.name}.png`),
    fullPage: true,
  });
});
