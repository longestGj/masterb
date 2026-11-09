const fs = require("node:fs");
const path = require("node:path");

const wordpressRoot = path.resolve(__dirname, "../../wordpress");
const themeRoot = path.join(
  wordpressRoot,
  "themes/mtm-b2b-masterbatch",
);
const header = fs.readFileSync(
  path.join(themeRoot, "parts/header.html"),
  "utf8",
);
const footer = fs.readFileSync(
  path.join(themeRoot, "parts/footer.html"),
  "utf8",
);
const main = fs.readFileSync(path.join(__dirname, "blog-main.html"), "utf8");
const rewriteAssets = (html) =>
  html.replaceAll(
    "/wp-content/themes/mtm-b2b-masterbatch/",
    "../../wordpress/themes/mtm-b2b-masterbatch/",
  );
const rewriteLinks = (html) =>
  html.replaceAll('href="/', 'href="https://www.ashareai.com/');

const html = `<!doctype html>
<html lang="en" data-type="service">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="page-type" content="service">
  <meta name="site-kind" content="other">
  <meta name="robots" content="noindex, nofollow">
  <meta name="theme-color" content="#305030">
  <title>Masterbatch Guides and Buyer Articles | GE CHEMICAL</title>
  <meta name="description" content="Read masterbatch selection, troubleshooting and supplier review guides for plastic processing buyers.">
  <link rel="icon" href="../../wordpress/themes/mtm-b2b-masterbatch/assets/images/ge-site-icon.png">
  <link rel="stylesheet" href="../../wordpress/themes/mtm-b2b-masterbatch/assets/css/design-tokens.css">
  <link rel="stylesheet" href="../../wordpress/themes/mtm-b2b-masterbatch/assets/css/site-chrome.css">
  <link rel="stylesheet" href="./blog.css?rev=blog-v4">
</head>
<body class="blog-preview">
  <a class="blog-skip" href="#main">Skip to content</a>
  ${rewriteLinks(rewriteAssets(header))}
  ${main}
  ${rewriteLinks(rewriteAssets(footer))}
  <script src="../../wordpress/themes/mtm-b2b-masterbatch/assets/js/site-chrome.js"></script>
  <script>
    document.querySelectorAll('[data-chrome-nav="resources"]').forEach(function (link) {
      link.setAttribute("aria-current", "page");
    });
    document.querySelectorAll('[data-chrome-nav="blog"]').forEach(function (link) {
      link.setAttribute("aria-current", "page");
    });
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, "index.html"), html);
console.log("Built Blog preview.");
