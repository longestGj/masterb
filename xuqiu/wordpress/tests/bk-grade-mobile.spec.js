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
const grades = ["bk025", "bk030", "bk035"];

test("loads the dedicated CSS and body class for BK025/BK030/BK035", () => {
  const functions = fs.readFileSync(
    path.join(THEME_ROOT, "functions.php"),
    "utf8",
  );

  for (const grade of grades) {
    expect(functions).toContain(`function mb_is_${grade}_page()`);
    expect(functions).toContain(`'mtm-b2b-${grade}-product'`);
    expect(functions).toContain(`'mtm-${grade}-page'`);
  }
});

test("keeps every BK grade page inside a 390px phone viewport", async ({
  page,
}, testInfo) => {
  test.skip(!liveBaseUrl, "Set MB_LIVE_BASE_URL to run live BK checks.");
  test.skip(
    testInfo.project.name !== "mobile",
    "Phone overflow regression is mobile-only.",
  );

  for (const grade of grades) {
    await page.goto(
      `${liveBaseUrl}/products/black-masterbatch/${grade}/`,
      {
        waitUntil: "domcontentloaded",
        timeout: 60_000,
      },
    );

    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("body")).toHaveClass(
      new RegExp(`mtm-${grade}-page`),
    );

    const layout = await page.evaluate(() => ({
      viewportWidth: document.documentElement.clientWidth,
      documentWidth: document.documentElement.scrollWidth,
    }));
    expect(layout.viewportWidth).toBe(390);
    expect(layout.documentWidth).toBeLessThanOrEqual(
      layout.viewportWidth + 1,
    );

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    const brokenImages = await page.locator("img").evaluateAll((images) =>
      images
        .filter((image) => !image.complete || image.naturalWidth === 0)
        .map((image) => image.getAttribute("src")),
    );
    expect(brokenImages).toEqual([]);
  }
});
