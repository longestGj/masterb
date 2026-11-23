<?php
/**
 * Plugin Name: Masterbatch SEO Schema Roles
 * Description: Aligns Rank Math JSON-LD types with the public page role.
 * Version: 1.1.2
 */

defined( 'ABSPATH' ) || exit;

/**
 * Return the schema role for the current public request.
 *
 * @return string
 */
function mb_seo_schema_page_role() {
	if ( is_front_page() ) {
		return 'webpage';
	}

	if ( is_home() ) {
		return 'collection';
	}

	if ( is_singular( 'post' ) ) {
		return 'article';
	}

	if ( ! is_page() ) {
		return '';
	}

	$page_id = get_queried_object_id();
	$slug    = get_post_field( 'post_name', $page_id );

	if ( 'faq' === $slug ) {
		return 'faq';
	}

	if ( 'resources' === $slug ) {
		return 'collection';
	}

	$template = (string) get_page_template_slug( $page_id );
	$products = array(
		'page-bk020-product',
		'page-bk025-product',
		'page-bk030-product',
		'page-bk035-product',
		'page-bk040-product',
		'page-pt300-product',
		'page-pt450p-product',
		'page-dm2476g-product',
	);
	$categories = array(
		'page-black-masterbatch',
		'page-desiccant-masterbatch',
	);

	if ( in_array( $template, $products, true ) ) {
		return 'product';
	}

	if ( in_array( $template, $categories, true ) ) {
		return 'collection';
	}

	return 'webpage';
}

/**
 * Questions and answers rendered on the Buyer FAQ page.
 *
 * @return array<int,array{question:string,answer:string}>
 */
function mb_seo_faq_items() {
	return array(
		array(
			'question' => 'What masterbatch products do you review?',
			'answer'   => 'We review black and desiccant masterbatch inquiries for film, packaging, injection molding, extrusion and recycled PE and PP. Other product directions are not presented as current product lines.',
		),
		array(
			'question' => 'Do you publish a full product catalogue?',
			'answer'   => 'No. Grade lists, parameters and pricing sheets are not published as a catalogue because a grade is only meaningful against a resin, process and end product.',
		),
		array(
			'question' => 'What information should a masterbatch RFQ include?',
			'answer'   => 'A complete inquiry usually covers the base resin, processing method, final product, target requirement, current grade or issue, trial quantity, monthly quantity, destination and document needs.',
		),
		array(
			'question' => 'Do I need to choose a grade before contacting you?',
			'answer'   => 'No. Share your resin, application and requirement. A known grade or replacement target helps, but it is not required to start the review.',
		),
		array(
			'question' => 'How do you handle price, MOQ and lead time?',
			'answer'   => 'Fixed price, MOQ and lead time are not published because they depend on the exact grade, application and quantity. They are confirmed after the team reviews the RFQ.',
		),
		array(
			'question' => 'Can I request a sample?',
			'answer'   => 'Sample discussion is part of the RFQ review. The sample type and scope are confirmed against the resin, application and target requirement.',
		),
		array(
			'question' => 'What does a sample trial need to prove?',
			'answer'   => 'A trial is judged against a control sample, appearance and dispersion in your process, stability across the run and any change in the downstream product.',
		),
		array(
			'question' => 'Can I request TDS, SDS/MSDS or COA?',
			'answer'   => 'Yes. Submit the request through the technical document form. The team reviews the grade, application and document scope, then replies by email.',
		),
		array(
			'question' => 'Why are documents reviewed by grade rather than sent on request?',
			'answer'   => 'A document describes one tested grade or sample under defined conditions. Reusing it for another grade, application or destination can create an unsupported claim.',
		),
		array(
			'question' => 'Are your products RoHS, FDA or food-contact compliant?',
			'answer'   => 'A full-series compliance claim is not made. Compliance-related documents, where available, apply only to specific tested grades or samples and are reviewed for the intended use.',
		),
		array(
			'question' => 'What is pigment loading, and how does it differ from the addition ratio?',
			'answer'   => 'Loading is how much pigment or carbon black is inside the masterbatch. The addition ratio is how much masterbatch is fed into the process.',
		),
		array(
			'question' => 'What do MFI or MFR tell me on a masterbatch sheet?',
			'answer'   => 'MFR and MFI describe how much resin flows in ten minutes under a stated temperature and load. On a masterbatch sheet, the value relates to the carrier and must be read with its test conditions.',
		),
		array(
			'question' => 'Is a typical value the same as a specification value?',
			'answer'   => 'No. A typical value describes what the grade has generally shown. A specification value is a committed range used for acceptance.',
		),
		array(
			'question' => 'What is a control sample, and why does it matter?',
			'answer'   => 'A control sample is material that produced an accepted result. Comparing a new batch against it on the same resin, machine and settings turns blackness or appearance into a verifiable result.',
		),
		array(
			'question' => 'What are screen pack blockage and a filtration test?',
			'answer'   => 'Screen pack blockage is a faster-than-expected pressure rise or screen change. A filtration test measures how melt behaves as it passes through a defined screen setup.',
		),
		array(
			'question' => 'Which applications can masterbatch be reviewed for?',
			'answer'   => 'Inquiries may cover film and blown film, packaging, injection molding, extrusion and recycled PE or PP. Suitability is reviewed for the exact grade, resin and process.',
		),
		array(
			'question' => 'Does the base resin matter?',
			'answer'   => 'Yes. Carrier and base resin compatibility affect selection, dispersion and final-part properties. Share the resin you process, such as PE, PP, LDPE, LLDPE or HDPE.',
		),
		array(
			'question' => 'Can one grade cover several products?',
			'answer'   => 'It can, but this should not be assumed. Residence time, shear and cooling can change performance between film, molding and extrusion, even on the same resin.',
		),
		array(
			'question' => 'What happens after I submit an RFQ?',
			'answer'   => 'The team reviews product fit and document scope by grade, application and destination, then replies by email with the next step or any missing information.',
		),
	);
}

