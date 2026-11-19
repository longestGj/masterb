const fs = require("node:fs");
const path = require("node:path");

const wordpressRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(wordpressRoot, "../..");
const previewRoot = path.join(
  repoRoot,
  "xuqiu/design-preview/dm2476g-product-page-v1",
);
const themeRoot = path.join(
  wordpressRoot,
  "themes/mtm-b2b-masterbatch",
);

const mainSource = fs.readFileSync(
  path.join(previewRoot, "dm2476g-main.html"),
  "utf8",
);
const mainMatch = mainSource.match(/<main id="main"[\s\S]*?<\/main>/);
if (!mainMatch) {
  throw new Error("Could not find the approved DM2476G main markup.");
}

const template = `<!-- wp:template-part {"slug":"header","area":"header","tagName":"header"} /-->

<!-- wp:html -->
<a class="bk-skip" href="#main">Skip to content</a>
${mainMatch[0]}
<!-- /wp:html -->

<!-- wp:template-part {"slug":"footer","area":"footer","tagName":"footer"} /-->
`;

let css = fs.readFileSync(path.join(previewRoot, "dm2476g.css"), "utf8");
css = css.replaceAll("body.dm2476g-preview", "body.mtm-dm2476g-page");

const shell = `/* Generated from the DM2476G desiccant product-page design source. */
body.mtm-dm2476g-page *,
body.mtm-dm2476g-page *::before,
body.mtm-dm2476g-page *::after {
  box-sizing: border-box;
}

body.mtm-dm2476g-page .wp-site-blocks {
  row-gap: 0;
}

body.mtm-dm2476g-page .wp-block-template-part,
body.mtm-dm2476g-page main.bk-page {
  margin-block-start: 0;
}

`;

fs.writeFileSync(
  path.join(themeRoot, "templates/page-dm2476g-product.html"),
  template,
);
fs.writeFileSync(
  path.join(themeRoot, "assets/css/dm2476g-product.css"),
  shell + css,
);

console.log("Built page-dm2476g-product.html and dm2476g-product.css.");
