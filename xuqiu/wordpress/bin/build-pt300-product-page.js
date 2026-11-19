const fs = require("node:fs");
const path = require("node:path");

const wordpressRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(wordpressRoot, "../..");
const previewRoot = path.join(
  repoRoot,
  "xuqiu/design-preview/pt300-product-page-v1",
);
const themeRoot = path.join(
  wordpressRoot,
  "themes/mtm-b2b-masterbatch",
);

const mainSource = fs.readFileSync(
  path.join(previewRoot, "pt300-main.html"),
  "utf8",
);
const mainMatch = mainSource.match(/<main id="main"[\s\S]*?<\/main>/);
if (!mainMatch) {
  throw new Error("Could not find the approved PT-300 main markup.");
}

const template = `<!-- wp:template-part {"slug":"header","area":"header","tagName":"header"} /-->

<!-- wp:html -->
<a class="bk-skip" href="#main">Skip to content</a>
${mainMatch[0]}
<!-- /wp:html -->

<!-- wp:template-part {"slug":"footer","area":"footer","tagName":"footer"} /-->
`;

let css = fs.readFileSync(path.join(previewRoot, "pt300.css"), "utf8");
css = css.replaceAll("body.pt300-preview", "body.mtm-pt300-page");

const shell = `/* Generated from the approved PT-300 product-page design source. */
body.mtm-pt300-page *,
body.mtm-pt300-page *::before,
body.mtm-pt300-page *::after {
  box-sizing: border-box;
}

body.mtm-pt300-page .wp-site-blocks {
  row-gap: 0;
}

body.mtm-pt300-page .wp-block-template-part,
body.mtm-pt300-page main.bk-page {
  margin-block-start: 0;
}

`;

fs.writeFileSync(
  path.join(themeRoot, "templates/page-pt300-product.html"),
  template,
);
fs.writeFileSync(
  path.join(themeRoot, "assets/css/pt300-product.css"),
  shell + css,
);

console.log("Built page-pt300-product.html and pt300-product.css.");
