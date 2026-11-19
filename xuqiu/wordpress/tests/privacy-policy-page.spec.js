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

function readPolicy() {
  const source = fs.readFileSync(
    path.join(WORDPRESS_ROOT, "content/pages/privacy-policy.md"),
    "utf8",
  );
  const parts = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!parts) {
    throw new Error("Privacy policy source has invalid front matter.");
  }
  return { frontMatter: parts[1], body: parts[2] };
}

const normalize = (value) => value.replace(/\s+/g, " ").trim();

test("ships the approved privacy policy structure and source hooks", () => {
  const template = readThemeFile("templates/page-privacy.html");
  const functions = readThemeFile("functions.php");
  const styles = readThemeFile("assets/css/privacy-policy-v2.css");
  const script = readThemeFile("assets/js/privacy-policy-v2.js");
  const themeJson = JSON.parse(readThemeFile("theme.json"));

  expect(template).toContain('class="mtm-privacy-v2"');
  expect(template).toContain("Privacy Policy");
  expect(template).toContain('href="#contact"');
  expect(template).toContain("[mb_privacy_policy_toc]");
  expect(template).toContain("[mb_privacy_policy_body]");
  expect(template).toContain("privacy-mobile-index");

  expect(functions).toContain("function mb_is_privacy_policy_page()");
  expect(functions).toContain("function mb_privacy_policy_document()");
  expect(functions).toContain("'mtm-b2b-privacy-policy-v2'");
  expect(functions).toContain("'mtm-privacy-policy'");
  expect(functions).toContain("do_blocks( $post->post_content )");
  expect(functions).toContain("sanitize_title( $heading_text )");
  expect(functions).toContain("privacy-contact");

  expect(styles).toContain(".privacy-layout");
  expect(styles).toContain(".privacy-mobile-index");
  expect(styles).toContain(".privacy-contact");
  expect(script).toContain('querySelector(".mtm-privacy-v2 .privacy-toc")');
  expect(
    themeJson.customTemplates.some(
      (templateConfig) => templateConfig.name === "page-privacy",
    ),
  ).toBe(true);
});

test("renders every Markdown section, directory target and noindex rule", async ({
  page,
}, testInfo) => {
  test.skip(!liveBaseUrl, "Set MB_LIVE_BASE_URL to run live privacy checks.");

  const policy = readPolicy();
  const headings = [...policy.body.matchAll(/^##\s+(.+)$/gmu)].map(
    (match) => match[1].trim(),
  );
  const slugify = (value) =>
    value
      .toLowerCase()
      .replace(/&amp;/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  await page.goto(`${liveBaseUrl}/privacy-policy/`, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });

  await expect(page.locator(".privacy-crumb")).toBeVisible();
  await expect(page.locator(".privacy-hero h1")).toHaveText("Privacy Policy");
  await expect(page.locator(".privacy-document > .privacy-topic")).toHaveCount(
    headings.length,
  );
  await expect(
    page.locator(".privacy-mobile-index a"),
  ).toHaveCount(headings.length);
  await expect(page.locator(".privacy-toc a")).toHaveCount(headings.length);

  for (const heading of headings) {
    const slug = slugify(heading);
    await expect(
      page.locator(`.privacy-document #${slug} h2`),
    ).toHaveText(heading);
    await expect(
      page.locator(`.privacy-mobile-index a[href="#${slug}"]`),
    ).toHaveText(heading);
    await expect(
      page.locator(`.privacy-toc a[href="#${slug}"]`),
    ).toHaveText(heading);
  }

  const policyText = normalize(
    policy.body
      .replace(/^#{1,6}\s+/gmu, "")
      .split(/\n{2,}/u)
      .join(" "),
  );
  await expect
    .poll(async () =>
      normalize(await page.locator(".privacy-document").innerText()),
    )
    .toBe(policyText);

  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /nofollow/,
  );
  await expect(page.locator("h1")).toHaveCount(1);

  const layout = await page.evaluate(() => {
    const header = document.querySelector(".site-chrome-header");
    const hero = document.querySelector(".privacy-hero");
    const article = document.querySelector(".privacy-document");
    const toc = document.querySelector(".privacy-toc");
    const mobileIndex = document.querySelector(".privacy-mobile-index");
    const articleRect = article.getBoundingClientRect();
    const tocRect = toc.getBoundingClientRect();

    return {
      viewportWidth: document.documentElement.clientWidth,
      documentWidth: document.documentElement.scrollWidth,
      headerBottom: Math.round(header.getBoundingClientRect().bottom),
      heroTop: Math.round(hero.getBoundingClientRect().top),
      articleWidth: Math.round(articleRect.width),
      tocLeft: Math.round(tocRect.left),
      tocVisible: getComputedStyle(toc).display !== "none",
      mobileIndexVisible: getComputedStyle(mobileIndex).display !== "none",
    };
  });

  expect(layout.documentWidth).toBeLessThanOrEqual(
    layout.viewportWidth + 1,
  );
  expect(layout.headerBottom).toBe(layout.heroTop);

  if (testInfo.project.name === "desktop") {
    expect(layout.tocVisible).toBe(true);
    expect(layout.mobileIndexVisible).toBe(false);
    expect(layout.tocLeft).toBeGreaterThanOrEqual(95);
    expect(layout.articleWidth).toBeLessThanOrEqual(760);
  } else {
    expect(layout.tocVisible).toBe(false);
    expect(layout.mobileIndexVisible).toBe(true);
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
