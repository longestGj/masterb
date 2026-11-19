const fs = require("node:fs");

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  throw new Error(
    "Usage: node patch-pt450p-product-functions.js <input.php> <output.php>",
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

if (!source.includes("function mb_is_pt450p_page()")) {
  const enqueueAnchor = `\t\tif ( mb_is_pt300_page() ) {
\t\t\twp_enqueue_style(
\t\t\t\t'mtm-b2b-pt300-product',
\t\t\t\tget_stylesheet_directory_uri() . '/assets/css/pt300-product.css',
\t\t\t\tarray( 'mtm-b2b-masterbatch' ),
\t\t\t\t$theme->get( 'Version' )
\t\t\t);
\t\t}
`;
  const enqueue = `\t\tif ( mb_is_pt450p_page() ) {
\t\t\twp_enqueue_style(
\t\t\t\t'mtm-b2b-pt450p-product',
\t\t\t\tget_stylesheet_directory_uri() . '/assets/css/pt450p-product.css',
\t\t\t\tarray( 'mtm-b2b-masterbatch' ),
\t\t\t\t$theme->get( 'Version' )
\t\t\t);
\t\t}
`;
  replaceOnce(enqueueAnchor, `${enqueueAnchor}${enqueue}`);

  const functionAnchor = "add_filter(\n\t'body_class',";
  const functionBlock = `/**
 * Whether the current page uses the PT-450P product detail template.
 *
 * @return bool
 */
function mb_is_pt450p_page() {
\tif ( ! is_page() ) {
\t\treturn false;
\t}

\t$template = (string) get_page_template_slug( get_the_ID() );

\treturn '' !== $template && false !== strpos( $template, 'page-pt450p-product' );
}

`;
  replaceOnce(functionAnchor, `${functionBlock}${functionAnchor}`);

  const bodyAnchor = `\t\tif ( mb_is_pt300_page() ) {
\t\t\t$classes[] = 'mtm-pt300-page';
\t\t}
`;
  const bodyBlock = `\t\tif ( mb_is_pt450p_page() ) {
\t\t\t$classes[] = 'mtm-pt450p-page';
\t\t}
`;
  replaceOnce(bodyAnchor, `${bodyAnchor}${bodyBlock}`);

  replaceOnce(
    "mb_is_bk030_page() || mb_is_pt300_page()",
    "mb_is_bk030_page() || mb_is_pt300_page() || mb_is_pt450p_page()",
  );
  replaceOnce(
    "! mb_is_bk030_page() && ! mb_is_pt300_page()",
    "! mb_is_bk030_page() && ! mb_is_pt300_page() && ! mb_is_pt450p_page()",
  );
}

for (const expected of [
  "function mb_is_pt450p_page()",
  "'mtm-b2b-pt450p-product'",
  "$classes[] = 'mtm-pt450p-page';",
  "|| mb_is_pt450p_page()",
  "&& ! mb_is_pt450p_page()",
]) {
  if (!source.includes(expected)) {
    throw new Error(`Missing expected PT-450P patch marker: ${expected}`);
  }
}

fs.writeFileSync(output, source);
console.log(`Wrote ${output}`);
