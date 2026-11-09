const fs = require("node:fs");
const path = require("node:path");

const wordpressRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(wordpressRoot, "../..");
const previewRoot = path.join(
  repoRoot,
  "xuqiu/design-preview/bk040-product-page-v1",
);
const themeRoot = path.join(
  wordpressRoot,
  "themes/mtm-b2b-masterbatch",
);

const mainSource = fs.readFileSync(
  path.join(previewRoot, "bk040-main.html"),
  "utf8",
);
const mainMatch = mainSource.match(/<main id="main"[\s\S]*?<\/main>/);
if (!mainMatch) {
  throw new Error("Could not find the approved BK040 main markup.");
}

const replacements = [
  ["https://www.ashareai.com/", "/"],
  [
    "../../../img/product/ge-chemical-masterbatch-product-01.jpg",
    "/wp-content/themes/mtm-b2b-masterbatch/assets/images/bk040-product-hero.webp",
  ],
  [
    "../../../img/product/ge-chemical-masterbatch-product-03.jpg",
    "/wp-content/themes/mtm-b2b-masterbatch/assets/images/bk040-product-formulation.webp",
  ],
  [
    "../../../img/packaging/ge-chemical-packaged-masterbatch-bags.jpg",
    "/wp-content/themes/mtm-b2b-masterbatch/assets/images/bk040-packaging.webp",
  ],
  [
    "../../../img/factory/ge-chemical-masterbatch-production-equipment-original.jpg",
    "/wp-content/themes/mtm-b2b-masterbatch/assets/images/bk040-production-equipment.webp",
  ],
  [
    "../../../img/factory/ge-chemical-masterbatch-factory-exterior-02.jpg",
    "/wp-content/themes/mtm-b2b-masterbatch/assets/images/bk040-factory-exterior.webp",
  ],
  ['width="3072" height="4096"', 'width="1200" height="1600"'],
  ['width="1702" height="1276"', 'width="1400" height="1050"'],
  ['width="1706" height="960"', 'width="1400" height="788"'],
];

let main = mainMatch[0];
for (const [from, to] of replacements) {
  main = main.split(from).join(to);
}

const template = `<!-- wp:template-part {"slug":"header","area":"header","tagName":"header"} /-->

<!-- wp:html -->
<a class="bk-skip" href="#main">Skip to content</a>
${main}
<!-- /wp:html -->

<!-- wp:template-part {"slug":"footer","area":"footer","tagName":"footer"} /-->
`;

let css = fs.readFileSync(path.join(previewRoot, "bk040.css"), "utf8");
css = css
  .replaceAll("body.bk040-preview", "body.mtm-bk040-page")
  .replace(
    `body.mtm-bk040-page {
  margin: 0;`,
    `body.mtm-bk040-page *,
body.mtm-bk040-page *::before,
body.mtm-bk040-page *::after {
  box-sizing: border-box;
}

body.mtm-bk040-page .wp-site-blocks {
  row-gap: 0;
}

body.mtm-bk040-page .wp-block-template-part,
body.mtm-bk040-page main.bk-page {
  margin-block-start: 0;
}

body.mtm-bk040-page {
  margin: 0;`,
  );

const wordpressShell = `/* Generated from the approved BK040 product-page design preview. */
${css}`;

fs.writeFileSync(
  path.join(themeRoot, "templates/page-bk040-product.html"),
  template,
);
fs.writeFileSync(
  path.join(themeRoot, "assets/css/bk040-product.css"),
  wordpressShell,
);

console.log("Built page-bk040-product.html and bk040-product.css.");
