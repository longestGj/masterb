const fs = require("node:fs");
const path = require("node:path");

const wordpressRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(wordpressRoot, "../..");
const previewRoot = path.join(
  repoRoot,
  "xuqiu/design-preview/pt450p-product-page-v1",
);
const themeRoot = path.join(
  wordpressRoot,
  "themes/mtm-b2b-masterbatch",
);

const mainSource = fs.readFileSync(
  path.join(previewRoot, "pt450p-main.html"),
  "utf8",
);
const mainMatch = mainSource.match(/<main id="main"[\s\S]*?<\/main>/);
if (!mainMatch) {
  throw new Error("Could not find the approved PT-450P main markup.");
}

const template = `<!-- wp:template-part {"slug":"header","area":"header","tagName":"header"} /-->

<!-- wp:html -->
<a class="bk-skip" href="#main">Skip to content</a>
${mainMatch[0]}
<!-- /wp:html -->

<!-- wp:template-part {"slug":"footer","area":"footer","tagName":"footer"} /-->
`;

let css = fs.readFileSync(path.join(previewRoot, "pt450p.css"), "utf8");
css = css.replaceAll("body.pt450p-preview", "body.mtm-pt450p-page");

const shell = `/* Generated from the approved PT-450P product-page design source. */
body.mtm-pt450p-page *,
body.mtm-pt450p-page *::before,
body.mtm-pt450p-page *::after {
  box-sizing: border-box;
}

body.mtm-pt450p-page .wp-site-blocks {
  row-gap: 0;
}

body.mtm-pt450p-page .wp-block-template-part,
body.mtm-pt450p-page main.bk-page {
  margin-block-start: 0;
}

`;

fs.writeFileSync(
  path.join(themeRoot, "templates/page-pt450p-product.html"),
  template,
);
fs.writeFileSync(
  path.join(themeRoot, "assets/css/pt450p-product.css"),
  shell + css,
);

console.log("Built page-pt450p-product.html and pt450p-product.css.");
