<?php
/**
 * Remove retired White and Color Masterbatch pages and public copy.
 *
 * Dry run:
 * MB_REMOVE_APPLY=0 wp eval-file apply-remove-white-color-products.php
 *
 * Apply:
 * MB_REMOVE_APPLY=1 wp eval-file apply-remove-white-color-products.php
 */

if ( ! defined( 'ABSPATH' ) || ! class_exists( 'WP_CLI' ) ) {
	throw new RuntimeException( 'This migration must run through WP-CLI.' );
}

$apply        = '1' === getenv( 'MB_REMOVE_APPLY' );
$content_dir  = rtrim( (string) getenv( 'MB_REMOVE_CONTENT_DIR' ), '/' );
$resources    = $content_dir . '/resources.wordpress.html';
$blown_film   = $content_dir . '/masterbatch-for-blown-film.wordpress.html';
$supplier     = $content_dir . '/how-to-vet-a-masterbatch-supplier.wordpress.html';

foreach ( array( $resources, $blown_film, $supplier ) as $file ) {
	if ( ! is_readable( $file ) ) {
		WP_CLI::error( 'Required content file is not readable: ' . $file );
	}
}

$retired_pages = array(
	'white-masterbatch' => get_page_by_path( 'products/white-masterbatch', OBJECT, 'page' ),
	'color-masterbatch' => get_page_by_path( 'products/color-masterbatch', OBJECT, 'page' ),
);

foreach ( $retired_pages as $slug => $page ) {
	if ( $page instanceof WP_Post ) {
		WP_CLI::log( ( $apply ? 'DELETE ' : 'WOULD DELETE ' ) . $page->ID . ' /products/' . $slug . '/' );
		if ( $apply ) {
			$result = wp_delete_post( $page->ID, true );
			if ( ! $result ) {
				WP_CLI::error( 'Could not delete page: ' . $slug );
			}
		}
	}
}

$content_updates = array(
	80  => $resources,
	122 => $blown_film,
	129 => $supplier,
);

foreach ( $content_updates as $post_id => $file ) {
	$post = get_post( $post_id );
	if ( ! $post instanceof WP_Post ) {
		WP_CLI::error( 'Expected content record not found: ' . $post_id );
	}

	$content = file_get_contents( $file );
	if ( false === $content ) {
		WP_CLI::error( 'Could not read content file for post ' . $post_id );
	}

	WP_CLI::log( ( $apply ? 'UPDATE ' : 'WOULD UPDATE ' ) . $post_id . ' ' . $post->post_title );
	if ( $apply && $content !== $post->post_content ) {
		$result = wp_update_post(
			array(
				'ID'           => $post_id,
				'post_content' => $content,
			),
			true
		);
		if ( is_wp_error( $result ) ) {
			WP_CLI::error( $result );
		}
	}
}

$short_content = array(
	31  => 'Black masterbatch product route for carbon-black appearance, dispersion and grade review.',
	53  => 'Black and desiccant masterbatch for plastic processing applications.',
	58  => 'Buyer FAQ for black and desiccant masterbatch inquiries.',
	59  => 'This retired page redirects to Masterbatch Buyer Resources.',
	60  => 'Request a quote for black or desiccant masterbatch review.',
	66  => 'GE Chemical reviews black and desiccant masterbatch inquiries by resin, process, application and exact grade.',
	113 => 'Structural parent for the black and desiccant product routes.',
	161 => 'Desiccant masterbatch product route for CaO moisture control and DM2476G review.',
);

foreach ( $short_content as $post_id => $text ) {
	$post = get_post( $post_id );
	if ( ! $post instanceof WP_Post ) {
		continue;
	}

	$content = '<!-- wp:paragraph --><p>' . esc_html( $text ) . '</p><!-- /wp:paragraph -->';
	WP_CLI::log( ( $apply ? 'UPDATE ' : 'WOULD UPDATE ' ) . $post_id . ' ' . $post->post_title );
	if ( $apply && $content !== $post->post_content ) {
		$result = wp_update_post(
			array(
				'ID'           => $post_id,
				'post_content' => $content,
			),
			true
		);
		if ( is_wp_error( $result ) ) {
			WP_CLI::error( $result );
		}
	}
}

