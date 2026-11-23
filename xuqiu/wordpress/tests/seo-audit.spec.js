const { expect, test } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");

const WORDPRESS_ROOT = path.resolve(__dirname, "..");
const liveBaseUrl = process.env.MB_LIVE_BASE_URL;

function read(relativePath) {
  return fs.readFileSync(path.join(WORDPRESS_ROOT, relativePath), "utf8");
}

function parseGraph(html) {
  const scripts = [
    ...html.matchAll(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ];
  const nodes = [];

  for (const script of scripts) {
    const data = JSON.parse(script[1]);
    if (Array.isArray(data?.["@graph"])) {
      nodes.push(...data["@graph"]);
    } else if (data?.["@type"]) {
      nodes.push(data);
    }
  }

  return nodes;
}

function schemaTypes(nodes) {
  return nodes.flatMap((node) =>
    Array.isArray(node?.["@type"]) ? node["@type"] : [node?.["@type"]],
  );
}

function decodeEntities(value) {
  return value
    .replace(/&amp;|&#0*38;/gi, "&")
    .replace(/&quot;|&#0*34;/gi, '"')
    .replace(/&#0*39;|&#x27;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

test("uses page-specific H1s and WebP content images", () => {
  const faq = read("themes/mtm-b2b-masterbatch/templates/page-faq.html");
  const about = read(
    "themes/mtm-b2b-masterbatch/templates/page-about-quality.html",
  );
  const contact = read(
    "themes/mtm-b2b-masterbatch/templates/page-request-a-quote.html",
  );
  const home = read(
    "themes/mtm-b2b-masterbatch/parts/home-refresh-content.html",
  );
  const documentRequest = read(
    "themes/mtm-b2b-masterbatch/templates/page-document-request.html",
  );

  expect(faq).toContain(
    "<h1 class=\"wp-block-heading\">Masterbatch buyer FAQ for plastic processors.</h1>",
  );
  expect(about).toContain("<h1>About GE Chemical and masterbatch review.</h1>");
  expect(contact).toContain(
    "<h1 class=\"wp-block-heading\">Request a masterbatch quote.</h1>",
  );

  for (const source of [home, about, documentRequest]) {
    expect(source).not.toMatch(
      /(?:home-factory-building|home-workshop-equipment|home-masterbatch-product|home-masterbatch-packaging|masterbatch-palletized-shipment|guide-(?:black|white|color)-granules)\.jpg/,
    );
    expect(source).toContain(".webp");
  }
});

test("keeps audited title and description lengths within SERP ranges", () => {
  const manifest = JSON.parse(read("content/posts/manifest.json"));
  const carbonArticle = manifest.find(
    (post) => post.slug === "how-to-choose-carbon-black-content",
  );

  expect(carbonArticle.seoTitle.length).toBeLessThanOrEqual(60);
  expect(carbonArticle.seoTitle).toBe(
    "Carbon Black Content in Black Masterbatch | GE CHEMICAL",
  );

});

test("maps each public page role to appropriate JSON-LD", async ({
  request,
}) => {
  test.skip(!liveBaseUrl, "Set MB_LIVE_BASE_URL to run live checks.");

  const expectations = [
    ["/", ["WebPage"], false],
    ["/products/black-masterbatch/", ["CollectionPage"], false],
    ["/products/desiccant-masterbatch/", ["CollectionPage"], false],
    ["/products/black-masterbatch/bk040/", ["Product"], false],
    ["/products/desiccant-masterbatch/dm2476g/", ["Product"], false],
    ["/faq/", ["FAQPage"], false],
    ["/about-quality/", ["WebPage"], false],
    ["/request-a-quote/", ["WebPage"], false],
    ["/resources/", ["CollectionPage"], false],
    ["/blog/", ["CollectionPage"], false],
    ["/blog/how-to-vet-a-masterbatch-supplier/", ["BlogPosting"], true],
    ["/blog/black-masterbatch-let-down-ratio/", ["BlogPosting"], true],
    ["/products/black-masterbatch/pipe-profile/", ["WebPage"], false],
  ];

  for (const [route, expectedTypes, articleAllowed] of expectations) {
    const response = await request.get(`${liveBaseUrl}${route}`);
    const types = schemaTypes(parseGraph(await response.text()));

    for (const type of expectedTypes) {
      expect(types, route).toContain(type);
    }

    if (!articleAllowed) {
      expect(types, route).not.toContain("Article");
    }
  }
});

test("serves the audited titles, H1s and image formats", async ({ page }) => {
  test.skip(!liveBaseUrl, "Set MB_LIVE_BASE_URL to run live checks.");
  test.setTimeout(180_000);

  const checks = [
    [
      "/blog/how-to-choose-carbon-black-content/",
      "Carbon Black Content in Black Masterbatch | GE CHEMICAL",
    ],
  ];

  for (const [route, title] of checks) {
    await page.goto(`${liveBaseUrl}${route}`, {
      waitUntil: "domcontentloaded",
    });
    expect(await page.title()).toBe(title);
    await expect(page.locator("meta[name='description']")).toHaveAttribute(
      "content",
      /^.{120,155}$/,
    );
  }

  const h1Checks = new Map([
    ["/faq/", "Masterbatch buyer FAQ for plastic processors."],
    ["/about-quality/", "About GE Chemical and masterbatch review."],
    ["/request-a-quote/", "Request a masterbatch quote."],
  ]);

  for (const [route, heading] of h1Checks) {
    await page.goto(`${liveBaseUrl}${route}`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page.locator("h1")).toHaveText(heading);
  }

  const imagePages = [
    "/",
    "/products/black-masterbatch/",
    "/products/desiccant-masterbatch/",
    "/technical-documents/",
    "/about-quality/",
  ];

  for (const route of imagePages) {
    await page.goto(`${liveBaseUrl}${route}`, {
      waitUntil: "domcontentloaded",
    });
    const sources = await page
      .locator("main img[src]")
      .evaluateAll((images) => images.map((image) => image.getAttribute("src")));
    expect(
      sources.filter((source) =>
        /(?:home-factory-building|home-workshop-equipment|home-masterbatch-product|home-masterbatch-packaging|masterbatch-palletized-shipment|guide-(?:black|white|color)-granules)\.jpg/.test(
          source,
        ),
      ),
      route,
    ).toEqual([]);
  }
});

test("audits every published page and post for page-level SEO basics", async ({
  request,
}) => {
  test.skip(!liveBaseUrl, "Set MB_LIVE_BASE_URL to run live checks.");
  test.setTimeout(240_000);

  const routes = [
    "/",
    "/products/black-masterbatch/",
    "/products/desiccant-masterbatch/",
    "/products/black-masterbatch/bk020/",
    "/products/black-masterbatch/bk025/",
    "/products/black-masterbatch/bk030/",
    "/products/black-masterbatch/bk035/",
    "/products/black-masterbatch/bk040/",
    "/products/black-masterbatch/pt-300/",
    "/products/black-masterbatch/pt-450p/",
    "/products/black-masterbatch/film-packaging/",
    "/products/desiccant-masterbatch/dm2476g/",
    "/resources/",
    "/resources/masterbatch-rfq-checklist/",
    "/technical-documents/",
    "/faq/",
    "/about-quality/",
    "/request-a-quote/",
    "/privacy-policy/",
    "/blog/",
    "/blog/how-to-choose-carbon-black-content/",
    "/blog/masterbatch-for-blown-film/",
    "/blog/how-to-vet-a-masterbatch-supplier/",
    "/blog/black-specks-in-masterbatch-film/",
    "/blog/black-masterbatch-for-injection-molding/",
    "/blog/black-masterbatch-let-down-ratio/",
    "/products/black-masterbatch/pipe-profile/",
  ];

  for (const route of routes) {
    const response = await request.get(`${liveBaseUrl}${route}`);
    expect(response.status(), route).toBe(200);
    const html = await response.text();
    const title = decodeEntities(
      html.match(/<title>([\s\S]*?)<\/title>/i)?.[1].trim() || "",
    );
    const description = decodeEntities(
      html.match(
        /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i,
      )?.[1] || "",
    );
    const headings = [
      ...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi),
    ].map((match) => Number(match[1]));
    const h1 = headings.filter((level) => level === 1);

    expect(h1.length, `${route} H1 count`).toBe(1);
    expect(title.length, `${route} title length`).toBeGreaterThanOrEqual(25);
    expect(title.length, `${route} title length`).toBeLessThanOrEqual(60);
    expect(description.length, `${route} description length`).toBeGreaterThanOrEqual(120);
    expect(description.length, `${route} description length`).toBeLessThanOrEqual(155);
    if (route === "/privacy-policy/") {
      expect(html, route).toMatch(
        /name=["']robots["'][^>]+content=["'][^"']*noindex/i,
      );
      expect(html, route).toMatch(
        /name=["']robots["'][^>]+content=["'][^"']*nofollow/i,
      );
    } else {
      expect(html, route).not.toMatch(
        /name=["']robots["'][^>]+content=["'][^"']*noindex/i,
      );
    }
    expect(html, route).not.toMatch(
      /white masterbatch|color masterbatch|white-masterbatch|color-masterbatch/i,
    );

    for (let index = 1; index < headings.length; index += 1) {
      expect(
        headings[index] - headings[index - 1],
        `${route} heading sequence`,
      ).toBeLessThanOrEqual(1);
    }

    const imageSources = [
      ...html.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/gi),
    ].map((match) => match[1]);
    expect(
      imageSources.filter((source) =>
        /(?:home-factory-building|home-workshop-equipment|home-masterbatch-product|home-masterbatch-packaging|masterbatch-palletized-shipment|guide-(?:black|white|color)-granules)\.jpg/.test(
          source,
        ),
      ),
      `${route} legacy content image`,
    ).toEqual([]);
  }
});
