const fs = require("node:fs");
const path = require("node:path");

const wordpressRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(wordpressRoot, "../..");
const previewRoot = path.join(
  repoRoot,
  "xuqiu/design-preview/article-refresh-v1",
);
const themeRoot = path.join(
  wordpressRoot,
  "themes/mtm-b2b-masterbatch",
);

let css = fs.readFileSync(path.join(previewRoot, "article.css"), "utf8");
css = css
  .replaceAll("body.article-preview", "body.mtm-article-page")
  .replace(
    'url("../../wordpress/content/posts/images/black-specks-diagnostic.webp")',
    "none",
  );

const shell = `/* Generated from the approved technical article design preview. */
body.mtm-article-page .wp-site-blocks {
  row-gap: 0;
}

body.mtm-article-page .wp-block-template-part,
body.mtm-article-page main.article-page {
  margin-block-start: 0;
}

body.mtm-article-page *,
body.mtm-article-page *::before,
body.mtm-article-page *::after {
  box-sizing: border-box;
}

`;

fs.writeFileSync(
  path.join(themeRoot, "assets/css/article.css"),
  shell + css,
);
fs.writeFileSync(
  path.join(themeRoot, "templates/single.html"),
  `<!-- wp:template-part {"slug":"header","area":"header","tagName":"header"} /-->

<!-- wp:html -->
[mb_article_page]
<!-- /wp:html -->

<!-- wp:template-part {"slug":"footer","area":"footer","tagName":"footer"} /-->
`,
);

console.log("Built article.css and single.html.");
