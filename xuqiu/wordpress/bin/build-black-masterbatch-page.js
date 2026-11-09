const fs = require("node:fs");
const path = require("node:path");

const wordpressRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(wordpressRoot, "../..");
const previewRoot = path.join(
  repoRoot,
  "xuqiu/design-preview/black-masterbatch-refresh-v1",
);
const themeRoot = path.join(
  wordpressRoot,
  "themes/mtm-b2b-masterbatch",
);

const mainSource = fs.readFileSync(
  path.join(previewRoot, "black-main.html"),
  "utf8",
);
const mainMatch = mainSource.match(/<main id="main"[\s\S]*?<\/main>/);
if (!mainMatch) {
  throw new Error("Could not find the main preview markup.");
}

const main = mainMatch[0]
  .replaceAll(
    'src="../../wordpress/themes/mtm-b2b-masterbatch/',
    'src="/wp-content/themes/mtm-b2b-masterbatch/',
  )
  .replaceAll('href="https://www.ashareai.com/', 'href="/');

const template = `<!-- wp:template-part {"slug":"header","area":"header","tagName":"header"} /-->

<!-- wp:html -->
<a class="bm-skip" href="#main">Skip to content</a>
${main}
<!-- /wp:html -->

<!-- wp:template-part {"slug":"footer","area":"footer","tagName":"footer"} /-->
`;

let css = fs.readFileSync(path.join(previewRoot, "black.css"), "utf8");
css = css
  .replace(
    `* {
  box-sizing: border-box;
}`,
    `body.mtm-black-guide-page *,
body.mtm-black-guide-page *::before,
body.mtm-black-guide-page *::after {
  box-sizing: border-box;
}`,
  )
  .replace(
    `html {
  scroll-behavior: smooth;
  scroll-padding-top: 5.75rem;
}`,
    `html:has(body.mtm-black-guide-page) {
  scroll-behavior: smooth;
  scroll-padding-top: 5.75rem;
}`,
  )
  .replaceAll(
    "body.black-masterbatch-preview",
    "body.mtm-black-guide-page",
  );

const wordpressShell = `/* Generated from the approved Black Masterbatch design preview. */
body.mtm-black-guide-page .wp-site-blocks {
  row-gap: 0;
}

body.mtm-black-guide-page .wp-block-template-part,
body.mtm-black-guide-page main.bm-page {
  margin-block-start: 0;
}

`;

fs.writeFileSync(
  path.join(themeRoot, "templates/page-black-masterbatch.html"),
  template,
);
fs.writeFileSync(
  path.join(themeRoot, "assets/css/black-masterbatch-guide.css"),
  wordpressShell + css,
);

console.log("Built page-black-masterbatch.html and black-masterbatch-guide.css.");