/**
 * Replace Rank Math's generic Article node with a role-specific schema node.
 *
 * @param mixed $data Rank Math JSON-LD data.
 * @return mixed
 */
add_filter(
	'rank_math/json_ld',
	static function ( $data ) {
		$role = mb_seo_schema_page_role();

		if (
			! is_array( $data ) ||
			empty( $data ) ||
			'' === $role ||
			'article' === $role
		) {
			return $data;
		}

		$page_id       = get_queried_object_id();
		$url           = $page_id ? get_permalink( $page_id ) : home_url( '/' );
		$name          = $page_id ? wp_strip_all_tags( get_the_title( $page_id ) ) : get_bloginfo( 'name' );
		$description   = $page_id ? (string) get_post_meta( $page_id, '_mb_seo_description', true ) : '';
		$website_id    = home_url( '/#website' );
		$article_key = null;

		foreach ( $data as $key => $node ) {
			if ( ! is_array( $node ) ) {
				continue;
			}

			if ( isset( $node['@type'] ) && 'WebSite' === $node['@type'] && isset( $node['@id'] ) ) {
				$website_id = $node['@id'];
			}

			if ( isset( $node['@type'] ) && 'Article' === $node['@type'] ) {
				$article_key = $key;
			}
		}

		if ( null === $article_key ) {
			return $data;
		}

		$article = $data[ $article_key ];
		$image   = $article['image'] ?? null;
		$common  = array_filter(
			array(
				'url'         => $url,
				'name'        => $name,
				'description' => $description,
				'image'       => $image,
				'isPartOf'    => array( '@id' => $website_id ),
				'inLanguage'  => 'en-US',
			)
		);

		if ( 'product' === $role ) {
			$product = array_merge(
				array(
					'@type'           => 'Product',
					'@id'             => $url . '#product',
					'brand'           => array(
						'@type' => 'Brand',
						'name'  => 'GE Chemical',
					),
					'mainEntityOfPage' => array( '@id' => $url . '#webpage' ),
				),
				$common
			);

			$grade = (string) get_post_meta( $page_id, '_mb_product_grade', true );
			if ( '' !== $grade ) {
				$product['sku'] = $grade;
			}

			$data[ $article_key ] = $product;
			return $data;
		}

		if ( 'collection' === $role ) {
			$data[ $article_key ] = array_merge(
				array(
					'@type' => 'CollectionPage',
					'@id'   => $url . '#collectionpage',
				),
				$common
			);
			return $data;
		}

		if ( 'faq' === $role ) {
			$data[ $article_key ] = array_merge(
				array(
					'@type'      => 'FAQPage',
					'@id'        => $url . '#faq',
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
						mb_seo_faq_items()
					),
				),
				$common
			);
			return $data;
		}

		unset( $data[ $article_key ] );
		return $data;
	},
	100
);

