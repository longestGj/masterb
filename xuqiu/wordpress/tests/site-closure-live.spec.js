const { expect, test } = require("@playwright/test");

const liveBaseUrl = process.env.MB_LIVE_BASE_URL;

test.skip(!liveBaseUrl, "Set MB_LIVE_BASE_URL to run live site closure checks.");

const primaryRoutes = [
  "/",
  "/masterbatch-guides/",
  "/masterbatch-guides/black-masterbatch/",
  "/masterbatch-guides/white-masterbatch/",
  "/masterbatch-guides/color-masterbatch/",
  "/technical-documents/",
  "/resources/",
  "/resources/masterbatch-rfq-checklist/",
  "/faq/",
  "/about-quality/",
  "/request-a-quote/",
  "/privacy-policy/",
];

test("primary navigation and CTA routes resolve cleanly", async ({
  page,
  request,
}) => {
  const internalLinks = new Set();

  for (const route of primaryRoutes) {
    const response = await page.goto(`${liveBaseUrl}${route}`, {
      waitUntil: "domcontentloaded",
    });

    expect(response?.status(), route).toBe(200);
    expect(new URL(page.url()).pathname, route).toBe(route);
    await expect(page.locator("h1"), route).toHaveCount(1);
    if (route === "/privacy-policy/") {
      await expect(page.locator('link[rel="canonical"]'), route).toHaveCount(0);
    } else {
      await expect(
        page.locator('link[rel="canonical"]'),
        route,
      ).toHaveAttribute("href", `${liveBaseUrl}${route}`);
    }
    await expect(page.locator("head > title"), route).toHaveCount(1);
    await expect(
      page.locator('head > meta[name="description"]'),
      route,
    ).toHaveCount(1);
    await expect(
      page.locator('head > meta[name="description"]'),
      route,
    ).toHaveAttribute("content", /\S+/);

    const layout = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
    }));
    expect(layout.documentWidth, route).toBeLessThanOrEqual(
      layout.viewportWidth + 1,
    );

    for (const href of await page.locator("a[href]").evaluateAll((links) =>
      links.map((link) => link.href),
    )) {
      const url = new URL(href);
      const base = new URL(liveBaseUrl);
      if (url.origin === base.origin && !url.pathname.startsWith("/wp-admin/")) {
        internalLinks.add(url.href);
      }
    }
  }

  for (const href of internalLinks) {
    const response = await request.get(href);
    expect(response.status(), href).toBe(200);
  }
});

test("document request form requires document type and purpose", async ({
  page,
}) => {
  await page.goto(
    `${liveBaseUrl}/technical-documents/?intent=white-masterbatch#request-form`,
    { waitUntil: "networkidle" },
  );

  const form = page.locator("form.mtm-rfq-form");
  await expect(form).toBeVisible();
  await expect(form.locator('input[name="action"]')).toHaveValue(
    "mb_submit_rfq",
  );
  await expect(form.locator('input[name="form_context"]')).toHaveValue(
    "documents",
  );
  await expect(form.locator('select[name="product_interest"]')).toHaveValue(
    "White masterbatch",
  );
  await expect(
    form.locator('select[name="documents_requested"]'),
  ).toHaveAttribute("required", "");
  await expect(form.locator('select[name="document_purpose"]')).toHaveAttribute(
    "required",
    "",
  );
});

test("robots output matches the public indexing policy", async ({ request }) => {
  const publicPages = primaryRoutes.filter(
    (route) => route !== "/privacy-policy/",
  );

  for (const route of publicPages) {
    const response = await request.get(`${liveBaseUrl}${route}`);
    const html = await response.text();
    expect(html, route).not.toMatch(
      /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i,
    );
  }

  const privacy = await request.get(`${liveBaseUrl}/privacy-policy/`);
  expect(await privacy.text()).toMatch(
    /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i,
  );

  const sitemap = await request.get(`${liveBaseUrl}/page-sitemap.xml`);
  const sitemapXml = await sitemap.text();
  expect(sitemapXml).not.toContain(
    "<loc>https://gzh.hzscf.site/privacy-policy/</loc>",
  );
  expect(sitemapXml).toContain(
    "<loc>https://gzh.hzscf.site/technical-documents/</loc>",
  );
});

test("publishes Open Graph metadata and Organization schema", async ({
  request,
}) => {
  const response = await request.get(liveBaseUrl);
  const html = await response.text();

  expect(html).toMatch(
    /property=["']og:locale["'][^>]+content=["']en_US["']/i,
  );
  expect(html).toMatch(/property=["']og:title["'][^>]+content=["'][^"']+/i);
  expect(html).toMatch(/property=["']og:description["'][^>]+content=["'][^"']+/i);
  expect(html).toMatch(/property=["']og:image["'][^>]+content=["'][^"']+/i);
  expect(html).toContain('"@type":"Organization"');
  expect(html).toContain('"@type":"WebSite"');
  expect(html).toContain("GE CHEMICAL");
  expect(html).toContain('"inLanguage":"en-US"');
});