$checklist_id = 81;
$checklist    = get_post( $checklist_id );
if ( $checklist instanceof WP_Post ) {
	$content = str_replace(
		array(
			'Product direction: black, white, color or not sure.',
			'Blackness, opacity, whiteness or color target.',
			'Color reference type and details for color inquiries.',
			'You can select black, white or color masterbatch in either form.',
		),
		array(
			'Product direction: black, desiccant or not sure.',
			'Blackness, appearance or moisture-control target.',
			'',
			'You can select black or desiccant masterbatch in either form.',
		),
		$checklist->post_content
	);

	WP_CLI::log( ( $apply ? 'UPDATE ' : 'WOULD UPDATE ' ) . $checklist_id . ' ' . $checklist->post_title );
	if ( $apply && $content !== $checklist->post_content ) {
		$result = wp_update_post(
			array(
				'ID'           => $checklist_id,
				'post_content' => $content,
			),
			true
		);
		if ( is_wp_error( $result ) ) {
			WP_CLI::error( $result );
		}
	}
}

$document_id = 79;
$document    = get_post( $document_id );
if ( $document instanceof WP_Post ) {
	$content = str_replace(
		array(
			'black, white and color masterbatch',
			'black, white or color masterbatch',
			'Product interest: black masterbatch, white masterbatch, color masterbatch or not sure.',
		),
		array(
			'black and desiccant masterbatch',
			'black or desiccant masterbatch',
			'Product interest: black masterbatch, desiccant masterbatch or not sure.',
		),
		$document->post_content
	);
	$content = preg_replace(
		'~<!-- wp:list-item -->\s*<li><a href="/products/(?:white|color)-masterbatch/">.*?</li>\s*<!-- /wp:list-item -->~s',
		'',
		$content
	);

	WP_CLI::log( ( $apply ? 'UPDATE ' : 'WOULD UPDATE ' ) . $document_id . ' ' . $document->post_title );
	if ( $apply && $content !== $document->post_content ) {
		$result = wp_update_post(
			array(
				'ID'           => $document_id,
				'post_content' => $content,
			),
			true
		);
		if ( is_wp_error( $result ) ) {
			WP_CLI::error( $result );
		}
	}
}

$seo = array(
	53  => array(
		'title'       => 'Black Masterbatch Manufacturer in China | GE CHEMICAL',
		'description' => 'Black masterbatch manufacturer in China for 20 to 40 percent carbon black and CaO desiccant masterbatch. Share resin, process and application for review.',
	),
	66  => array(
		'title'       => 'About GE Chemical | Masterbatch Quality & Review',
		'description' => 'How GE CHEMICAL reviews black and desiccant masterbatch inquiries by exact grade and application. Documents are handled by request and review.',
	),
	79  => array(
		'title'       => 'Request Masterbatch Technical Documents | GE CHEMICAL',
		'description' => 'Request TDS, SDS/MSDS, COA and compliance-related document review for black or desiccant masterbatch inquiries and intended use.',
	),
	80  => array(
		'title'       => 'Masterbatch Buyer Resources | GE CHEMICAL',
		'description' => 'Explore black and desiccant masterbatch routes, read buyer guides, prepare an RFQ and understand technical document review.',
	),
	81  => array(
		'title'       => 'Masterbatch RFQ Checklist | Inputs & Documents',
		'description' => 'Use this masterbatch RFQ checklist to collect resin, process, application, target, quantity, destination and document review details.',
	),
	113 => array(
		'title'       => 'Masterbatch Products | GE CHEMICAL',
		'description' => 'Structural product route for black and desiccant masterbatch pages.',
	),
);

foreach ( $seo as $post_id => $values ) {
	if ( ! get_post( $post_id ) ) {
		continue;
	}

	WP_CLI::log( ( $apply ? 'UPDATE SEO ' : 'WOULD UPDATE SEO ' ) . $post_id );
	if ( $apply ) {
		update_post_meta( $post_id, '_mb_seo_title', $values['title'] );
		update_post_meta( $post_id, '_mb_seo_description', $values['description'] );
		update_post_meta( $post_id, 'rank_math_title', $values['title'] );
		update_post_meta( $post_id, 'rank_math_description', $values['description'] );
	}
}

