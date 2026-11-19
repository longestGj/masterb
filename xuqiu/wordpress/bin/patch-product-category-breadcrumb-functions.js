const fs = require("node:fs");

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  throw new Error(
    "Usage: node patch-product-category-breadcrumb-functions.js <input.php> <output.php>",
  );
}

let source = fs
  .readFileSync(input, "utf8")
  .replace(/\r\n/g, "\n");

if (!source.includes("'mb_product_breadcrumb'")) {
  const enqueueAnchor = "\t\tif ( is_singular( 'post' ) ) {";
  const enqueue = `\t\tif (
\t\t\tis_page()
\t\t\t&& 'page-products' === get_page_template_slug( get_the_ID() )
\t\t) {
\t\t\twp_enqueue_style(
\t\t\t\t'mtm-b2b-product-category-breadcrumb',
\t\t\t\tget_stylesheet_directory_uri() . '/assets/css/product-category-breadcrumb.css',
\t\t\t\tarray( 'mtm-b2b-masterbatch' ),
\t\t\t\t$theme->get( 'Version' )
\t\t\t);
\t\t}
`;
  if (!source.includes(enqueueAnchor)) {
    throw new Error("Could not find post-style enqueue anchor.");
  }
  source = source.replace(enqueueAnchor, `${enqueue}${enqueueAnchor}`);

  const shortcodeAnchor = `/**
 * Render the Blog posts page from published WordPress posts.`;
  const shortcode = `/**
 * Render a compact breadcrumb for product category pages.
 *
 * @return string
 */
add_shortcode(
\t'mb_product_breadcrumb',
\tstatic function () {
\t\tif ( ! is_page() ) {
\t\t\treturn '';
\t\t}

\t\t$page = get_queried_object();
\t\tif ( ! $page instanceof WP_Post ) {
\t\t\treturn '';
\t\t}

\t\t$items = array(
\t\t\t'<span>Products</span>',
\t\t\t'<span aria-hidden="true">/</span>',
\t\t);
\t\t$ancestors = array_reverse( get_post_ancestors( $page ) );
\t\t$products_page = get_page_by_path( 'products' );

\t\tforeach ( $ancestors as $ancestor_id ) {
\t\t\t$ancestor = get_post( $ancestor_id );
\t\t\tif ( ! $ancestor instanceof WP_Post ) {
\t\t\t\tcontinue;
\t\t\t}

\t\t\tif ( ! $products_page || $products_page->ID !== $ancestor->ID ) {
\t\t\t\t$items[] = '<a href="' . esc_url( get_permalink( $ancestor ) ) . '">' .
\t\t\t\t\tesc_html( get_the_title( $ancestor ) ) . '</a>';
\t\t\t\t$items[] = '<span aria-hidden="true">/</span>';
\t\t\t}
\t\t}

\t\t$items[] = '<span aria-current="page">' . esc_html( get_the_title( $page ) ) . '</span>';

\t\treturn '<nav class="mtm-category-crumb" aria-label="Breadcrumb">' .
\t\t\timplode( '', $items ) . '</nav>';
\t}
);

`;
  if (!source.includes(shortcodeAnchor)) {
    throw new Error("Could not find Blog renderer anchor.");
  }
  source = source.replace(
    shortcodeAnchor,
    `${shortcode}${shortcodeAnchor}`,
  );
}

for (const expected of [
  "'mb_product_breadcrumb'",
  "'mtm-b2b-product-category-breadcrumb'",
  'class="mtm-category-crumb"',
]) {
  if (!source.includes(expected)) {
    throw new Error(`Missing breadcrumb patch marker: ${expected}`);
  }
}

fs.writeFileSync(output, source);
console.log(`Wrote ${output}`);
