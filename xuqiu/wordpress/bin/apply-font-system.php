<?php
/**
 * Apply the self-hosted Archivo + Inter font system to an existing theme.
 *
 * Usage:
 *   php apply-font-system.php /path/to/mtm-b2b-masterbatch
 *
 * Font files must already exist under assets/fonts/. The script is idempotent
 * and only changes typography-related lines in an existing production theme.
 */

$theme_root = isset( $argv[1] ) ? rtrim( $argv[1], '/' ) : '';
if ( '' === $theme_root || ! is_dir( $theme_root ) ) {
	fwrite( STDERR, "Usage: php apply-font-system.php /path/to/theme\n" );
	exit( 2 );
}

/**
 * Read and verify a required theme file.
 *
 * @param string $theme_root Theme root.
 * @param string $relative_path Relative file path.
 * @return string
 */
function mb_font_read( $theme_root, $relative_path ) {
	$path = $theme_root . '/' . $relative_path;
	if ( ! is_file( $path ) ) {
		throw new RuntimeException( "Missing file: {$relative_path}" );
	}

	$contents = file_get_contents( $path );
	if ( false === $contents ) {
		throw new RuntimeException( "Could not read: {$relative_path}" );
	}

	return $contents;
}

/**
 * Write a theme file through a same-directory temporary file.
 *
 * @param string $theme_root Theme root.
 * @param string $relative_path Relative file path.
 * @param string $contents New contents.
 */
function mb_font_write( $theme_root, $relative_path, $contents ) {
	$path = $theme_root . '/' . $relative_path;
	$temp = $path . '.font-tmp';
	if ( false === file_put_contents( $temp, $contents ) ) {
		throw new RuntimeException( "Could not write: {$relative_path}" );
	}

	if ( ! rename( $temp, $path ) ) {
		@unlink( $temp );
		throw new RuntimeException( "Could not replace: {$relative_path}" );
	}
}

/**
 * Report whether a file changed.
 *
 * @param string $relative_path Relative file path.
 * @param string $before Contents before patching.
 * @param string $after Contents after patching.
 */
function mb_font_report( $relative_path, $before, $after ) {
	printf(
		"%-44s %s\n",
		$relative_path,
		$before === $after ? 'unchanged' : 'patched'
	);
}

