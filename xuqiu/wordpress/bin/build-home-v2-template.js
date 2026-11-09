const fs = require("node:fs");
const path = require("node:path");

const workspaceRoot = path.resolve(__dirname, "../../..");
const previewPath = path.join(
  workspaceRoot,
  "xuqiu/design-preview/home-refresh-sketch-v2/index.html",
);
const outputPath = path.join(
  workspaceRoot,
  "xuqiu/wordpress/themes/mtm-b2b-masterbatch/parts/home-refresh-content.html",
);

const source = fs.readFileSync(previewPath, "utf8");
const mainMatch = source.match(/<main id="main">[\s\S]*?<\/main>/);

if (!mainMatch) {
  throw new Error("Could not locate the homepage preview main element.");
}

const replacements = [
  [
    "../../wordpress/themes/mtm-b2b-masterbatch/assets/images/",
    "/wp-content/themes/mtm-b2b-masterbatch/assets/images/",
  ],
  [
    "../../../img/assets/icons/",
    "/wp-content/themes/mtm-b2b-masterbatch/assets/icons/",
  ],
  [
    '<a href="#quote">Review black masterbatch</a>',
    '<a href="/products/black-masterbatch/">Review black masterbatch</a>',
  ],
  [
    '<a href="#quote">Review white masterbatch</a>',
    '<a href="/products/white-masterbatch/">Review white masterbatch</a>',
  ],
  [
    '<a href="#quote">Review color masterbatch</a>',
    '<a href="/products/color-masterbatch/">Review color masterbatch</a>',
  ],
  [
    '<a class="sketch-button sketch-button--light" href="#quote">Request technical documents</a>',
    '<a class="sketch-button sketch-button--light" href="/technical-documents/">Request technical documents</a>',
  ],
  [
    '<a class="sketch-text-link" href="#quote">About GE and Quality</a>',
    '<a class="sketch-text-link" href="/about-quality/">About GE and Quality</a>',
  ],
  [
    '<a class="sketch-text-link" href="#resources">Explore all resources</a>',
    '<a class="sketch-text-link" href="/resources/">Explore all resources</a>',
  ],
  ['href="#quote"', 'href="/request-a-quote/"'],
  ['href="#documents"', 'href="/technical-documents/"'],
  ['href="#resources"', 'href="/resources/"'],
];

let output = mainMatch[0];
for (const [from, to] of replacements) {
  output = output.split(from).join(to);
}

output = `<!-- wp:html -->\n${output}\n<!-- /wp:html -->\n`;
fs.writeFileSync(outputPath, output);
console.log(`Wrote ${outputPath}`);
