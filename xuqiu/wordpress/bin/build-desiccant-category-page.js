const fs = require("node:fs");
const path = require("node:path");

const wordpressRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(wordpressRoot, "../..");
const previewRoot = path.join(
  repoRoot,
  "xuqiu/design-preview/desiccant-masterbatch-refresh-v1",
);
const themeRoot = path.join(
  wordpressRoot,
  "themes/mtm-b2b-masterbatch",
);

const imageMap = new Map([
  [
    "../../../img/factory/ge-chemical-masterbatch-factory-building.jpg",
    "/wp-content/themes/mtm-b2b-masterbatch/assets/images/desiccant-category-factory-building.webp",
  ],
  [
    "../../../img/packaging/ge-chemical-packaged-masterbatch-bags.jpg",
    "/wp-content/themes/mtm-b2b-masterbatch/assets/images/desiccant-category-packaging.webp",
  ],
  [
    "../../../img/export-loading/ge-chemical-masterbatch-palletized-shipment.jpg",
    "/wp-content/themes/mtm-b2b-masterbatch/assets/images/desiccant-category-palletized-shipment.webp",
  ],
  [
    "../../../img/factory/ge-chemical-masterbatch-workshop-equipment.jpg",
    "/wp-content/themes/mtm-b2b-masterbatch/assets/images/desiccant-category-workshop-equipment.webp",
  ],
  [
    "../../../img/factory/ge-chemical-masterbatch-factory-exterior-01.jpg",
    "/wp-content/themes/mtm-b2b-masterbatch/assets/images/desiccant-category-factory-exterior.webp",
  ],
]);

let main = fs.readFileSync(
  path.join(previewRoot, "desiccant-main.html"),
  "utf8",
);
for (const [source, target] of imageMap) {
  main = main.replaceAll(source, target);
}

if ([...imageMap.values()].some((target) => !main.includes(target))) {
  throw new Error("Not every approved Desiccant image was mapped.");
}

const template = `<!-- wp:template-part {"slug":"header","area":"header","tagName":"header"} /-->

<!-- wp:html -->
${main}
<!-- /wp:html -->

<!-- wp:template-part {"slug":"footer","area":"footer","tagName":"footer"} /-->
`;

fs.writeFileSync(
  path.join(themeRoot, "templates/page-desiccant-masterbatch.html"),
  template,
);
fs.copyFileSync(
  path.join(previewRoot, "desiccant.css"),
  path.join(themeRoot, "assets/css/desiccant-category.css"),
);

console.log("Built Desiccant category template and CSS.");
