const fs = require("node:fs");
const path = require("node:path");

const wordpressRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(wordpressRoot, "../..");
const previewRoot = path.join(
  repoRoot,
  "xuqiu/design-preview/blog-refresh-v1",
);
const themeRoot = path.join(
  wordpressRoot,
  "themes/mtm-b2b-masterbatch",
);

let css = fs.readFileSync(path.join(previewRoot, "blog.css"), "utf8");
css = css
  .replaceAll("body.blog-preview", "body.mtm-blog-archive")
  .replace(
    'url("./assets/blog-hero-factory.webp")',
    'url("/wp-content/themes/mtm-b2b-masterbatch/assets/images/blog-hero-factory.webp")',
  );

const shell = `/* Generated from the approved Blog archive design preview. */
body.mtm-blog-archive .wp-site-blocks {
  row-gap: 0;
}

body.mtm-blog-archive .wp-block-template-part,
body.mtm-blog-archive main.blog-page {
  margin-block-start: 0;
}

body.mtm-blog-archive *,
body.mtm-blog-archive *::before,
body.mtm-blog-archive *::after {
  box-sizing: border-box;
}

`;

fs.writeFileSync(
  path.join(themeRoot, "assets/css/blog-archive.css"),
  shell + css,
);
fs.copyFileSync(
  path.join(previewRoot, "assets/blog-hero-factory.webp"),
  path.join(themeRoot, "assets/images/blog-hero-factory.webp"),
);

console.log("Built blog-archive.css and blog-hero-factory.webp.");
