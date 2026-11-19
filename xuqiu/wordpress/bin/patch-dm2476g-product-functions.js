const fs = require("node:fs");

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  throw new Error(
    "Usage: node patch-dm2476g-product-functions.js <input.php> <output.php>",
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

if (!source.includes("function mb_is_dm2476g_page()")) {
  const enqueueAnchor = `\t\tif ( mb_is_pt450p_page() ) {
\t\t\twp_enqueue_style(
\t\t\t\t'mtm-b2b-pt450p-product',
\t\t\t\tget_stylesheet_directory_uri() . '/assets/css/pt450p-product.css',
\t\t\t\tarray( 'mtm-b2b-masterbatch' ),
\t\t\t\t$theme->get( 'Version' )
\t\t\t);
\t\t}
`;
  const enqueue = `\t\tif ( mb_is_dm2476g_page() ) {
\t\t\twp_enqueue_style(
\t\t\t\t'mtm-b2b-dm2476g-product',
\t\t\t\tget_stylesheet_directory_uri() . '/assets/css/dm2476g-product.css',
\t\t\t\tarray( 'mtm-b2b-masterbatch' ),
\t\t\t\t$theme->get( 'Version' )
\t\t\t);
\t\t}
`;
  replaceOnce(enqueueAnchor, `${enqueueAnchor}${enqueue}`);

  const functionAnchor = "add_filter(\n\t'body_class',";
  const functionBlock = `/**
 * Whether the current page uses the DM2476G product detail template.
 *
 * @return bool
 */
function mb_is_dm2476g_page() {
\tif ( ! is_page() ) {
\t\treturn false;
\t}

\t$template = (string) get_page_template_slug( get_the_ID() );

\treturn '' !== $template && false !== strpos( $template, 'page-dm2476g-product' );
}

`;
  replaceOnce(functionAnchor, `${functionBlock}${functionAnchor}`);

  const bodyAnchor = `\t\tif ( mb_is_pt450p_page() ) {
\t\t\t$classes[] = 'mtm-pt450p-page';
\t\t}
`;
  const bodyBlock = `\t\tif ( mb_is_dm2476g_page() ) {
\t\t\t$classes[] = 'mtm-dm2476g-page';
\t\t}
`;
  replaceOnce(bodyAnchor, `${bodyAnchor}${bodyBlock}`);

  const languageNeedle =
    "if ( mb_is_bk040_page() || mb_is_bk035_page() || mb_is_bk030_page() || mb_is_bk025_page() || mb_is_pt300_page() || mb_is_pt450p_page() ) {";
  const languageReplacement =
    "if ( mb_is_bk040_page() || mb_is_bk035_page() || mb_is_bk030_page() || mb_is_bk025_page() || mb_is_pt300_page() || mb_is_pt450p_page() || mb_is_dm2476g_page() ) {";
  replaceOnce(languageNeedle, languageReplacement);

  const headNeedle =
    "if ( ! mb_is_bk040_page() && ! mb_is_bk035_page() && ! mb_is_bk030_page() && ! mb_is_bk025_page() && ! mb_is_pt300_page() && ! mb_is_pt450p_page() ) {";
  const headReplacement =
    "if ( ! mb_is_bk040_page() && ! mb_is_bk035_page() && ! mb_is_bk030_page() && ! mb_is_bk025_page() && ! mb_is_pt300_page() && ! mb_is_pt450p_page() && ! mb_is_dm2476g_page() ) {";
  replaceOnce(headNeedle, headReplacement);
}

for (const expected of [
  "function mb_is_dm2476g_page()",
  "'mtm-b2b-dm2476g-product'",
  "$classes[] = 'mtm-dm2476g-page';",
  "|| mb_is_dm2476g_page()",
  "&& ! mb_is_dm2476g_page()",
]) {
  if (!source.includes(expected)) {
    throw new Error(`Missing expected DM2476G patch marker: ${expected}`);
  }
}

fs.writeFileSync(output, source);
console.log(`Wrote ${output}`);
