const { expect, test } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");

const WORDPRESS_ROOT = path.resolve(__dirname, "..");
const liveBaseUrl = process.env.MB_LIVE_BASE_URL;

test("maps legacy Contact and About URLs to current pages", async () => {
  const functions = fs.readFileSync(
    path.join(WORDPRESS_ROOT, "themes", "mtm-b2b-masterbatch", "functions.php"),
    "utf8",
  );

  expect(functions).toContain("'contact' => '/request-a-quote/'");
  expect(functions).toContain("'about'   => '/about-quality/'");
  expect(functions).toContain("'rfq'     => '/request-a-quote/'");
  expect(functions).toContain("if ( ! is_404() )");
});

test("serves permanent redirects for legacy Contact and About URLs", async ({
  request,
}) => {
  test.skip(!liveBaseUrl, "Set MB_LIVE_BASE_URL to run live redirect checks.");
  test.setTimeout(120_000);

  const cases = [
    ["/contact", "/request-a-quote/"],
    ["/contact/", "/request-a-quote/"],
    ["/about", "/about-quality/"],
    ["/about/", "/about-quality/"],
    ["/rfq", "/request-a-quote/"],
    ["/rfq/", "/request-a-quote/"],
    ["/rfq?preselect_product=white-masterbatch&preselect_need_documents=true", "/request-a-quote/"],
  ];

  for (const [from, target] of cases) {
    const response = await request.get(`${liveBaseUrl}${from}`, {
      maxRedirects: 0,
    });
    expect(response.status(), from).toBe(301);
    expect(response.headers().location, from).toBe(`${liveBaseUrl}${target}`);

    const destination = await request.get(`${liveBaseUrl}${target}`, {
      maxRedirects: 0,
    });
    expect(destination.status(), target).toBe(200);
  }
});
