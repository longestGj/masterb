<?php
/**
 * Apply the current product-scope changes to a production functions.php file.
 *
 * Usage:
 * php patch-remove-white-color-functions.php /path/to/functions.php
 */

$path = $argv[1] ?? '';
if ( '' === $path || ! is_file( $path ) || ! is_writable( $path ) ) {
	fwrite( STDERR, "A writable functions.php path is required.\n" );
	exit( 1 );
}

$source = file_get_contents( $path );
if ( false === $source ) {
	fwrite( STDERR, "Could not read functions.php.\n" );
	exit( 1 );
}

$delete_between = static function ( $content, $start, $end ) {
	$start_pos = strpos( $content, $start );
	$end_pos   = strpos( $content, $end );
	if ( false === $start_pos || false === $end_pos || $end_pos <= $start_pos ) {
		return $content;
	}

	return substr( $content, 0, $start_pos ) . substr( $content, $end_pos );
};

$source = $delete_between(
	$source,
	"/**\n * Render product media for the shared product-category template.",
	"/**\n * Render the Blog posts page from published WordPress posts."
);
$source = $delete_between(
	$source,
	"/**\n * Render a product-family-aware media band on the shared guide template.",
	"/**\n * Render the shared RFQ intake form."
);

$replacements = array(
	"array( 'page-products', 'page-product-guide', 'page-resources' )" => "array( 'page-products', 'page-resources' )",
	"'answer'   => 'We review black, white and color masterbatch inquiries for plastic processing.'" => "'answer'   => 'We review black and desiccant masterbatch inquiries for plastic processing.'",
	"'white'              => 'White masterbatch',\n\t\t\t'white-masterbatch'  => 'White masterbatch',\n\t\t\t'color'              => 'Color masterbatch',\n\t\t\t'color-masterbatch'  => 'Color masterbatch'," => "'desiccant'             => 'Desiccant masterbatch',\n\t\t\t'desiccant-masterbatch' => 'Desiccant masterbatch',",
	"array( 'Black masterbatch', 'White masterbatch', 'Color masterbatch', 'Not sure' )" => "array( 'Black masterbatch', 'Desiccant masterbatch', 'Not sure' )",
	"array( 'name' => 'target_color_function', 'label' => 'Target color or function', 'type' => 'text' )," => "array( 'name' => 'target_requirement', 'label' => 'Target requirement or current issue', 'type' => 'text' ),",
	"array( 'name' => 'color_reference_type', 'label' => 'Color reference type', 'type' => 'select', 'options' => array( 'Not sure', 'Physical sample', 'Pantone', 'RAL', 'Photo', 'Existing product', 'Previous grade', 'Customer standard' ) ),\n" => '',
	"array( 'name' => 'target_color_function', 'label' => 'Target or current issue', 'type' => 'textarea', 'required' => true, 'full' => true, 'rows' => 4, 'placeholder' => 'For example: deeper blackness, higher opacity, better dispersion, a color reference or a current production problem.' )," => "array( 'name' => 'target_requirement', 'label' => 'Target or current issue', 'type' => 'textarea', 'required' => true, 'full' => true, 'rows' => 4, 'placeholder' => 'For example: deeper blackness, better dispersion, moisture control or a current production problem.' ),",
	"array( 'name' => 'color_reference_type', 'label' => 'Color reference type', 'type' => 'select', 'options' => array( 'Not sure', 'Physical sample', 'Pantone', 'RAL', 'Photo', 'Existing product', 'Previous grade', 'Customer standard' ) )," => '',
);

foreach ( $replacements as $old => $new ) {
	$source = str_replace( $old, $new, $source );
}

$forbidden = preg_match(
	'/White masterbatch|Color masterbatch|white-masterbatch|color-masterbatch|target_color_function|color_reference_type/',
	$source
);
if ( $forbidden ) {
	preg_match_all(
		'/^.*(?:White masterbatch|Color masterbatch|white-masterbatch|color-masterbatch|target_color_function|color_reference_type).*$/m',
		$source,
		$matches
	);
	fwrite(
		STDERR,
		"Retired product references remain in functions.php:\n" .
		implode( "\n", $matches[0] ) .
		"\n"
	);
	exit( 1 );
}

if ( false === file_put_contents( $path, $source ) ) {
	fwrite( STDERR, "Could not write functions.php.\n" );
	exit( 1 );
}

echo "Patched functions.php for Black and Desiccant product scope.\n";
