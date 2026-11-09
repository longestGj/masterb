const { expect, test } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");

const liveBaseUrl = process.env.MB_LIVE_BASE_URL;
const themeStyle = fs.readFileSync(
  path.resolve(__dirname, "../themes/mtm-b2b-masterbatch/style.css"),
  "utf8",
);
const themeVersion = themeStyle.match(/^Version:\s*(\S+)$/m)?.[1];

test.skip(!liveBaseUrl, "Set MB_LIVE_BASE_URL to run live About checks.");

test.beforeEach(async ({ page }, testInfo) => {
  testInfo.setTimeout(120_000);
  await page.goto(`${liveBaseUrl}/about-quality/`, {
    waitUntil: "commit",
    timeout: 60_000,
  });
  await page.locator("body.mtm-about-field").waitFor({ timeout: 60_000 });
  await page.waitForFunction(
    () =>
      Array.from(document.styleSheets).some((sheet) =>
        sheet.href?.includes("about-field-manual.css"),
      ),
    null,
    { timeout: 60_000 },
  );
});

test("serves the eleven-section About redesign", async ({ page }) => {
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText(
    "How we review a masterbatch inquiry.",
  );
  await expect(page.locator("main > section")).toHaveCount(11);
  await expect(
    page.getByRole("heading", {
      name: "Company facts used in every inquiry.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Document review." }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Claim limits." }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Buyer checks." }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Choose your next step." }),
  ).toBeVisible();
  await expect(page.getByText("Who reviews your inquiry.")).toHaveCount(0);
  await expect(page.locator(".mtm-about-products__index > a")).toHaveCount(3);
  await expect(
    page.locator(".mtm-about-applications__grid article"),
  ).toHaveCount(4);
  await expect(page.locator(".mtm-about-verify__grid li")).toHaveCount(4);
  await expect(page.locator("main details")).toHaveCount(0);
  await expect(
    page.locator(
      `link[href*="about-field-manual.css"][href*="ver=${themeVersion}"]`,
    ),
  ).toHaveCount(1);
});

test("keeps the live About layouts inside the viewport", async ({ page }) => {
  await page.locator(".site-chrome-footer").scrollIntoViewIfNeeded();
  await page.waitForFunction(() =>
    Array.from(document.querySelectorAll("main img")).every(
      (image) => image.complete && image.naturalWidth > 0,
    ),
  );

  const dimensions = await page.evaluate(() => ({
    viewportWidth: document.documentElement.clientWidth,
    documentWidth: document.documentElement.scrollWidth,
    headerBottom: Math.round(
      document.querySelector(".site-chrome-header").getBoundingClientRect()
        .bottom,
    ),
    contentTop: Math.round(
      document.querySelector("main").getBoundingClientRect().top,
    ),
  }));

  expect(dimensions.documentWidth).toBeLessThanOrEqual(
    dimensions.viewportWidth + 1,
  );
  expect(dimensions.contentTop).toBe(dimensions.headerBottom);
});