$summaries = array(
	53 => 'GE Chemical manufactures black masterbatch in five carbon black loadings from 20% to 40% and supplies CaO desiccant masterbatch for moisture-control applications. Share the resin, process and end product for grade review.',
	59 => 'Use Masterbatch Buyer Resources to prepare an RFQ, understand document review and find current Black or Desiccant product guidance.',
	66 => 'GE CHEMICAL reviews black and desiccant masterbatch inquiries by resin, application and target. Product fit and technical documents are reviewed by exact grade and application.',
	79 => 'Request review of technical or compliance-related documents for a specific black or desiccant masterbatch inquiry. Availability is checked by grade, application, country and intended use.',
	113 => 'Choose black or desiccant masterbatch, then share the resin, process and final part for review.',
);

$page_titles = array(
	53 => 'Black Masterbatch Manufacturer in China',
);

foreach ( $summaries as $post_id => $summary ) {
	$post = get_post( $post_id );
	if ( ! $post instanceof WP_Post ) {
		continue;
	}

	WP_CLI::log( ( $apply ? 'UPDATE SUMMARY ' : 'WOULD UPDATE SUMMARY ' ) . $post_id );
	if ( $apply ) {
		wp_update_post(
			array(
				'ID'           => $post_id,
				'post_title'   => $page_titles[ $post_id ] ?? $post->post_title,
				'post_excerpt' => $summary,
			)
		);
		update_post_meta( $post_id, '_mb_hero_summary', $summary );
	}
}

$meta_updates = array(
	53  => array(
		'_mb_hero_eyebrow' => 'Black Masterbatch · Desiccant Masterbatch',
		'_mb_page_job'     => 'Position GE Chemical as a black masterbatch manufacturer and supplier in China, present the black and desiccant product routes, and guide qualified buyers into an application-focused review.',
	),
	59  => array(
		'_mb_page_job' => 'Help buyers compare current Black and Desiccant product routes, prepare an RFQ and understand technical document review.',
	),
	79  => array(
		'_mb_page_job' => 'Collect document-review requests for black and desiccant masterbatch without offering direct public file access.',
	),
	113 => array(
		'_mb_page_job' => 'Route plastic processing buyers to the black and desiccant masterbatch product pages and collect the application details needed for review.',
	),
);

foreach ( $meta_updates as $post_id => $values ) {
	foreach ( $values as $key => $value ) {
		WP_CLI::log( ( $apply ? 'UPDATE META ' : 'WOULD UPDATE META ' ) . $post_id . ' ' . $key );
		if ( $apply ) {
			update_post_meta( $post_id, $key, $value );
		}
	}
}

if ( ! $apply ) {
	WP_CLI::success( 'Dry run complete. No records were changed.' );
	return;
}

global $wpdb;
$revision_ids = $wpdb->get_col(
	"SELECT ID FROM {$wpdb->posts}
	WHERE post_type = 'revision'
	AND (
		post_content REGEXP 'White[[:space:]]+Masterbatch|Color[[:space:]]+Masterbatch|white-masterbatch|color-masterbatch'
		OR post_excerpt REGEXP 'White[[:space:]]+Masterbatch|Color[[:space:]]+Masterbatch|white-masterbatch|color-masterbatch'
	)"
);
foreach ( array_map( 'intval', $revision_ids ) as $revision_id ) {
	wp_delete_post_revision( $revision_id );
}

$front_matter_ids = $wpdb->get_col(
	"SELECT post_id FROM {$wpdb->postmeta}
	WHERE meta_key = '_mb_front_matter'
	AND meta_value REGEXP 'White[[:space:]]+Masterbatch|Color[[:space:]]+Masterbatch|white-masterbatch|color-masterbatch'"
);
foreach ( array_map( 'intval', $front_matter_ids ) as $post_id ) {
	delete_post_meta( $post_id, '_mb_front_matter' );
}

$remaining = $wpdb->get_results(
	"SELECT ID, post_type, post_status, post_title
	FROM {$wpdb->posts}
	WHERE post_type IN ('page','post','revision')
	AND (
		post_title REGEXP 'White[[:space:]]+Masterbatch|Color[[:space:]]+Masterbatch'
		OR post_content REGEXP 'White[[:space:]]+Masterbatch|Color[[:space:]]+Masterbatch|white-masterbatch|color-masterbatch'
		OR post_excerpt REGEXP 'White[[:space:]]+Masterbatch|Color[[:space:]]+Masterbatch|white-masterbatch|color-masterbatch'
	)
	ORDER BY ID",
	ARRAY_A
);

if ( $remaining ) {
	WP_CLI::error( 'Retired product references remain: ' . wp_json_encode( $remaining ) );
}

WP_CLI::success( 'Removed White and Color Masterbatch pages and public content references.' );
