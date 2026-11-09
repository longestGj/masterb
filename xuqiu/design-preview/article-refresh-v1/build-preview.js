const fs = require("node:fs");
const path = require("node:path");

const wordpressRoot = path.resolve(__dirname, "../../wordpress");
const repoRoot = path.resolve(wordpressRoot, "../..");
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
let content = fs.readFileSync(
  path.join(
    wordpressRoot,
    "content/posts/black-specks-in-masterbatch-film.wordpress.html",
  ),
  "utf8",
);

content = content.replace(/<!--[\s\S]*?-->/g, "").trim();

const slugify = (value) =>
  value
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "and")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

const toc = [];
content = content.replace(/<h2>(.*?)<\/h2>/g, (_match, title) => {
  const id = slugify(title);
  toc.push({ id, title });
  return `<h2 id="${id}">${title}</h2>`;
});

const tocItems = toc
  .map(
    (item, index) =>
      `<li><a href="#${item.id}"><span>${String(index + 1).padStart(
        2,
        "0",
      )}</span>${item.title}</a></li>`,
  )
  .join("");

const rewriteAssets = (html) =>
  html.replaceAll(
    "/wp-content/themes/mtm-b2b-masterbatch/",
    "../../wordpress/themes/mtm-b2b-masterbatch/",
  );
const rewriteLinks = (html) =>
  html.replaceAll('href="/', 'href="https://www.ashareai.com/');

const main = `<main id="main" class="article-page">
  <div class="article-crumb-bar">
    <div class="article-container">
      <nav class="article-crumb" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true">/</span>
        <a href="/blog/">Blog</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Black specks in masterbatch film</span>
      </nav>
    </div>
  </div>

  <header class="article-hero">
    <div class="article-container">
      <div class="article-hero__copy">
        <p class="article-type">Diagnostic guide</p>
        <h1>Poor dispersion and black specks in masterbatch film.</h1>
        <p class="article-hero__deck">Use a control sample and production records to compare possible material, feeding, process and equipment causes before assigning a root cause.</p>
        <a class="article-button" href="#describe-the-defect-before-discussing-responsibility">Start with the evidence</a>
      </div>
    </div>
  </header>

  <section class="article-reading">
    <div class="article-container article-reading__grid">
      <aside class="article-toc article-toc--desktop" aria-label="On this page">
        <p>On this page</p>
        <ol>${tocItems}</ol>
        <a class="article-toc__cta" href="/request-a-quote/?intent=black-masterbatch&source=black-specks-guide">
          <span>Have a current defect?</span>
          <strong>Request a material review</strong>
        </a>
      </aside>

      <div class="article-main">
        <details class="article-toc-mobile">
          <summary>On this page</summary>
          <ol>${tocItems}</ol>
        </details>

        <div class="article-content">${content}</div>

        <section class="article-related" aria-labelledby="continue-reading">
          <h2 id="continue-reading">Continue reading</h2>
          <div>
            <a href="/blog/masterbatch-for-blown-film/">
              <span>Selection guide</span>
              <strong>Masterbatch for film and blown film</strong>
            </a>
            <a href="/blog/how-to-vet-a-masterbatch-supplier/">
              <span>Supplier review</span>
              <strong>How to vet a masterbatch supplier</strong>
            </a>
          </div>
        </section>
      </div>
    </div>
  </section>

  <section class="article-final">
    <div class="article-container article-final__grid">
      <div>
        <h2>Turn the evidence into a reviewable question.</h2>
        <p>Send the resin, process, product reference and current observations so the next check can be scoped properly.</p>
      </div>
      <a class="article-button" href="/request-a-quote/?intent=black-masterbatch&source=black-specks-guide">Submit an inquiry</a>
    </div>
  </section>
</main>`;

const html = `<!doctype html>
<html lang="en" data-type="service">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="page-type" content="service">
  <meta name="site-kind" content="other">
  <meta name="robots" content="noindex, nofollow">
  <meta name="theme-color" content="#305030">
  <title>Black Specks in Masterbatch Film: Diagnostic Guide</title>
  <meta name="description" content="Trace black specks, streaks and poor dispersion in plastic film with a control sample, batch records and a controlled verification step.">
  <link rel="icon" href="../../wordpress/themes/mtm-b2b-masterbatch/assets/images/ge-site-icon.png">
  <link rel="stylesheet" href="../../wordpress/themes/mtm-b2b-masterbatch/assets/css/design-tokens.css">
  <link rel="stylesheet" href="../../wordpress/themes/mtm-b2b-masterbatch/assets/css/site-chrome.css">
  <link rel="stylesheet" href="./article.css?rev=article-v4">
</head>
<body class="article-preview">
  <a class="article-skip" href="#main">Skip to content</a>
  ${rewriteLinks(rewriteAssets(header))}
  ${main}
  ${rewriteLinks(rewriteAssets(footer))}
  <script src="../../wordpress/themes/mtm-b2b-masterbatch/assets/js/site-chrome.js"></script>
  <script>
    document.querySelectorAll('[data-chrome-nav="resources"], [data-chrome-nav="blog"]').forEach(function (link) {
      link.setAttribute("aria-current", "page");
    });
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, "index.html"), html);
console.log(`Built article preview with ${toc.length} sections.`);
