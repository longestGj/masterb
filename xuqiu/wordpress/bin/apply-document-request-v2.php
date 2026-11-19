<?php
/**
 * Add the Technical Documents v2 conditional loading hooks to functions.php.
 *
 * Usage: php apply-document-request-v2.php /path/to/theme
 */

$theme_root = isset( $argv[1] ) ? rtrim( $argv[1], '/' ) : '';
$functions_path = $theme_root . '/functions.php';

if ( '' === $theme_root || ! is_file( $functions_path ) ) {
	fwrite( STDERR, "Missing theme functions.php.\n" );
	exit( 1 );
}

$contents = file_get_contents( $functions_path );
if ( false === $contents ) {
	fwrite( STDERR, "Could not read functions.php.\n" );
	exit( 1 );
}

$enqueue_anchor = <<<'PHP'
		if ( mb_is_contact_page() ) {
			wp_enqueue_style(
				'mtm-b2b-contact-v1',
				get_stylesheet_directory_uri() . '/assets/css/contact-v1.css',
				array( 'mtm-b2b-masterbatch' ),
				$theme->get( 'Version' )
			);
		}
PHP;
$enqueue_block = <<<'PHP'
		if ( mb_is_contact_page() ) {
			wp_enqueue_style(
				'mtm-b2b-contact-v1',
				get_stylesheet_directory_uri() . '/assets/css/contact-v1.css',
				array( 'mtm-b2b-masterbatch' ),
				$theme->get( 'Version' )
			);
		}
		if ( mb_is_document_request_page() ) {
			wp_enqueue_style(
				'mtm-b2b-document-request-v2',
				get_stylesheet_directory_uri() . '/assets/css/document-request-v2.css',
				array( 'mtm-b2b-masterbatch' ),
				$theme->get( 'Version' )
			);
		}

PHP;

$helper_anchor = <<<'PHP'
/**
 * Whether the current page uses the Black Masterbatch guide template.
PHP;
$helper_block = <<<'PHP'
/**
 * Whether the current page is rendered by the Technical Documents template.
 *
 * @return bool
 */
function mb_is_document_request_page() {
	if ( ! is_page() ) {
		return false;
	}

	$template = (string) get_page_template_slug( get_the_ID() );

	return '' !== $template && false !== strpos( $template, 'page-document-request' );
}


PHP;

$body_anchor = <<<'PHP'
		if ( mb_is_contact_page() ) {
			$classes[] = 'mtm-contact-v1';
		}
PHP;
$body_block = <<<'PHP'
		if ( mb_is_contact_page() ) {
			$classes[] = 'mtm-contact-v1';
		}
		if ( mb_is_document_request_page() ) {
			$classes[] = 'mtm-document-request';
		}
PHP;

if ( false === strpos( $contents, "'mtm-b2b-document-request-v2'" ) ) {
	if ( false === strpos( $contents, $enqueue_anchor ) ) {
		fwrite( STDERR, "Enqueue anchor not found.\n" );
		exit( 1 );
	}
	$contents = str_replace( $enqueue_anchor, $enqueue_block . $enqueue_anchor, $contents );
}

if ( false === strpos( $contents, 'function mb_is_document_request_page()' ) ) {
	if ( false === strpos( $contents, $helper_anchor ) ) {
		fwrite( STDERR, "Helper anchor not found.\n" );
		exit( 1 );
	}
	$contents = str_replace( $helper_anchor, $helper_block . $helper_anchor, $contents );
}

if ( false === strpos( $contents, "'mtm-document-request'" ) ) {
	if ( false === strpos( $contents, $body_anchor ) ) {
		fwrite( STDERR, "Body class anchor not found.\n" );
		exit( 1 );
	}
	$contents = str_replace( $body_anchor, $body_block, $contents );
}

$temp_path = $functions_path . '.document-v2-tmp';
if ( false === file_put_contents( $temp_path, $contents ) || ! rename( $temp_path, $functions_path ) ) {
	@unlink( $temp_path );
	fwrite( STDERR, "Could not write functions.php.\n" );
	exit( 1 );
}

echo "Document request v2 hooks applied.\n";
