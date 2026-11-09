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

test("ships the Blog archive template, query renderer and styles", async () => {
  const home = fs.readFileSync(
    path.join(THEME_ROOT, "templates", "home.html"),
    "utf8",
  );
  const functions = fs.readFileSync(
    path.join(THEME_ROOT, "functions.php"),
    "utf8",
  );
  const header = fs.readFileSync(
    path.join(THEME_ROOT, "parts", "header.html"),
    "utf8",
  );
  const css = fs.readFileSync(
    path.join(THEME_ROOT, "assets", "css", "blog-archive.css"),
    "utf8",
  );

  expect(home).toContain("[mb_blog_archive]");
  expect(functions).toContain("'mb_blog_archive'");
  expect(functions).toContain("'posts_per_page'      => 3");
  expect(functions).toContain("is_home()");
  expect(header).toContain('href="/blog/" data-chrome-nav="blog"');
  expect(css).not.toContain(":root");
  expect(css).toContain("body.mtm-blog-archive");
  expect(css).toContain("var(--ge-container)");
  expect(css).toContain("var(--ge-color-primary-dark)");
  expect(css).toContain("var(--ge-font-display)");
});

test("serves the live Blog archive with the latest three posts", async ({
  page,
}, testInfo) => {
  test.skip(!liveBaseUrl, "Set MB_LIVE_BASE_URL to run live Blog checks.");
  test.setTimeout(120_000);

  const response = await page.goto(`${liveBaseUrl}/blog/`, {
    waitUntil: "networkidle",
  });
  expect(response?.status()).toBe(200);
  await expect(page.locator("body")).toHaveClass(/mtm-blog-archive/);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText(
    "Masterbatch guides for better buying decisions.",
  );
  await expect(page.locator(".blog-feature")).toHaveCount(1);
  await expect(page.locator(".blog-feature h3 a")).toHaveAttribute(
    "href",
    `${liveBaseUrl}/blog/how-to-choose-carbon-black-content/`,
  );
  await expect(page.locator(".blog-secondary-card")).toHaveCount(2);
  await expect(page.locator(".blog-reading-index a")).toHaveCount(3);
  await expect(
    page.locator('[data-chrome-nav="blog"]').first(),
  ).toHaveAttribute("aria-current", "page");

  const primaryButton = page.locator(".blog-hero .blog-button").first();
  await expect(primaryButton).toHaveText("Browse the guides");
  const colors = await primaryButton.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      color: style.color,
      background: style.backgroundColor,
    };
  });
  expect(colors.color).toBe("rgb(38, 55, 43)");
  expect(colors.background).toBe("rgb(208, 240, 144)");

  await page.evaluate(() => {
    document.querySelectorAll("img[loading='lazy']").forEach((image) => {
      image.loading = "eager";
    });
  });
  await page.waitForFunction(
    () =>
      Array.from(document.querySelectorAll(".blog-page img")).every(
        (image) => image.complete && image.naturalWidth > 0,
      ),
    null,
    { timeout: 60_000 },
  );

  const layout = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    brokenImages: Array.from(document.querySelectorAll(".blog-page img"))
      .filter((image) => !image.complete || image.naturalWidth === 0)
      .map((image) => image.getAttribute("src")),
  }));
  expect(layout.document).toBeLessThanOrEqual(layout.viewport + 1);
  expect(layout.brokenImages).toEqual([]);

  await expect(
    page.locator('.blog-tools a[href="/resources/"]'),
  ).toHaveCount(1);

  await page.screenshot({
    path: testInfo.outputPath(`blog-archive-${testInfo.project.name}.png`),
    fullPage: true,
  });
});