try {
	foreach (
		array(
			'assets/fonts/archivo/archivo-latin-variable.woff2',
			'assets/fonts/inter/inter-latin-variable.woff2',
		) as $font_file
	) {
		$font_path = $theme_root . '/' . $font_file;
		if ( ! is_file( $font_path ) || filesize( $font_path ) < 30000 ) {
			throw new RuntimeException( "Missing or incomplete font: {$font_file}" );
		}
	}

	$relative_path = 'assets/css/design-tokens.css';
	$before        = mb_font_read( $theme_root, $relative_path );
	$after         = $before;
	$font_faces    = <<<'CSS'
@font-face {
	font-family: "Archivo";
	src: url("../fonts/archivo/archivo-latin-variable.woff2") format("woff2");
	font-style: normal;
	font-weight: 400 700;
	font-stretch: 100%;
	font-display: swap;
}

@font-face {
	font-family: "Inter";
	src: url("../fonts/inter/inter-latin-variable.woff2") format("woff2");
	font-style: normal;
	font-weight: 400 700;
	font-display: swap;
}

CSS;
	if ( false === strpos( $after, 'font-family: "Archivo";' ) ) {
		$after = preg_replace(
			'/(\/\*\s*\n \* GE Chemical website design tokens\.[\s\S]*?\*\/\n)/',
			"$1\n{$font_faces}",
			$after,
			1
		);
	}
	$after = preg_replace(
		'/--ge-font-display:\s*[^;]+;/',
		'--ge-font-display: Archivo, "Helvetica Neue", Arial, sans-serif;',
		$after,
		1
	);
	$after = preg_replace(
		'/--ge-font-sans:\s*[^;]+;/',
		'--ge-font-sans: Inter, "Helvetica Neue", Arial, sans-serif;',
		$after,
		1
	);
	if ( $before !== $after ) {
		mb_font_write( $theme_root, $relative_path, $after );
	}
	mb_font_report( $relative_path, $before, $after );

	$relative_path = 'style.css';
	$before        = mb_font_read( $theme_root, $relative_path );
	$after         = preg_replace(
		'/^Version:\s*[^\r\n]+/m',
		'Version: 0.9.56',
		$before,
		1
	);
	$global_type   = <<<'CSS'
/* GE self-hosted typography system. */
html,
body,
button,
input,
select,
textarea {
	font-family: var(--ge-font-sans);
}

h1,
h2,
h3,
h4,
h5,
h6,
.wp-block-post-title {
	font-family: var(--ge-font-display);
	font-weight: 600;
}

body {
	text-rendering: optimizeLegibility;
}

CSS;
	if ( false === strpos( $after, '/* GE self-hosted typography system. */' ) ) {
		$after = preg_replace(
			'/(Text Domain: mtm-b2b-masterbatch\r?\n\*\/\r?\n)/',
			"$1\n{$global_type}",
			$after,
			1
		);
	}
	if ( $before !== $after ) {
		mb_font_write( $theme_root, $relative_path, $after );
	}
	mb_font_report( $relative_path, $before, $after );

	$relative_path = 'functions.php';
	$before        = mb_font_read( $theme_root, $relative_path );
	$after         = $before;
	$preload       = <<<'PHP'
/**
 * Preload the self-hosted display and body fonts used across the site.
 */
add_action(
	'wp_head',
	static function () {
		$font_base = get_stylesheet_directory_uri() . '/assets/fonts';
		$fonts     = array(
			$font_base . '/archivo/archivo-latin-variable.woff2',
			$font_base . '/inter/inter-latin-variable.woff2',
		);

		foreach ( $fonts as $font ) {
			printf(
				'<link rel="preload" href="%s" as="font" type="font/woff2" crossorigin>' . "\n",
				esc_url( $font )
			);
		}
	},
	1
);

PHP;
	if ( false === strpos( $after, 'archivo-latin-variable.woff2' ) ) {
		$after = preg_replace(
			'/(defined\( \'ABSPATH\' \) \|\| exit;\r?\n)/',
			"$1\n{$preload}",
			$after,
			1
		);
	}
	if ( $before !== $after ) {
		mb_font_write( $theme_root, $relative_path, $after );
	}
	mb_font_report( $relative_path, $before, $after );

	$relative_path = 'theme.json';
	$before        = mb_font_read( $theme_root, $relative_path );
	$theme_json    = json_decode( $before, true );
	if ( ! is_array( $theme_json ) ) {
		throw new RuntimeException( 'theme.json is not valid JSON' );
	}
	if ( ! isset( $theme_json['settings'] ) || ! is_array( $theme_json['settings'] ) ) {
		$theme_json['settings'] = array();
	}
	if ( ! isset( $theme_json['settings']['typography'] ) || ! is_array( $theme_json['settings']['typography'] ) ) {
		$theme_json['settings']['typography'] = array();
	}
	$theme_json['settings']['typography']['fontFamilies'] = array(
		array(
			'fontFamily' => 'Inter, Helvetica Neue, Arial, sans-serif',
			'name'       => 'Inter',
			'slug'       => 'inter',
		),
		array(
			'fontFamily' => 'Archivo, Helvetica Neue, Arial, sans-serif',
			'name'       => 'Archivo',
			'slug'       => 'archivo',
		),
	);
	$after = json_encode( $theme_json, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES );
	if ( false === $after ) {
		throw new RuntimeException( 'Could not encode theme.json' );
	}
	$after .= "\n";
	if ( $before !== $after ) {
		mb_font_write( $theme_root, $relative_path, $after );
	}
	mb_font_report( $relative_path, $before, $after );

	foreach ( glob( $theme_root . '/assets/css/*.css' ) as $css_path ) {
		$relative_path = 'assets/css/' . basename( $css_path );
		$before        = mb_font_read( $theme_root, $relative_path );
		$after         = str_replace(
			array(
				'Georgia, "Times New Roman", serif',
				'Georgia, serif',
			),
			'var(--ge-font-display)',
			$before
		);
		$after = preg_replace_callback(
			'/\{[^{}]*font-family:\s*var\(--ge-font-display\);[^{}]*font-weight:\s*400;[^{}]*\}/',
			static function ( $match ) {
				return preg_replace( '/font-weight:\s*400;/', 'font-weight: 600;', $match[0], 1 );
			},
			$after
		);
		if ( $before !== $after ) {
			mb_font_write( $theme_root, $relative_path, $after );
			mb_font_report( $relative_path, $before, $after );
		}
	}

	echo "Font system applied.\n";
} catch ( Throwable $error ) {
	fwrite( STDERR, 'ERROR: ' . $error->getMessage() . "\n" );
	exit( 1 );
}
