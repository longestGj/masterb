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

test("ships the document request layout with the approved source content", () => {
  const template = readThemeFile("templates/page-document-request.html");
  const functions = readThemeFile("functions.php");
  const styles = readThemeFile("assets/css/document-request-v2.css");
  const source = fs.readFileSync(
    path.join(WORDPRESS_ROOT, "content/pages/technical-documents.md"),
    "utf8",
  );

  for (const content of [
    "Request Masterbatch Technical Documents",
    "When buyers need document review",
    "Information to prepare before requesting documents",
    "How document requests are handled",
    "Compliance-related document boundaries",
    "Before you submit",
    "A request for an FDA-related, food-contact-related or RoHS-related document does not imply that every product or grade is covered.",
    "Black masterbatch guide",
    "Desiccant masterbatch guide",
  ]) {
    expect(template).toContain(content);
  }

  expect(template).toContain('[mb_rfq_form context="documents"]');
  expect(template).toContain("[mb_content_breadcrumb");
  expect(functions).toContain("mb_is_document_request_page");
  expect(functions).toContain("'mtm-b2b-document-request-v2'");
  expect(styles).toContain(".documents-form-panel .mtm-rfq-form__grid");

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

test("renders the live breadcrumb, aligned layout and document form", async ({
  page,
}, testInfo) => {
  test.skip(!liveBaseUrl, "Set MB_LIVE_BASE_URL to run live document checks.");

  await page.goto(`${liveBaseUrl}/technical-documents/`, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });

  await expect(
    page.locator(".documents-crumb .mtm-category-crumb"),
  ).toBeVisible();
  await expect(
    page.locator('.documents-crumb a[href="/blog/"]'),
  ).toHaveText("Resources");

  const form = page.locator(".documents-form-panel form.mtm-rfq-form");
  await expect(form).toBeVisible();
  await expect(form.locator('input[name="form_context"]')).toHaveValue(
    "documents",
  );
  await expect(
    form.locator('select[name="documents_requested"]'),
  ).toHaveAttribute("required", "");
  await expect(
    form.locator('select[name="document_purpose"]'),
  ).toHaveAttribute("required", "");

  if (testInfo.project.name === "desktop") {
    const geometry = await page.evaluate(() => {
      const heading = document.querySelector(".documents-hero h1");
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
