const fs = require("node:fs");

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  throw new Error(
    "Usage: node patch-pt300-product-functions.js <input.php> <output.php>",
  );
}

let source = fs
  .readFileSync(input, "utf8")
  .replace(/\r\n/g, "\n");

function replaceOnce(needle, replacement) {
  const count = source.split(needle).length - 1;
  if (count !== 1) {
    throw new Error(`Expected one match, found ${count}: ${needle}`);
  }
  source = source.replace(needle, replacement);
}

if (!source.includes("function mb_is_pt300_page()")) {
  const enqueueAnchor = `\t\tif ( mb_is_bk030_page() ) {
\t\t\twp_enqueue_style(
\t\t\t\t'mtm-b2b-bk030-product',
\t\t\t\tget_stylesheet_directory_uri() . '/assets/css/bk030-product.css',
\t\t\t\tarray( 'mtm-b2b-masterbatch' ),
\t\t\t\t$theme->get( 'Version' )
\t\t\t);
\t\t}
`;
  const enqueue = `\t\tif ( mb_is_pt300_page() ) {
\t\t\twp_enqueue_style(
\t\t\t\t'mtm-b2b-pt300-product',
\t\t\t\tget_stylesheet_directory_uri() . '/assets/css/pt300-product.css',
\t\t\t\tarray( 'mtm-b2b-masterbatch' ),
\t\t\t\t$theme->get( 'Version' )
\t\t\t);
\t\t}
`;
  replaceOnce(enqueueAnchor, `${enqueue}${enqueueAnchor}`);

  const functionAnchor = "add_filter(\n\t'body_class',";
  const functionBlock = `/**
 * Whether the current page uses the PT-300 product detail template.
 *
 * @return bool
 */
function mb_is_pt300_page() {
\tif ( ! is_page() ) {
\t\treturn false;
\t}

\t$template = (string) get_page_template_slug( get_the_ID() );

\treturn '' !== $template && false !== strpos( $template, 'page-pt300-product' );
}

`;
  replaceOnce(functionAnchor, `${functionBlock}${functionAnchor}`);

  const bodyAnchor = `\t\tif ( mb_is_bk030_page() ) {
\t\t\t$classes[] = 'mtm-bk030-page';
\t\t}
`;
  const bodyBlock = `\t\tif ( mb_is_pt300_page() ) {
\t\t\t$classes[] = 'mtm-pt300-page';
\t\t}
`;
  replaceOnce(bodyAnchor, `${bodyBlock}${bodyAnchor}`);

  replaceOnce(
    "if ( mb_is_bk040_page() || mb_is_bk035_page() || mb_is_bk030_page() ) {",
    "if ( mb_is_bk040_page() || mb_is_bk035_page() || mb_is_bk030_page() || mb_is_pt300_page() ) {",
  );
  replaceOnce(
    "if ( ! mb_is_bk040_page() && ! mb_is_bk035_page() && ! mb_is_bk030_page() ) {",
    "if ( ! mb_is_bk040_page() && ! mb_is_bk035_page() && ! mb_is_bk030_page() && ! mb_is_pt300_page() ) {",
  );
}

for (const expected of [
  "function mb_is_pt300_page()",
  "'mtm-b2b-pt300-product'",
  "$classes[] = 'mtm-pt300-page';",
  "|| mb_is_pt300_page()",
  "&& ! mb_is_pt300_page()",
]) {
  if (!source.includes(expected)) {
    throw new Error(`Missing expected PT-300 patch marker: ${expected}`);
  }
}

fs.writeFileSync(output, source);
console.log(`Wrote ${output}`);
