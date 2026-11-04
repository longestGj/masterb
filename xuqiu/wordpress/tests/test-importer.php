<?php
/**
 * Standalone checks for the Masterbatch Markdown importer.
 */

define( 'ABSPATH', __DIR__ . '/' );

require dirname( __DIR__ ) . '/mu-plugins/mb-content-importer.php';

/**
 * Fail a test assertion.
 *
 * @param bool   $condition Assertion.
 * @param string $message   Error message.
 * @return void
 */
function mbci_assert( $condition, $message ) {
	if ( ! $condition ) {
		fwrite( STDERR, "FAIL: " . $message . "\n" );
		exit( 1 );
	}
}

$file = dirname( __DIR__ ) . '/content/guides/black-masterbatch.md';
$raw  = file_get_contents( $file );
mbci_assert( false !== $raw, 'Fixture file is readable.' );

$document = MBCI_Content_Importer::parse_document( $raw );
MBCI_Content_Importer::validate_document( $document['front_matter'], $document['body'] );

mbci_assert( 'guide.black' === $document['front_matter']['content_id'], 'Stable content ID is parsed.' );
mbci_assert( 'Black Masterbatch RFQ Guide' === $document['front_matter']['wp']['title'], 'Page title is parsed.' );
mbci_assert( 'rfq_document_request' === $document['front_matter']['form']['key'], 'Form key is parsed.' );

$blocks = MBCI_Markdown::to_blocks( $document['body'] );
mbci_assert( false !== strpos( $blocks, '<!-- wp:heading {"level":2} -->' ), 'H2 headings are converted to blocks.' );
mbci_assert( false !== strpos( $blocks, '<!-- wp:table -->' ), 'The RFQ table is converted to a table block.' );
mbci_assert( false === strpos( $blocks, '<h1' ), 'The generated body has no H1.' );
mbci_assert( false === strpos( $blocks, 'WORDPRESS IMPORT CHECKLIST' ), 'Import comments are removed from public blocks.' );
mbci_assert( false !== strpos( $blocks, 'href="/request-a-quote/?intent=black-masterbatch&amp;source=black-guide"' ), 'CTA links are preserved and safely escaped.' );

$home_file = dirname( __DIR__ ) . '/content/pages/home.md';
$home_raw  = file_get_contents( $home_file );
mbci_assert( false !== $home_raw, 'Homepage fixture file is readable.' );

$home = MBCI_Content_Importer::parse_document( $home_raw );
MBCI_Content_Importer::validate_document( $home['front_matter'], $home['body'] );
$home_blocks = MBCI_Content_Importer::to_wordpress_blocks( $home['front_matter'], $home['body'] );

mbci_assert( 'home' === $home['front_matter']['content_id'], 'Homepage content ID is parsed.' );
mbci_assert( 'gutenberg-blocks-v1' === $home['front_matter']['body_format'], 'Homepage block format is declared.' );
mbci_assert( 1 === preg_match_all( '/<h1\b/i', $home_blocks ), 'Homepage content has exactly one H1.' );
mbci_assert( 8 === preg_match_all( '/class="wp-block-group mtm-home-section /', $home_blocks ), 'Homepage content has eight sections.' );
mbci_assert( false === strpos( $home_blocks, '<!-- wp:post-content' ), 'Page content does not render itself through a nesting template.' );
mbci_assert( false === strpos( $home_blocks, '<!-- wp:template-part' ), 'Page content excludes Header and Footer template parts.' );

echo "OK: black and homepage packages parse, validate and convert to WordPress blocks.\n";
