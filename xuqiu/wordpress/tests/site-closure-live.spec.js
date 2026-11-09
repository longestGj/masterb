const { expect, test } = require("@playwright/test");

const liveBaseUrl = process.env.MB_LIVE_BASE_URL;
const expectNoindex = process.env.MB_EXPECT_NOINDEX === "1";

test.skip(!liveBaseUrl, "Set MB_LIVE_BASE_URL to run live site closure checks.");

const primaryRoutes = [
  "/",
  "/masterbatch-guides/",
  "/products/black-masterbatch/",
  "/products/black-masterbatch/bk040/",
  "/products/white-masterbatch/",
  "/products/color-masterbatch/",
  "/technical-documents/",
  "/resources/",
  "/resources/masterbatch-rfq-checklist/",
  "/blog/",
  "/blog/masterbatch-for-blown-film/",
  "/blog/black-specks-in-masterbatch-film/",
  "/blog/how-to-vet-a-masterbatch-supplier/",
  "/blog/how-to-choose-carbon-black-content/",
  "/faq/",
  "/about-quality/",
  "/request-a-quote/",
  "/privacy-policy/",
];

test("legacy product guide URLs redirect to product routes", async ({
  request,
}) => {
  const redirects = [
    "/masterbatch-guides/black-masterbatch/",
    "/masterbatch-guides/white-masterbatch/",
    "/masterbatch-guides/color-masterbatch/",
  ];

  for (const route of redirects) {
    const response = await request.get(`${liveBaseUrl}${route}?source=legacy`, {
      maxRedirects: 0,
    });
    expect(response.status(), route).toBe(301);
    const redirect = new URL(response.headers().location, liveBaseUrl);
    expect(`${redirect.pathname}${redirect.search}`, route).toBe(
      `${route.replace("/masterbatch-guides/", "/products/")}?source=legacy`,
    );
  }
});

test("the structural Products page is hidden from public navigation", async ({
  request,
}) => {
  const response = await request.get(`${liveBaseUrl}/products/?source=legacy`, {
    maxRedirects: 0,
  });
  expect(response.status()).toBe(301);
  const redirect = new URL(response.headers().location, liveBaseUrl);
  expect(`${redirect.pathname}${redirect.search}`).toBe(
    "/?source=legacy",
  );
});

test("unfinished BK product URLs redirect to the Black Masterbatch page", async ({
  request,
}) => {
  for (const grade of ["bk020", "bk025", "bk030", "bk035"]) {
    const response = await request.get(
      `${liveBaseUrl}/products/black-masterbatch/${grade}/?source=placeholder`,
      { maxRedirects: 0 },
    );
    expect(response.status(), grade).toBe(301);
    const redirect = new URL(response.headers().location, liveBaseUrl);
    expect(`${redirect.pathname}${redirect.search}`, grade).toBe(
      "/products/black-masterbatch/?source=placeholder",
    );
  }
});

test("primary navigation and CTA routes resolve cleanly", async ({
  page,
  request,
}) => {
  test.setTimeout(120_000);
  const internalLinks = new Set();

  for (const route of primaryRoutes) {
    const response = await page.goto(`${liveBaseUrl}${route}`, {
      waitUntil: "domcontentloaded",
    });

    expect(response?.status(), route).toBe(200);
    expect(new URL(page.url()).pathname, route).toBe(route);
    await expect(page.locator("h1"), route).toHaveCount(1);
    if (route === "/privacy-policy/" || expectNoindex) {
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
        url.hash = "";
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
  test.setTimeout(120_000);
  const base = new URL(liveBaseUrl);
  const publicPages = primaryRoutes.filter(
    (route) => route !== "/privacy-policy/",
  );

  for (const route of publicPages) {
    const response = await request.get(`${liveBaseUrl}${route}`);
    const html = await response.text();
    if (expectNoindex) {
      expect(html, route).toMatch(
        /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i,
      );
      expect(response.headers()["x-robots-tag"], route).toContain("noindex");
    } else {
      expect(html, route).not.toMatch(
        /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i,
      );
    }
  }

  const privacy = await request.get(`${liveBaseUrl}/privacy-policy/`);
  expect(await privacy.text()).toMatch(
    /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i,
  );

  const sitemap = await request.get(`${liveBaseUrl}/page-sitemap.xml`);
  const sitemapXml = await sitemap.text();
  if (expectNoindex) {
    expect(sitemapXml).not.toContain(`<loc>${base.origin}/</loc>`);
  }
  expect(sitemapXml).not.toContain(
    `<loc>${base.origin}/privacy-policy/</loc>`,
  );
  expect(sitemapXml).toContain(
    `<loc>${base.origin}/technical-documents/</loc>`,
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
