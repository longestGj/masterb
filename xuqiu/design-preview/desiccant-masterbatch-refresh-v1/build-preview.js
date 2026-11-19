const fs = require("node:fs");
const path = require("node:path");

const previewRoot = __dirname;
const repoRoot = path.resolve(previewRoot, "../../..");
const wordpressRoot = path.join(repoRoot, "xuqiu/wordpress");
const themeRoot = path.join(
  wordpressRoot,
  "themes/mtm-b2b-masterbatch",
);

const header = fs
  .readFileSync(path.join(themeRoot, "parts/header.html"), "utf8")
  .replaceAll(
    "/wp-content/themes/mtm-b2b-masterbatch/",
    "../../wordpress/themes/mtm-b2b-masterbatch/",
  );
const footer = fs
  .readFileSync(path.join(themeRoot, "parts/footer.html"), "utf8")
  .replaceAll(
    "/wp-content/themes/mtm-b2b-masterbatch/",
    "../../wordpress/themes/mtm-b2b-masterbatch/",
  );
const main = fs.readFileSync(
  path.join(previewRoot, "desiccant-main.html"),
  "utf8",
);

const html = `<!doctype html>
<html lang="en" data-type="product">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="page-type" content="product">
  <meta name="site-kind" content="other">
  <title>Desiccant Masterbatch | CaO Moisture Control | GE CHEMICAL</title>
  <meta name="description" content="Review CaO desiccant masterbatch for moisture-exposed injection, extrusion and film blowing. Compare DM2476G and share the resin and process for review.">
  <link rel="stylesheet" href="../../wordpress/themes/mtm-b2b-masterbatch/assets/css/design-tokens.css">
  <link rel="stylesheet" href="../../wordpress/themes/mtm-b2b-masterbatch/style.css">
  <link rel="stylesheet" href="../../wordpress/themes/mtm-b2b-masterbatch/assets/css/site-chrome.css">
  <link rel="stylesheet" href="../../wordpress/themes/mtm-b2b-masterbatch/assets/css/black-masterbatch-guide.css">
  <link rel="stylesheet" href="./desiccant.css">
</head>
<body class="page mtm-black-guide-page mtm-desiccant-category">
  <div class="wp-site-blocks">
    <header class="wp-block-template-part">${header}</header>
    ${main}
    <footer class="wp-block-template-part">${footer}</footer>
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(previewRoot, "index.html"), html);
console.log("Built desiccant category preview.");
