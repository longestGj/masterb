const { expect, test } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");

const WORDPRESS_ROOT = path.resolve(__dirname, "..");
const liveBaseUrl = process.env.MB_LIVE_BASE_URL;

function read(relativePath) {
  return fs.readFileSync(path.join(WORDPRESS_ROOT, relativePath), "utf8");
}

test("ships a custom 404 template instead of the parent Chinese fallback", async () => {
  const template = read("themes/mtm-b2b-masterbatch/templates/404.html");
  const css = read("themes/mtm-b2b-masterbatch/assets/css/404-page.css");
  const functions = read("themes/mtm-b2b-masterbatch/functions.php");

  expect(template).toContain('slug":"header"');
  expect(template).toContain('slug":"footer"');
  expect(template).toContain("<h1>This page is not here.</h1>");
  expect(template).not.toContain("页面不存在或已下线");
  expect(template).toContain('class="nf-search"');
  expect(template).toContain('href="/products/black-masterbatch/"');
  expect(template).toContain('href="/technical-documents/"');
  expect(template).toContain('href="/request-a-quote/"');
  expect(template).not.toContain('href="/contact/"');
  expect(css).toContain(".nf-page");
  expect(functions).toContain("404-page.css");
  expect(functions).toContain("mtm-404-page");
});

test("serves the custom 404 at the original URL with a 404 status", async ({
  page,
}, testInfo) => {
  test.skip(!liveBaseUrl, "Set MB_LIVE_BASE_URL to run live 404 checks.");
  test.setTimeout(120_000);

  const requestedPath = `/definitely-missing-${Date.now()}/`;
  const requestedUrl = `${liveBaseUrl}${requestedPath}`;
  const response = await page.goto(requestedUrl, { waitUntil: "domcontentloaded" });

  expect(response?.status()).toBe(404);
  expect(page.url()).toBe(requestedUrl);
  await expect(page.locator("body")).toHaveClass(/mtm-404-page/);
  await expect(page.locator("h1")).toHaveText("This page is not here.");
  await expect(page.locator("h1")).not.toContainText("页面不存在");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/i,
  );
  await expect(page.locator("form.nf-search")).toBeVisible();
  await expect(
    page.locator('.nf-card[href="/products/black-masterbatch/"]').first(),
  ).toBeVisible();

  const layout = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
  }));
  expect(layout.document).toBeLessThanOrEqual(layout.viewport + 1);

  await page.screenshot({
    path: testInfo.outputPath(`404-${testInfo.project.name}.png`),
    fullPage: true,
  });
});
