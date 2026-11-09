const fs = require("node:fs/promises");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "../../..");
const themeRoot = path.join(
  repoRoot,
  "xuqiu/wordpress/themes/mtm-b2b-masterbatch",
);

async function build() {
  const header = await fs.readFile(
    path.join(themeRoot, "parts/header.html"),
    "utf8",
  );
  const footer = await fs.readFile(
    path.join(themeRoot, "parts/footer.html"),
    "utf8",
  );
  const main = await fs.readFile(
    path.join(__dirname, "carbon-guide-main.html"),
    "utf8",
  );
  const rewriteAssets = (html) =>
    html.replaceAll(
      "/wp-content/themes/mtm-b2b-masterbatch/",
      "../../wordpress/themes/mtm-b2b-masterbatch/",
    );
  const rewritePageLinks = (html) =>
    html.replaceAll('href="/', 'href="https://www.ashareai.com/');

  const html = `<!doctype html>
<html lang="en" data-type="article">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="page-type" content="article">
  <meta name="site-kind" content="other">
  <meta name="robots" content="noindex, nofollow">
  <meta name="theme-color" content="#305030">
  <title>Carbon Black Content in Black Masterbatch: 20% vs 40%</title>
  <meta name="description" content="Compare 20%, 30% and 40% carbon black content in black masterbatch by application, filler, dosage and cost per ton. Check the guide before a trial.">
  <meta property="og:type" content="article">
  <meta property="og:title" content="Carbon Black Content in Black Masterbatch: 20% vs 40%">
  <meta property="og:description" content="Choose carbon black content by application, blackness, filler, dosage and cost per ton of finished product.">
  <meta property="og:image" content="https://www.ashareai.com/wp-content/themes/mtm-b2b-masterbatch/assets/images/guide-black-granules.jpg">
  <link rel="icon" href="../../wordpress/themes/mtm-b2b-masterbatch/assets/images/ge-site-icon.png">
  <link rel="stylesheet" href="../../wordpress/themes/mtm-b2b-masterbatch/assets/css/design-tokens.css?rev=carbon-guide-v1">
  <link rel="stylesheet" href="../../wordpress/themes/mtm-b2b-masterbatch/assets/css/site-chrome.css?rev=carbon-guide-v1">
  <link rel="stylesheet" href="./carbon-guide.css?rev=carbon-guide-v1">
</head>
<body class="carbon-guide-preview">
  <a class="cb-skip" href="#main">Skip to content</a>
  ${rewritePageLinks(rewriteAssets(header))}
  ${main}
  ${rewritePageLinks(rewriteAssets(footer))}
  <script src="../../wordpress/themes/mtm-b2b-masterbatch/assets/js/site-chrome.js?rev=carbon-guide-v1"></script>
  <script>
    document
      .querySelectorAll('[data-chrome-resource-nav] > .site-chrome-nav-button')
      .forEach(function (button) {
        button.setAttribute('aria-current', 'page');
      });
  </script>
</body>
</html>`;

  await fs.writeFile(path.join(__dirname, "index.html"), html);
}

build();
