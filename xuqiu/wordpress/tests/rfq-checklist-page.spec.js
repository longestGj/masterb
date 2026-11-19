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

test("ships the approved checklist design with the complete Markdown body", () => {
  const template = readThemeFile("templates/page-rfq-checklist.html");
  const functions = readThemeFile("functions.php");
  const styles = readThemeFile("assets/css/rfq-checklist-v2.css");
  const script = readThemeFile("assets/js/rfq-checklist.js");
  const themeJson = JSON.parse(readThemeFile("theme.json"));
  const source = fs.readFileSync(
    path.join(
      WORDPRESS_ROOT,
      "content/pages/masterbatch-rfq-checklist.md",
    ),
    "utf8",
  );

  expect(template).toContain("Masterbatch RFQ Checklist");
  expect(template).toContain("[mb_content_breadcrumb");
  expect(template).toContain('type="checkbox"');
  expect(template).toContain(
    "Tick items locally to prepare your RFQ. Nothing is submitted or saved.",
  );
  expect(template).toContain("data-rfq-checklist-progress");
  expect(template).toContain("data-rfq-checklist-clear");
  expect(functions).toContain("function mb_is_rfq_checklist_page()");
  expect(functions).toContain("'mtm-b2b-rfq-checklist-v2'");
  expect(functions).toContain("'mtm-b2b-rfq-checklist'");
  expect(functions).toContain("'mtm-rfq-checklist'");
  expect(styles).toContain(".rfq-chapter");
  expect(styles).toContain(".rfq-checklist-toolbar");
  expect(script).toContain('querySelector("[data-rfq-checklist-progress]")');
  expect(
    themeJson.customTemplates.some(
      (templateConfig) => templateConfig.name === "page-rfq-checklist",
    ),
  ).toBe(true);

  const frontMatter = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  expect(frontMatter).not.toBeNull();

  const normalize = (value) =>
    value
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/<[^>]+>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();
  const templateText = normalize(template);
  const approvedBodyLines = frontMatter[2]
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => (line.startsWith("- ") ? line.slice(2) : line))
    .map(normalize);

  for (const line of approvedBodyLines) {
    expect(templateText).toContain(line);
  }
});

test("renders the live checklist and fits a phone viewport", async ({
  page,
}, testInfo) => {
  test.skip(!liveBaseUrl, "Set MB_LIVE_BASE_URL to run live checklist checks.");

  await page.goto(`${liveBaseUrl}/resources/masterbatch-rfq-checklist/`, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });

  await expect(page.locator(".rfq-crumb")).toBeVisible();
  await expect(page.locator(".rfq-chapter")).toHaveCount(5);
  await expect(
    page.locator('.rfq-checklist input[type="checkbox"]'),
  ).toHaveCount(18);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(
    page.locator('.rfq-final a[href="/request-a-quote/"]').first(),
  ).toBeVisible();
  await expect(
    page
      .locator('.rfq-final a[href="/technical-documents/"]')
      .first(),
  ).toBeVisible();

  const checkboxes = page.locator('.rfq-chapter input[type="checkbox"]');
  const progress = page.locator("[data-rfq-checklist-progress]");
  const clearButton = page.locator("[data-rfq-checklist-clear]");
  await expect(progress).toHaveText("0 of 18 items checked");
  await expect(clearButton).toBeDisabled();

  await checkboxes.nth(0).check();
  await checkboxes.nth(1).check();
  await checkboxes.nth(2).check();
  await expect(progress).toHaveText("3 of 18 items checked");
  await expect(clearButton).toBeEnabled();

  await clearButton.click();
  await expect(progress).toHaveText("0 of 18 items checked");
  await expect(clearButton).toBeDisabled();
  await expect(checkboxes.nth(0)).not.toBeChecked();

  const layout = await page.evaluate(() => ({
    viewportWidth: document.documentElement.clientWidth,
    documentWidth: document.documentElement.scrollWidth,
    headerBottom: Math.round(
      document.querySelector(".site-chrome-header").getBoundingClientRect()
        .bottom,
    ),
    crumbTop: Math.round(
      document.querySelector(".rfq-crumb").getBoundingClientRect().top,
    ),
    crumbBottom: Math.round(
      document.querySelector(".rfq-crumb").getBoundingClientRect().bottom,
    ),
    h1Top: Math.round(
      document.querySelector(".rfq-hero h1").getBoundingClientRect().top,
    ),
    checklistTop: Math.round(
      document.querySelector(".rfq-checklist").getBoundingClientRect().top,
    ),
    toolbarTop: Math.round(
      document
        .querySelector(".rfq-checklist-toolbar")
        .getBoundingClientRect().top,
    ),
  }));
  expect(layout.documentWidth).toBeLessThanOrEqual(
    layout.viewportWidth + 1,
  );
  expect(layout.crumbTop - layout.headerBottom).toBeLessThanOrEqual(64);
  expect(layout.h1Top - layout.crumbBottom).toBeLessThanOrEqual(55);
  expect(layout.toolbarTop - layout.checklistTop).toBeLessThanOrEqual(55);

  if (testInfo.project.name === "mobile") {
    expect(layout.viewportWidth).toBe(390);
  }

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  const brokenImages = await page.locator("img").evaluateAll((images) =>
    images
      .filter((image) => !image.complete || image.naturalWidth === 0)
      .map((image) => image.getAttribute("src")),
  );
  expect(brokenImages).toEqual([]);
});
