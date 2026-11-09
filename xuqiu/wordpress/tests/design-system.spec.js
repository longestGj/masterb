const { expect, test } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");

const WORDPRESS_ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(WORDPRESS_ROOT, "../..");
const THEME_ROOT = path.join(
  WORDPRESS_ROOT,
  "themes",
  "mtm-b2b-masterbatch",
);

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

test("ships one global design-token source for shared UI", async () => {
  const design = read(path.join(REPO_ROOT, "DESIGN.md"));
  const tokens = read(
    path.join(THEME_ROOT, "assets", "css", "design-tokens.css"),
  );
  const siteChrome = read(
    path.join(THEME_ROOT, "assets", "css", "site-chrome.css"),
  );
  const homepage = read(
    path.join(THEME_ROOT, "assets", "css", "home-refresh-v2.css"),
  );
  const about = read(
    path.join(THEME_ROOT, "assets", "css", "about-field-manual.css"),
  );
  const contact = read(
    path.join(THEME_ROOT, "assets", "css", "contact-v1.css"),
  );
  const blackGuide = read(
    path.join(
      THEME_ROOT,
      "assets",
      "css",
      "black-masterbatch-guide.css",
    ),
  );
  const bk040 = read(
    path.join(THEME_ROOT, "assets", "css", "bk040-product.css"),
  );
  const article = read(
    path.join(THEME_ROOT, "assets", "css", "article.css"),
  );
  const blogArchive = read(
    path.join(THEME_ROOT, "assets", "css", "blog-archive.css"),
  );
  const functions = read(path.join(THEME_ROOT, "functions.php"));

  expect(design).toContain("# gstack: design-md-format=spec");
  for (const token of [
    "--ge-color-primary: #305030",
    "--ge-color-primary-dark: #26372b",
    "--ge-color-accent: #d0f090",
    "--ge-color-surface: #ffffff",
    "--ge-color-text: #17201c",
    "--ge-container: 1240px",
    "--ge-header-height: 80px",
    "--ge-control-height: 44px",
  ]) {
    expect(tokens).toContain(token);
  }

  expect(siteChrome).not.toContain("--chrome-");
  expect(siteChrome).toContain("var(--ge-container)");
  expect(siteChrome).toContain("var(--ge-color-primary)");
  expect(siteChrome).toContain("var(--ge-font-sans)");

  expect(homepage).not.toContain(":root");
  expect(homepage).not.toContain("--green:");
  expect(homepage).toContain("var(--ge-container)");
  expect(homepage).toContain("var(--ge-color-primary)");
  expect(homepage).toContain("var(--ge-font-display)");
  expect(homepage).toContain("var(--ge-section-space)");

  expect(about).not.toContain(":root");
  expect(about).not.toContain("--field-");
  expect(about).toContain("var(--ge-container)");
  expect(about).toContain("var(--ge-color-primary)");
  expect(about).toContain("var(--ge-font-display)");
  expect(about).toContain("var(--ge-section-space)");

  expect(contact).not.toContain(":root");
  expect(contact).toContain("body.mtm-contact-v1");
  expect(contact).toContain("var(--ge-container)");
  expect(contact).toContain("var(--ge-color-primary)");
  expect(contact).toContain("var(--ge-font-display)");
  expect(contact).toContain("var(--ge-section-space)");

  expect(blackGuide).not.toContain(":root");
  expect(blackGuide).toContain("body.mtm-black-guide-page");
  expect(blackGuide).toContain("var(--ge-container)");
  expect(blackGuide).toContain("var(--ge-color-primary)");
  expect(blackGuide).toContain("var(--ge-font-display)");
  expect(blackGuide).toContain("var(--ge-section-space)");

  expect(bk040).not.toContain(":root");
  expect(bk040).toContain("body.mtm-bk040-page");
  expect(bk040).toContain("var(--ge-container)");
  expect(bk040).toContain("var(--ge-color-primary)");
  expect(bk040).toContain("var(--ge-font-display)");
  expect(bk040).toContain("var(--ge-section-space)");

  expect(article).not.toContain(":root");
  expect(article).toContain("body.mtm-article-page");
  expect(article).toContain("var(--ge-container)");
  expect(article).toContain("var(--ge-color-primary)");
  expect(article).toContain("var(--ge-font-display)");
  expect(article).toContain("var(--ge-space-2xl)");

  expect(blogArchive).not.toContain(":root");
  expect(blogArchive).toContain("body.mtm-blog-archive");
  expect(blogArchive).toContain("var(--ge-container)");
  expect(blogArchive).toContain("var(--ge-color-primary)");
  expect(blogArchive).toContain("var(--ge-font-display)");
  expect(blogArchive).toContain("var(--ge-section-space)");

  expect(functions.indexOf("'mtm-b2b-design-tokens'")).toBeGreaterThan(-1);
  expect(functions.indexOf("'mtm-b2b-design-tokens'")).toBeLessThan(
    functions.indexOf("'mtm-b2b-masterbatch'"),
  );
  expect(functions).toContain("mb_is_black_masterbatch_guide_page");
  expect(functions).toContain("'mtm-b2b-black-masterbatch-guide'");
  expect(functions).toContain("mb_is_bk040_page");
  expect(functions).toContain("'mtm-b2b-bk040-product'");
  expect(functions).toContain("is_singular( 'post' )");
  expect(functions).toContain("'mtm-b2b-article'");
  expect(functions).toContain("'mtm-b2b-blog-archive'");
  expect(functions).toContain("'mb_blog_archive'");
});
