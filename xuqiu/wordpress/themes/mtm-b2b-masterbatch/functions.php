<?php
/**
 * Child theme styles.
 */

defined( 'ABSPATH' ) || exit;

add_action(
	'wp_enqueue_scripts',
	static function () {
		$theme = wp_get_theme();
		wp_enqueue_style(
			'mtm-b2b-masterbatch',
			get_stylesheet_uri(),
			array( 'mtm-b2b-theme' ),
			$theme->get( 'Version' )
		);
	},
	20
);

/**
 * Render the current page content inside the imported homepage template.
 *
 * The core/post-content block requires a postId context that is not always
 * provided to custom block page templates. This shortcode keeps the Page
 * content editable while making the template deterministic.
 *
 * @return string
 */
add_shortcode(
	'mb_page_content',
	static function () {
		$post_id = is_front_page() ? (int) get_option( 'page_on_front' ) : 0;
		if ( ! $post_id ) {
			$post_id = get_queried_object_id();
		}
		if ( ! $post_id ) {
			$post_id = get_the_ID();
		}

		$post = $post_id ? get_post( $post_id ) : null;
		if ( ! $post || '' === trim( $post->post_content ) ) {
			return '';
		}

		return do_blocks( $post->post_content );
	}
);

/**
 * Use the imported homepage SEO title as the exact document title.
 *
 * @param string $title Precomputed document title.
 * @return string
 */
add_filter(
	'pre_get_document_title',
	static function ( $title ) {
		$front_page_id = (int) get_option( 'page_on_front' );
		$queried_id    = (int) get_queried_object_id();
		if ( ! $front_page_id || $front_page_id !== $queried_id ) {
			return $title;
		}

		$seo_title = trim( (string) get_post_meta( $front_page_id, '_mb_seo_title', true ) );
		return '' !== $seo_title ? $seo_title : $title;
	},
	99
);

/**
 * Prevent later theme or plugin title parts from appending the site name.
 *
 * @param array<string,string> $parts Document title parts.
 * @return array<string,string>
 */
add_filter(
	'document_title_parts',
	static function ( $parts ) {
		$front_page_id = (int) get_option( 'page_on_front' );
		$queried_id    = (int) get_queried_object_id();
		if ( ! $front_page_id || $front_page_id !== $queried_id ) {
			return $parts;
		}

		$seo_title = trim( (string) get_post_meta( $front_page_id, '_mb_seo_title', true ) );
		if ( '' === $seo_title ) {
			return $parts;
		}

		return array( 'title' => $seo_title );
	},
	99
);

/**
 * Output the imported homepage meta description when no SEO plugin is active.
 *
 * @return void
 */
add_action(
	'wp_head',
	static function () {
		if (
			! is_front_page() ||
			defined( 'WPSEO_VERSION' ) ||
			defined( 'RANK_MATH_VERSION' )
		) {
			return;
		}

		$post_id     = (int) get_option( 'page_on_front' );
		$description = $post_id
			? trim( (string) get_post_meta( $post_id, '_mb_seo_description', true ) )
			: '';

		if ( '' !== $description ) {
			echo '<meta name="description" content="' .
				esc_attr( $description ) .
				'">' . "\n";
		}
	},
	2
);

/**
 * Add FAQ structured data that mirrors the visible homepage FAQ.
 *
 * @return void
 */
add_action(
	'wp_head',
	static function () {
		if (
			! is_front_page() ||
			defined( 'WPSEO_VERSION' ) ||
			defined( 'RANK_MATH_VERSION' )
		) {
			return;
		}

		$faq_items = array(
			array(
				'question' => 'What can I send?',
				'answer'   => 'We review black, white and color masterbatch inquiries for plastic processing.',
			),
			array(
				'question' => 'Which details help with an RFQ?',
				'answer'   => 'Include the base resin, processing method, end product, appearance or performance target, current issue, known grade, quantity and document needs.',
			),
			array(
				'question' => 'Should I choose a grade first?',
				'answer'   => 'No. Share your resin, application and current requirement. A known grade or replacement target helps, but it is not required to start the review.',
			),
			array(
				'question' => 'How do I ask for TDS, SDS/MSDS or COA?',
				'answer'   => 'Yes. Technical documents are requested by form and reviewed manually by exact product grade, application and document scope before an email reply.',
			),
			array(
				'question' => 'Does one document cover every grade?',
				'answer'   => 'No. Technical and compliance-related documents relate to the product, grade or sample they describe.',
			),
		);

		$schema = array(
			'@context'   => 'https://schema.org',
			'@type'      => 'FAQPage',
			'mainEntity' => array_map(
				static function ( $item ) {
					return array(
						'@type'          => 'Question',
						'name'           => $item['question'],
						'acceptedAnswer' => array(
							'@type' => 'Answer',
							'text'  => $item['answer'],
						),
					);
				},
				$faq_items
			),
		);

		echo '<script type="application/ld+json">' .
			wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) .
			'</script>' . "\n";
	},
	3
);
