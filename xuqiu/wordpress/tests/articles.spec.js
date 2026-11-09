const { expect, test } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");

const WORDPRESS_ROOT = path.resolve(__dirname, "..");
const POST_ROOT = path.join(WORDPRESS_ROOT, "content", "posts");
const liveBaseUrl = process.env.MB_LIVE_BASE_URL;
const manifest = JSON.parse(
  fs.readFileSync(path.join(POST_ROOT, "manifest.json"), "utf8"),
);

function verifyBalancedBlocks(source, label) {
  const stack = [];
  for (const line of source.split(/\r?\n/)) {
    const trimmed = line.trim();
    const close = trimmed.match(/^<!--\s+\/wp:([a-z0-9-]+)\s+-->$/);
    if (close) {
      expect(stack.pop(), label).toBe(close[1]);
      continue;
    }

    const open = trimmed.match(
      /^<!--\s+wp:([a-z0-9-]+)(?:\s+\{.*\})?\s+(\/)?-->$/,
    );
    if (open && !open[2]) {
      stack.push(open[1]);
    }
  }
  expect(stack, label).toEqual([]);
}

test("ships four balanced WordPress article packages", async () => {
  expect(manifest).toHaveLength(4);
  expect(manifest.map((article) => article.slug)).toEqual([
    "masterbatch-for-blown-film",
    "black-specks-in-masterbatch-film",
    "how-to-vet-a-masterbatch-supplier",
    "how-to-choose-carbon-black-content",
  ]);

  for (const article of manifest) {
    const source = fs.readFileSync(
      path.join(WORDPRESS_ROOT, article.contentFile),
      "utf8",
    );
    verifyBalancedBlocks(source, article.slug);
    expect(source).not.toContain("Internal review notes");
    expect(source).not.toContain("—");
    expect(source).not.toContain("–");
    expect(source).toContain("<!-- wp:heading");
    expect(source).toContain('href="/technical-documents/"');
  }

  const film = fs.readFileSync(
    path.join(POST_ROOT, "masterbatch-for-blown-film.wordpress.html"),
    "utf8",
  );
  expect(film).toContain('href="/blog/black-specks-in-masterbatch-film/"');
  expect(film).toContain('href="/products/black-masterbatch/"');

  const diagnostic = fs.readFileSync(
    path.join(POST_ROOT, "black-specks-in-masterbatch-film.wordpress.html"),
    "utf8",
  );
  expect(diagnostic).toContain('href="/blog/masterbatch-for-blown-film/"');
  expect(diagnostic).toContain("control sample");

  const carbonBlack = fs.readFileSync(
    path.join(
      POST_ROOT,
      "how-to-choose-carbon-black-content.wordpress.html",
    ),
    "utf8",
  );
  expect(carbonBlack).toContain('href="/products/black-masterbatch/bk020/"');
  expect(carbonBlack).toContain('href="/products/black-masterbatch/bk040/"');
  expect(carbonBlack).toContain("Masterbatch price per kg");
});

test("ships the shared technical article template and renderer", async () => {
  const single = fs.readFileSync(
    path.join(WORDPRESS_ROOT, "themes/mtm-b2b-masterbatch/templates/single.html"),
    "utf8",
  );
  const functions = fs.readFileSync(
    path.join(WORDPRESS_ROOT, "themes/mtm-b2b-masterbatch/functions.php"),
    "utf8",
  );
  const css = fs.readFileSync(
    path.join(WORDPRESS_ROOT, "themes/mtm-b2b-masterbatch/assets/css/article.css"),
    "utf8",
  );

  expect(single).toContain("[mb_article_page]");
  expect(functions).toContain("'mb_article_page'");
  expect(functions).toContain("_mb_article_hero_title");
  expect(css).toContain("body.mtm-article-page");
  expect(css).toContain(".article-toc--desktop");
  expect(css).toContain(".article-hero::before");
});

test("redirects legacy root article URLs to the Blog route", async ({
  request,
}) => {
  test.skip(!liveBaseUrl, "Set MB_LIVE_BASE_URL to run live checks.");

  const legacySlugs = manifest
    .map((article) => article.slug)
    .filter((slug) => slug !== "how-to-choose-carbon-black-content");

  for (const slug of legacySlugs) {
    const response = await request.get(
      `${liveBaseUrl}/${slug}/?source=legacy`,
      { maxRedirects: 0 },
    );
    expect(response.status(), slug).toBe(301);
    const redirect = new URL(response.headers().location, liveBaseUrl);
    expect(`${redirect.pathname}${redirect.search}`, slug).toBe(
      `/blog/${slug}/?source=legacy`,
    );
  }
});

test("publishes all articles and their resources entries", async ({
  page,
}, testInfo) => {
  test.skip(!liveBaseUrl, "Set MB_LIVE_BASE_URL to run live article checks.");
  test.setTimeout(180_000);

  for (const article of manifest) {
    const route = `/blog/${article.slug}/`;
    const response = await page.goto(`${liveBaseUrl}${route}`, {
      waitUntil: "networkidle",
    });
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("body"), route).toHaveClass(/single-post/);
    await expect(page.locator("body"), route).toHaveClass(/mtm-article-page/);
    await expect(page.locator("h1"), route).toHaveCount(1);
    await expect(page.locator("h1"), route).toHaveText(article.heroTitle);
    await expect(page).toHaveTitle(article.seoTitle);
    await expect(
      page.locator('meta[name="description"]'),
      route,
    ).toHaveAttribute("content", article.description);
    await expect(
      page.locator(".article-content h2").first(),
      route,
    ).toBeVisible();
    await expect(page.locator(".article-content h2").last()).not.toHaveText(
      "Internal review notes",
    );
    if (testInfo.project.name === "desktop") {
      await expect(
        page.locator(".article-toc--desktop ol a").first(),
      ).toBeVisible();
    } else {
      await expect(page.locator(".article-toc-mobile")).toBeVisible();
      await page.locator(".article-toc-mobile summary").click();
      await expect(
        page.locator(".article-toc-mobile ol a").first(),
      ).toBeVisible();
    }
    await expect(page.locator(".article-related a")).toHaveCount(2);
    await expect(
      page.locator('meta[property="article:section"]'),
      route,
    ).toHaveAttribute("content", "Masterbatch Guides");
    await expect(
      page.locator('[data-chrome-nav="resources"]').first(),
      route,
    ).toHaveAttribute("aria-current", "page");

    const heroBackground = await page
      .locator(".article-hero")
      .evaluate((element) => getComputedStyle(element).backgroundImage);
    expect(heroBackground).toContain("/wp-content/uploads/");

    const layout = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth,
      brokenImages: Array.from(
        document.querySelectorAll(
          ".article-content img",
        ),
      )
        .filter((image) => !image.complete || image.naturalWidth === 0)
        .map((image) => image.getAttribute("src")),
    }));
    expect(layout.document, route).toBeLessThanOrEqual(layout.viewport + 1);
    expect(layout.brokenImages, route).toEqual([]);

    await page.screenshot({
      path: testInfo.outputPath(
        `${article.slug}-${testInfo.project.name}.png`,
      ),
      fullPage: true,
    });
  }

  await page.goto(`${liveBaseUrl}/resources/`, {
    waitUntil: "networkidle",
  });
  await expect(page.locator("h2#articles")).toHaveText("Buyer articles");
  await expect(
    page.locator('h2#articles + p a[href="/blog/"]'),
  ).toHaveCount(1);
});
