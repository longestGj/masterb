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

function readThemeFile(relativePath) {
  return fs.readFileSync(path.join(THEME_ROOT, relativePath), "utf8");
}

test("ships the FAQ breadcrumb and shared container alignment", () => {
  const template = readThemeFile("templates/page-faq.html");
  const styles = readThemeFile("assets/css/faq-field-manual.css");

  expect(template).toContain(
    '[mb_content_breadcrumb root="Resources" root_path="/blog/"]',
  );
  expect(styles).toContain(
    "calc((100vw - var(--ge-container) - 2.5rem) / 2 + var(--ge-gutter))",
  );
  expect(styles).toContain(
    "body.mtm-faq-field .faq-open__title .mtm-category-crumb",
  );
});

test("renders the live FAQ breadcrumb and aligned desktop title", async ({
  page,
}, testInfo) => {
  test.skip(!liveBaseUrl, "Set MB_LIVE_BASE_URL to run live FAQ checks.");

  await page.goto(`${liveBaseUrl}/faq/`, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });

  const breadcrumb = page.locator(
    ".faq-open__title .mtm-category-crumb",
  );
  await expect(breadcrumb).toBeVisible();
  await expect(breadcrumb.locator('a[href="/blog/"]')).toHaveText(
    "Resources",
  );
  await expect(breadcrumb.locator('[aria-current="page"]')).toHaveText(
    "Masterbatch Buyer FAQ",
  );

  const spacing = await page.evaluate(() => {
    const crumb = document
      .querySelector(".faq-open__title .mtm-category-crumb")
      .getBoundingClientRect();
    const kicker = document
      .querySelector(".faq-open__title .field-kicker")
      .getBoundingClientRect();
    return Math.round(kicker.top - crumb.bottom);
  });
  expect(spacing).toBeGreaterThanOrEqual(20);

  if (testInfo.project.name === "desktop") {
    const geometry = await page.evaluate(() => {
      const heading = document.querySelector(".faq-open h1");
      const rect = heading.getBoundingClientRect();
      return {
        left: Math.round(rect.left),
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
      };
    });

    expect(geometry.left).toBeGreaterThanOrEqual(95);
    expect(geometry.documentWidth).toBeLessThanOrEqual(
      geometry.viewportWidth + 1,
    );
  }
});
