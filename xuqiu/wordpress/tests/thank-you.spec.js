const { expect, test } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");

const WORDPRESS_ROOT = path.resolve(__dirname, "..");
const liveBaseUrl = process.env.MB_LIVE_BASE_URL;

function read(relativePath) {
  return fs.readFileSync(path.join(WORDPRESS_ROOT, relativePath), "utf8");
}

test("ships a noindex Thank You confirmation page", async () => {
  const template = read("themes/mtm-b2b-masterbatch/templates/page-thank-you.html");
  const css = read("themes/mtm-b2b-masterbatch/assets/css/thank-you.css");
  const functions = read("themes/mtm-b2b-masterbatch/functions.php");
  const handler = read("mu-plugins/mb-rfq-submissions.php");
  const packageFile = read("content/pages/thank-you.md");

  expect(template).toContain('slug":"header"');
  expect(template).toContain('slug":"footer"');
  expect(template).toContain("<h1>Thank you. Your request is with our team.</h1>");
  expect(template).not.toContain("<form");
  expect(template).toContain('href="/products/black-masterbatch/"');
  expect(template).toContain('href="/technical-documents/"');
  expect(template).toContain('href="/request-a-quote/"');
  expect(template).not.toContain('href="/contact/"');
  expect(template).toContain('href="/blog/masterbatch-for-blown-film/"');
  expect(css).toContain(".ty-page");
  expect(functions).toContain("mb_is_thank_you_page");
  expect(functions).toContain("thank-you.css");
  expect(handler).toContain("thank_you_url");
  expect(handler).toContain("get_page_by_path( 'thank-you' )");
  expect(packageFile).toContain('robots: "noindex,nofollow"');
  expect(packageFile).toContain('noindex_reason:');
});

test("serves the live Thank You page and redirects a honeypot post", async ({
  page,
  request,
}, testInfo) => {
  test.skip(!liveBaseUrl, "Set MB_LIVE_BASE_URL to run live Thank You checks.");
  test.setTimeout(120_000);

  const response = await page.goto(`${liveBaseUrl}/thank-you/`, {
    waitUntil: "domcontentloaded",
  });
  expect(response?.status()).toBe(200);
  await expect(page.locator("h1")).toHaveText(
    "Thank you. Your request is with our team.",
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/i,
  );
  await expect(page.locator("form")).toHaveCount(0);
  await expect(
    page.locator('.ty-links a[href="/technical-documents/"]').first(),
  ).toBeVisible();

  const layout = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
  }));
  expect(layout.document).toBeLessThanOrEqual(layout.viewport + 1);

  await page.screenshot({
    path: testInfo.outputPath(`thank-you-${testInfo.project.name}.png`),
    fullPage: true,
  });

  const sitemap = await request.get(`${liveBaseUrl}/page-sitemap.xml`);
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).not.toContain("/thank-you/");

  const formPage = await request.get(`${liveBaseUrl}/request-a-quote/`);
  expect(formPage.status()).toBe(200);
  const html = await formPage.text();
  const nonce = html.match(/name="mb_rfq_nonce"\s+value="([^"]+)"/)?.[1];
  expect(nonce, "RFQ form nonce").toBeTruthy();

  const redirect = await request.post(`${liveBaseUrl}/wp-admin/admin-post.php`, {
    form: {
      action: "mb_submit_rfq",
      mb_rfq_nonce: nonce,
      website_url: "redirect-check",
    },
    maxRedirects: 0,
  });
  expect(redirect.status()).toBe(302);
  const location = redirect.headers().location;
  expect(location).toContain("/thank-you/");
  expect(location).toContain("rfq_status=success");
});