/**
 * Return the high-value theme images to expose in Rank Math's XML sitemap.
 *
 * These images are rendered by page templates rather than stored as
 * WordPress media-library attachments, so Rank Math cannot discover them from
 * post content. Keep each page to a small set of meaningful product, factory
 * and packaging images.
 *
 * @return array<string,array<int,string>>
 */
function mb_seo_sitemap_image_map() {
	return array(
		'home'                              => array(
			'home-factory-building.webp',
			'guide-black-granules.webp',
			'dm2476g-product-hero.webp',
		),
		'black-masterbatch'                 => array(
			'guide-black-granules.webp',
			'home-workshop-equipment.webp',
			'home-factory-building.webp',
		),
		'film-packaging'                    => array(
			'film-packaging-hero.webp',
		),
		'pipe-profile'                      => array(
			'pipe-profile-hero.webp',
		),
		'desiccant-masterbatch'             => array(
			'desiccant-category-factory-building.webp',
			'desiccant-category-packaging.webp',
			'desiccant-category-workshop-equipment.webp',
		),
		'bk020'                             => array(
			'bk020-product-hero.webp',
			'bk020-packaging.webp',
		),
		'bk025'                             => array(
			'bk025-product-hero.webp',
			'bk025-packaging.webp',
		),
		'bk030'                             => array(
			'bk030-product-hero.webp',
			'bk030-packaging.webp',
		),
		'bk035'                             => array(
			'bk035-product-hero.webp',
			'bk035-packaging.webp',
		),
		'bk040'                             => array(
			'bk040-product-hero.webp',
			'bk040-packaging.webp',
		),
		'pt-300'                            => array(
			'pt300-product-hero.webp',
			'pt300-packaging.webp',
		),
		'pt-450p'                           => array(
			'pt450p-product-hero.webp',
			'pt450p-packaging.webp',
		),
		'dm2476g'                           => array(
			'dm2476g-product-hero.webp',
			'dm2476g-packaging.webp',
		),
		'about-quality'                     => array(
			'home-factory-building.webp',
			'home-workshop-equipment.webp',
			'guide-black-granules.webp',
		),
		'technical-documents'               => array(
			'home-masterbatch-packaging.webp',
		),
	);
}

/**
 * Add template-rendered images to the corresponding Page sitemap entry.
 *
 * Rank Math emits the `images` array as standard <image:image> nodes. Existing
 * media-library-derived images are retained and duplicate URLs are skipped.
 *
 * @param array        $url  Sitemap URL entry.
 * @param string       $type Entry type.
 * @param object|mixed $post Post object for post entries.
 * @return array
 */
add_filter(
	'rank_math/sitemap/entry',
	static function ( $url, $type, $post ) {
		if ( 'post' !== $type || ! is_object( $post ) || ! isset( $post->post_name ) ) {
			return $url;
		}

		if ( 'page' !== ( $post->post_type ?? '' ) ) {
			return $url;
		}

		$mapping = mb_seo_sitemap_image_map();
		$slug    = (string) $post->post_name;
		$files   = $mapping[ $slug ] ?? array();

		if ( empty( $files ) ) {
			return $url;
		}

		$theme_dir = get_stylesheet_directory();
		$theme_uri = get_stylesheet_directory_uri();
		$existing  = isset( $url['images'] ) && is_array( $url['images'] )
			? $url['images']
			: array();
		$seen      = array();

		foreach ( $existing as $image ) {
			if ( ! empty( $image['src'] ) ) {
				$seen[ (string) $image['src'] ] = true;
			}
		}

		foreach ( $files as $file ) {
			if ( ! is_file( $theme_dir . '/assets/images/' . $file ) ) {
				continue;
			}

			$src = set_url_scheme(
				$theme_uri . '/assets/images/' . $file,
				'https'
			);
			if ( isset( $seen[ $src ] ) ) {
				continue;
			}

			$existing[]      = array( 'src' => $src );
			$seen[ $src ]    = true;
		}

		$url['images'] = $existing;

		return $url;
	},
	30,
	3
);
