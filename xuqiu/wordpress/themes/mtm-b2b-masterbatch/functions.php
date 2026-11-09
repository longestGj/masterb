<?php
/**
 * Child theme styles.
 */

defined( 'ABSPATH' ) || exit;

/**
 * Keep the legacy product post type away from the public /products/ page tree.
 *
 * The parent theme registers a product content type at products/... even
 * though this site uses the page hierarchy for its public product routes.
 *
 * @param array  $args      Post type registration arguments.
 * @param string $post_type Post type name.
 * @return array
 */
add_filter(
	'register_post_type_args',
	static function ( $args, $post_type ) {
		if ( 'product' !== $post_type ) {
			return $args;
		}

		$args['rewrite']     = array(
			'slug'       => 'product-catalog',
			'with_front' => false,
		);
		$args['has_archive'] = 'product-catalog';

		return $args;
	},
	10,
	2
);

if ( defined( 'RANK_MATH_VERSION' ) ) {
	// Rank Math also moves the core title renderer into rank_math/head.
	// Keep WordPress's normal title output only, while Rank Math still
	// supplies the generated title through its document-title filters.
	remove_action( 'rank_math/head', '_wp_render_title_tag', 1 );
	add_action(
		'wp_head',
		static function () {
			remove_action( 'rank_math/head', '_wp_render_title_tag', 1 );
		},
		0
	);
}

add_action(
	'wp_enqueue_scripts',
	static function () {
		$theme = wp_get_theme();
		wp_enqueue_style(
			'mtm-b2b-design-tokens',
			get_stylesheet_directory_uri() . '/assets/css/design-tokens.css',
			array(),
			$theme->get( 'Version' )
		);
		wp_enqueue_style(
			'mtm-b2b-masterbatch',
			get_stylesheet_uri(),
			array( 'mtm-b2b-theme', 'mtm-b2b-design-tokens' ),
			$theme->get( 'Version' )
		);
		if ( is_front_page() ) {
			wp_enqueue_style(
				'mtm-b2b-home-refresh-v2',
				get_stylesheet_directory_uri() . '/assets/css/home-refresh-v2.css',
				array( 'mtm-b2b-masterbatch' ),
				$theme->get( 'Version' )
			);
		}
		if ( mb_is_about_field_page() ) {
			wp_enqueue_style(
				'mtm-b2b-about-field-manual',
				get_stylesheet_directory_uri() . '/assets/css/about-field-manual.css',
				array( 'mtm-b2b-masterbatch' ),
				$theme->get( 'Version' )
			);
		}
		if ( mb_is_faq_field_page() ) {
			wp_enqueue_style(
				'mtm-b2b-faq-field-manual',
				get_stylesheet_directory_uri() . '/assets/css/faq-field-manual.css',
				array( 'mtm-b2b-masterbatch' ),
				$theme->get( 'Version' )
			);
		}
		if ( mb_is_contact_page() ) {
			wp_enqueue_style(
				'mtm-b2b-contact-v1',
				get_stylesheet_directory_uri() . '/assets/css/contact-v1.css',
				array( 'mtm-b2b-masterbatch' ),
				$theme->get( 'Version' )
			);
		}
		if ( mb_is_black_masterbatch_guide_page() ) {
			wp_enqueue_style(
				'mtm-b2b-black-masterbatch-guide',
				get_stylesheet_directory_uri() . '/assets/css/black-masterbatch-guide.css',
				array( 'mtm-b2b-masterbatch' ),
				$theme->get( 'Version' )
			);
		}
		if ( mb_is_bk040_page() ) {
			wp_enqueue_style(
				'mtm-b2b-bk040-product',
				get_stylesheet_directory_uri() . '/assets/css/bk040-product.css',
				array( 'mtm-b2b-masterbatch' ),
				$theme->get( 'Version' )
			);
		}
		if ( is_singular( 'post' ) ) {
			wp_enqueue_style(
				'mtm-b2b-article',
				get_stylesheet_directory_uri() . '/assets/css/article.css',
				array( 'mtm-b2b-masterbatch' ),
				$theme->get( 'Version' )
			);
		}
		if ( is_home() ) {
			wp_enqueue_style(
				'mtm-b2b-blog-archive',
				get_stylesheet_directory_uri() . '/assets/css/blog-archive.css',
				array( 'mtm-b2b-masterbatch' ),
				$theme->get( 'Version' )
			);
		}
	},
	20
);

add_action(
	'wp_enqueue_scripts',
	static function () {
		$theme = wp_get_theme();
		wp_enqueue_style(
			'mtm-b2b-site-chrome',
			get_stylesheet_directory_uri() . '/assets/css/site-chrome.css',
			array( 'mtm-b2b-masterbatch' ),
			$theme->get( 'Version' )
		);
		wp_enqueue_script(
			'mtm-b2b-site-chrome',
			get_stylesheet_directory_uri() . '/assets/js/site-chrome.js',
			array(),
			$theme->get( 'Version' ),
			true
		);
	},
	30
);

/**
 * Whether the current page is rendered by the About / Quality field template.
 *
 * The check is keyed on the assigned block template instead of a page slug or
 * ID, so the styling keeps working if the page is moved or renamed.
 *
 * @return bool
 */
function mb_is_about_field_page() {
	if ( ! is_page() ) {
		return false;
	}

	$template = (string) get_page_template_slug( get_the_ID() );

	return '' !== $template && false !== strpos( $template, 'page-about-quality' );
}

/**
 * Whether the current page is rendered by the Buyer FAQ field template.
 *
 * Same rule as the About page: keyed on the assigned block template, not on a
 * page slug or ID, so the styling survives a move or rename.
 *
 * @return bool
 */
function mb_is_faq_field_page() {
	if ( ! is_page() ) {
		return false;
	}

	$template = (string) get_page_template_slug( get_the_ID() );

	return '' !== $template && false !== strpos( $template, 'page-faq' );
}

/**
 * Whether the current page is rendered by the Contact / Request a Quote template.
 *
 * @return bool
 */
function mb_is_contact_page() {
	if ( ! is_page() ) {
		return false;
	}

	$template = (string) get_page_template_slug( get_the_ID() );

	return '' !== $template && false !== strpos( $template, 'page-request-a-quote' );
}

/**
 * Whether the current page uses the Black Masterbatch guide template.
 *
 * @return bool
 */
function mb_is_black_masterbatch_guide_page() {
	if ( ! is_page() ) {
		return false;
	}

	$template = (string) get_page_template_slug( get_the_ID() );

	return '' !== $template && false !== strpos( $template, 'page-black-masterbatch' );
}

/**
 * Whether the current page uses the BK040 product detail template.
 *
 * @return bool
 */
function mb_is_bk040_page() {
	if ( ! is_page() ) {
		return false;
	}

	$template = (string) get_page_template_slug( get_the_ID() );

	return '' !== $template && false !== strpos( $template, 'page-bk040-product' );
}

add_filter(
	'body_class',
	static function ( $classes ) {
		if ( mb_is_about_field_page() ) {
			$classes[] = 'mtm-about-field';
		}
		if ( mb_is_faq_field_page() ) {
			$classes[] = 'mtm-faq-field';
		}
		if ( mb_is_contact_page() ) {
			$classes[] = 'mtm-contact-v1';
		}
		if ( mb_is_black_masterbatch_guide_page() ) {
			$classes[] = 'mtm-black-guide-page';
		}
		if ( mb_is_bk040_page() ) {
			$classes[] = 'mtm-bk040-page';
		}
		if ( is_home() ) {
			$classes[] = 'mtm-blog-archive';
		}
		if ( is_singular( 'post' ) ) {
			$classes[] = 'mtm-article-page';
		}

		return $classes;
	}
);

/**
 * Return a short category label for a blog card.
 *
 * @param int $post_id Post ID.
 * @return string
 */
function mb_blog_category_label( $post_id ) {
	$categories = get_the_category( $post_id );
	if ( empty( $categories ) ) {
		return 'Buyer guide';
	}

	return $categories[0]->name;
}

/**
 * Render the Blog posts page from published WordPress posts.
 *
 * @return string
 */
add_shortcode(
	'mb_blog_archive',
	static function () {
		$posts = get_posts(
			array(
				'post_type'           => 'post',
				'post_status'         => 'publish',
				'posts_per_page'      => 3,
				'ignore_sticky_posts' => true,
			)
		);

		if ( empty( $posts ) ) {
			return '<main id="main" class="blog-page"><div class="blog-container blog-section"><h1>Masterbatch guides and buyer articles.</h1><p>No buyer guides have been published yet.</p></div></main>';
		}

		$featured  = $posts[0];
		$secondary = array_slice( $posts, 1, 2 );
		$fallback  = get_stylesheet_directory_uri() . '/assets/images/home-masterbatch-product.jpg';

		ob_start();
		?>
		<main id="main" class="blog-page">
			<div class="blog-crumb-bar">
				<div class="blog-container">
					<nav class="blog-crumb" aria-label="Breadcrumb">
						<a href="/">Home</a>
						<span aria-hidden="true">/</span>
						<span aria-current="page">Blog</span>
					</nav>
				</div>
			</div>

			<section class="blog-hero">
				<div class="blog-container blog-hero__grid">
					<div class="blog-hero__copy">
						<h1>Masterbatch guides for better buying decisions.</h1>
						<p>Read practical notes on material selection, supplier review and production troubleshooting before the next quote or trial.</p>
						<div class="blog-hero__actions">
							<a class="blog-button" href="#articles">Browse the guides</a>
							<a class="blog-button blog-button--outline" href="/resources/">Open buyer tools</a>
						</div>
					</div>

					<nav class="blog-reading-index" aria-label="Browse current guides">
						<p>Browse the current guides</p>
						<?php foreach ( $posts as $index => $post ) : ?>
							<a href="<?php echo esc_url( get_permalink( $post ) ); ?>">
								<span><?php echo esc_html( mb_blog_category_label( $post->ID ) ); ?></span>
								<strong><?php echo esc_html( get_the_title( $post ) ); ?></strong>
							</a>
						<?php endforeach; ?>
					</nav>
				</div>
			</section>

			<section class="blog-section blog-articles" id="articles">
				<div class="blog-container">
					<header class="blog-section-head">
						<h2>Latest buyer guides</h2>
						<p>Start with the decision in front of you, then move into the product and document detail.</p>
					</header>

					<div class="blog-article-grid">
						<article class="blog-feature">
							<a class="blog-feature__media" href="<?php echo esc_url( get_permalink( $featured ) ); ?>">
								<?php
								$featured_image = get_the_post_thumbnail(
									$featured->ID,
									'large',
									array(
										'loading'       => 'eager',
										'fetchpriority' => 'high',
									)
								);
								echo $featured_image ? $featured_image : '<img src="' . esc_url( $fallback ) . '" alt="">';
								?>
							</a>
							<div class="blog-feature__body">
								<p class="blog-type"><?php echo esc_html( mb_blog_category_label( $featured->ID ) ); ?></p>
								<h3><a href="<?php echo esc_url( get_permalink( $featured ) ); ?>"><?php echo esc_html( get_the_title( $featured ) ); ?></a></h3>
								<p><?php echo esc_html( wp_trim_words( get_the_excerpt( $featured ), 34 ) ); ?></p>
								<a class="blog-read-link" href="<?php echo esc_url( get_permalink( $featured ) ); ?>">Read the guide</a>
							</div>
						</article>

						<div class="blog-secondary">
							<?php foreach ( $secondary as $index => $post ) : ?>
								<article class="blog-secondary-card <?php echo 0 === $index ? 'blog-secondary-card--dark' : 'blog-secondary-card--soft'; ?>">
									<a class="blog-secondary-card__media" href="<?php echo esc_url( get_permalink( $post ) ); ?>">
										<?php
										$image = get_the_post_thumbnail(
											$post->ID,
											'large',
											array(
												'loading'  => 'lazy',
												'decoding' => 'async',
											)
										);
										echo $image ? $image : '<img src="' . esc_url( $fallback ) . '" alt="" loading="lazy" decoding="async">';
										?>
									</a>
									<div class="blog-secondary-card__body">
										<p class="blog-type"><?php echo esc_html( mb_blog_category_label( $post->ID ) ); ?></p>
										<h3><a href="<?php echo esc_url( get_permalink( $post ) ); ?>"><?php echo esc_html( get_the_title( $post ) ); ?></a></h3>
										<p><?php echo esc_html( wp_trim_words( get_the_excerpt( $post ), 24 ) ); ?></p>
										<a class="blog-read-link" href="<?php echo esc_url( get_permalink( $post ) ); ?>">Read the guide</a>
									</div>
								</article>
							<?php endforeach; ?>
						</div>
					</div>
				</div>
			</section>

			<section class="blog-tools">
				<div class="blog-container blog-tools__grid">
					<div>
						<h2>Reading done. What comes next?</h2>
						<p>Use Resources for the RFQ checklist, buyer questions and technical document requests that support a real material decision.</p>
					</div>
					<nav aria-label="Buyer resources">
						<a href="/resources/">
							<span>Buyer resources</span>
							<strong>RFQ checklist, Buyer FAQ and document guidance</strong>
						</a>
						<a href="/technical-documents/">
							<span>Technical files</span>
							<strong>Request TDS, SDS/MSDS or COA review</strong>
						</a>
					</nav>
				</div>
			</section>

			<section class="blog-final">
				<div class="blog-container blog-final__grid">
					<div>
						<h2>Have a live material question?</h2>
						<p>Send the base resin, process, final product and target so the team can review the right product direction.</p>
					</div>
					<a class="blog-button" href="/request-a-quote/">Submit an inquiry</a>
				</div>
			</section>
		</main>
		<?php

		return (string) ob_get_clean();
	}
);

/**
 * Render a single technical article.
 *
 * @return string
 */
add_shortcode(
	'mb_article_page',
	static function () {
		$post = get_queried_object();
		if ( ! $post instanceof WP_Post || 'post' !== $post->post_type ) {
			return '';
		}

		$content = do_shortcode( do_blocks( $post->post_content ) );
		$toc     = array();
		$content = preg_replace_callback(
			'/<h2([^>]*)>(.*?)<\/h2>/is',
			static function ( $matches ) use ( &$toc ) {
				$title = trim( wp_strip_all_tags( $matches[2] ) );
				$id    = '';

				if ( preg_match( '/\sid=("|\')(.*?)\1/', $matches[1], $id_match ) ) {
					$id = $id_match[2];
				} else {
					$id = sanitize_title( $title );
				}

				$attributes = $matches[1];
				if ( false === strpos( $attributes, 'id=' ) ) {
					$attributes .= ' id="' . esc_attr( $id ) . '"';
				}

				$toc[] = array(
					'id'    => $id,
					'title' => $title,
				);

				return '<h2' . $attributes . '>' . $matches[2] . '</h2>';
			},
			$content
		);

		$hero_title = trim( (string) get_post_meta( $post->ID, '_mb_article_hero_title', true ) );
		if ( '' === $hero_title ) {
			$hero_title = get_the_title( $post );
		}

		$excerpt    = wp_trim_words( get_the_excerpt( $post ), 42 );
		$category   = mb_blog_category_label( $post->ID );
		$hero_image = get_the_post_thumbnail_url( $post, 'full' );
		$hero_style = $hero_image
			? ' style="background-image:url(' . esc_url( $hero_image ) . ')"'
			: '';
		$first_id   = ! empty( $toc ) ? $toc[0]['id'] : '';

		$related = get_posts(
			array(
				'post_type'           => 'post',
				'post_status'         => 'publish',
				'posts_per_page'      => 2,
				'post__not_in'        => array( $post->ID ),
				'ignore_sticky_posts' => true,
			)
		);

		$toc_markup = '';
		foreach ( $toc as $index => $item ) {
			$toc_markup .= '<li><a href="#' . esc_attr( $item['id'] ) . '"><span>' .
				esc_html( str_pad( (string) ( $index + 1 ), 2, '0', STR_PAD_LEFT ) ) . '</span>' .
				esc_html( $item['title'] ) . '</a></li>';
		}

		ob_start();
		?>
		<main id="main" class="article-page">
			<div class="article-crumb-bar">
				<div class="article-container">
					<nav class="article-crumb" aria-label="Breadcrumb">
						<a href="/">Home</a>
						<span aria-hidden="true">/</span>
						<a href="/blog/">Blog</a>
						<span aria-hidden="true">/</span>
						<span aria-current="page"><?php echo esc_html( get_the_title( $post ) ); ?></span>
					</nav>
				</div>
			</div>

			<header class="article-hero"<?php echo $hero_style; ?>>
				<div class="article-container">
					<div class="article-hero__copy">
						<p class="article-type"><?php echo esc_html( $category ); ?></p>
						<h1><?php echo esc_html( $hero_title ); ?></h1>
						<p class="article-hero__deck"><?php echo esc_html( $excerpt ); ?></p>
						<?php if ( $first_id ) : ?>
							<a class="article-button" href="#<?php echo esc_attr( $first_id ); ?>">Start with the evidence</a>
						<?php endif; ?>
					</div>
				</div>
			</header>

			<section class="article-reading">
				<div class="article-container article-reading__grid">
					<aside class="article-toc article-toc--desktop" aria-label="On this page">
						<p>On this page</p>
						<ol><?php echo $toc_markup; ?></ol>
						<a class="article-toc__cta" href="/request-a-quote/?intent=black-masterbatch&amp;source=<?php echo esc_attr( $post->post_name ); ?>">
							<span>Have a current defect?</span>
							<strong>Request a material review</strong>
						</a>
					</aside>

					<div class="article-main">
						<details class="article-toc-mobile">
							<summary>On this page</summary>
							<ol><?php echo $toc_markup; ?></ol>
						</details>

						<div class="article-content"><?php echo $content; ?></div>

						<?php if ( ! empty( $related ) ) : ?>
							<section class="article-related" aria-labelledby="continue-reading">
								<h2 id="continue-reading">Continue reading</h2>
								<div>
									<?php foreach ( $related as $related_post ) : ?>
										<a href="<?php echo esc_url( get_permalink( $related_post ) ); ?>">
											<span><?php echo esc_html( mb_blog_category_label( $related_post->ID ) ); ?></span>
											<strong><?php echo esc_html( get_the_title( $related_post ) ); ?></strong>
										</a>
									<?php endforeach; ?>
								</div>
							</section>
						<?php endif; ?>
					</div>
				</div>
			</section>

			<section class="article-final">
				<div class="article-container article-final__grid">
					<div>
						<h2>Turn the evidence into a reviewable question.</h2>
						<p>Send the resin, process, product reference and current observations so the next check can be scoped properly.</p>
					</div>
					<a class="article-button" href="/request-a-quote/?intent=black-masterbatch&amp;source=<?php echo esc_attr( $post->post_name ); ?>">Submit an inquiry</a>
				</div>
			</section>
		</main>
		<?php

		return (string) ob_get_clean();
	}
);

/**
 * The public site is English even though the WordPress admin uses Chinese.
 *
 * @param string $locale Current locale.
 * @return string
 */
add_filter(
	'locale',
	static function ( $locale ) {
		if ( is_admin() || wp_doing_ajax() || wp_doing_cron() ) {
			return $locale;
		}

		return 'en_US';
	},
	99
);

add_filter(
	'rank_math/schema/language',
	static function () {
		return 'en-US';
	}
);

add_filter(
	'language_attributes',
	static function ( $output ) {
		if ( mb_is_bk040_page() ) {
			$output .= ' data-type="product"';
		}

		return $output;
	}
);

add_action(
	'wp_head',
	static function () {
		if ( ! mb_is_bk040_page() ) {
			return;
		}

		echo '<meta name="page-type" content="product">' . "\n";
		echo '<meta name="site-kind" content="other">' . "\n";
		echo '<meta name="theme-color" content="#305030">' . "\n";
	},
	2
);

/**
 * Keep the front page out of the XML sitemap during the noindex staging phase.
 *
 * WordPress returns blog_public=0 while the production site is being reviewed.
 * Returning an empty entry removes only the configured static front page from
 * Rank Math's sitemap; all other published pages remain available.
 *
 * @param array        $url  Sitemap URL entry.
 * @param string       $type Entry type.
 * @param object|mixed $post Post object for post entries.
 * @return array
 */
add_filter(
	'rank_math/sitemap/entry',
	static function ( $url, $type, $post ) {
		if ( 'post' !== $type || ! is_object( $post ) || ! isset( $post->ID ) ) {
			return $url;
		}

		$front_page_id = (int) get_option( 'page_on_front' );
		$is_staged     = 0 === (int) get_option( 'blog_public' );

		if ( $is_staged && $front_page_id > 0 && $front_page_id === (int) $post->ID ) {
			return array();
		}

		return $url;
	},
	20,
	3
);

/**
 * Keep JSON-LD values free from HTML entities such as &amp;.
 *
 * @param mixed $data Schema data.
 * @return mixed
 */
add_filter(
	'rank_math/json_ld',
	static function ( $data ) {
		array_walk_recursive(
			$data,
			static function ( &$value ) {
				if ( is_string( $value ) ) {
					$value = html_entity_decode( $value, ENT_QUOTES | ENT_HTML5, 'UTF-8' );
				}
			}
		);

		return $data;
	},
	99
);

/**
 * Resolve the GA4 measurement ID without committing credentials.
 *
 * @return string
 */
function mb_ga4_measurement_id() {
	$measurement_id = getenv( 'MASTERBATCH_GA4_MEASUREMENT_ID' );
	if ( ! $measurement_id ) {
		$measurement_id = get_option( 'mb_ga4_measurement_id', '' );
	}
	$measurement_id = strtoupper( trim( (string) $measurement_id ) );

	return preg_match( '/^G-[A-Z0-9]{4,}$/', $measurement_id ) ? $measurement_id : '';
}

/**
 * Load GA4 and report form conversion outcomes without sending form contents.
 *
 * @return void
 */
add_action(
	'wp_head',
	static function () {
		if ( is_admin() || ( is_user_logged_in() && current_user_can( 'manage_options' ) ) ) {
			return;
		}

		$measurement_id = mb_ga4_measurement_id();
		if ( '' === $measurement_id ) {
			return;
		}
		?>
		<script async src="https://www.googletagmanager.com/gtag/js?id=<?php echo esc_attr( $measurement_id ); ?>"></script>
		<script>
			window.dataLayer = window.dataLayer || [];
			function gtag(){dataLayer.push(arguments);}
			gtag('js', new Date());
			gtag('config', <?php echo wp_json_encode( $measurement_id ); ?>, {
				'anonymize_ip': true,
				'send_page_view': true
			});

			(function () {
				var storageKey = 'mb_ga4_entry_referrer';
				var clientKey = 'mb_ga4_client_id';

				function safeGet(storage, key) {
					try { return storage.getItem(key); } catch (error) { return null; }
				}

				function safeSet(storage, key, value) {
					try { storage.setItem(key, value); } catch (error) {}
				}

				function getClientId() {
					var match = document.cookie.match(/(?:^|; )_ga=GA\d+\.\d+\.(\d+\.\d+)/);
					if (match) { return match[1]; }

					var generated = safeGet(sessionStorage, clientKey);
					if (!generated) {
						generated = window.crypto && window.crypto.randomUUID
							? window.crypto.randomUUID()
							: 'mb-' + Date.now() + '-' + Math.random().toString(16).slice(2);
						safeSet(sessionStorage, clientKey, generated);
					}
					return generated;
				}

				if (!safeGet(sessionStorage, storageKey)) {
					safeSet(sessionStorage, storageKey, document.referrer || 'direct');
				}

				function runAnalytics() {
					var form = document.querySelector('form.mtm-rfq-form');
					if (form) {
						var clientInput = form.querySelector('input[name="ga_client_id"]');
						if (clientInput) { clientInput.value = getClientId(); }
					}

					var params = new URLSearchParams(window.location.search);
					var status = params.get('rfq_status');
					if (status !== 'success' && status !== 'error') { return; }

					var context = params.get('rfq_context') === 'documents' ? 'documents' : 'rfq';
					var eventNames = {
						'rfq:success': 'rfq_submit_success',
						'rfq:error': 'rfq_submit_error',
						'documents:success': 'documents_submit_success',
						'documents:error': 'documents_submit_error'
					};
					gtag('event', eventNames[context + ':' + status], {
						'form_context': context,
						'product_interest': params.get('rfq_product') || 'Not sure',
						'source_page': params.get('rfq_source') || window.location.pathname,
						'page_location': window.location.href,
						'entry_referrer': safeGet(sessionStorage, storageKey) || 'direct'
					});

					var cleanUrl = new URL(window.location.href);
					['rfq_status', 'rfq_context', 'rfq_product', 'rfq_source'].forEach(function (key) {
						cleanUrl.searchParams.delete(key);
					});
					window.history.replaceState({}, '', cleanUrl.pathname + cleanUrl.search + cleanUrl.hash);
				}

				if (document.readyState === 'loading') {
					document.addEventListener('DOMContentLoaded', runAnalytics);
				} else {
					runAnalytics();
				}
			}());
		</script>
		<?php
	},
	99
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
 * Use the imported page SEO title as the exact document title.
 *
 * @param string $title Precomputed document title.
 * @return string
 */
add_filter(
	'pre_get_document_title',
	static function ( $title ) {
		if ( defined( 'WPSEO_VERSION' ) || defined( 'RANK_MATH_VERSION' ) ) {
			return $title;
		}

		$queried_id = (int) get_queried_object_id();
		$post       = $queried_id ? get_post( $queried_id ) : null;
		if ( ! $post || 'page' !== $post->post_type ) {
			return $title;
		}

		$seo_title = trim( (string) get_post_meta( $queried_id, '_mb_seo_title', true ) );
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
		if ( defined( 'WPSEO_VERSION' ) || defined( 'RANK_MATH_VERSION' ) ) {
			return $parts;
		}

		$queried_id = (int) get_queried_object_id();
		$post       = $queried_id ? get_post( $queried_id ) : null;
		if ( ! $post || 'page' !== $post->post_type ) {
			return $parts;
		}

		$seo_title = trim( (string) get_post_meta( $queried_id, '_mb_seo_title', true ) );
		if ( '' === $seo_title ) {
			return $parts;
		}

		return array( 'title' => $seo_title );
	},
	99
);

/**
 * Output the imported page meta description when no SEO plugin is active.
 *
 * @return void
 */
add_action(
	'wp_head',
	static function () {
		if (
			defined( 'WPSEO_VERSION' ) ||
			defined( 'RANK_MATH_VERSION' )
		) {
			return;
		}

		$post_id = (int) get_queried_object_id();
		$post    = $post_id ? get_post( $post_id ) : null;
		if ( ! $post || 'page' !== $post->post_type ) {
			return;
		}

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

/**
 * Render a product-family-aware media band on the shared guide template.
 *
 * The importer stores each guide's product family in the _mb_product_family
 * meta. This shortcode picks a matching granule photo and pairs it with the
 * shared packaging and pallet photos, so the black, white and color guides
 * each show relevant imagery while still using one template.
 *
 * @return string
 */
add_shortcode(
	'mb_guide_media',
	static function () {
		$post_id = get_the_ID();
		if ( ! $post_id ) {
			$post_id = get_queried_object_id();
		}
		if ( ! $post_id ) {
			return '';
		}

		$family = strtolower( trim( (string) get_post_meta( $post_id, '_mb_product_family', true ) ) );

		$base = trailingslashit( get_stylesheet_directory_uri() ) . 'assets/images/';

		$granule_map = array(
			'black' => array( 'guide-black-granules.jpg', 'Black masterbatch granules' ),
			'white' => array( 'guide-white-granules.jpg', 'White masterbatch granules' ),
			'color' => array( 'guide-color-granules.jpg', 'Masterbatch granules' ),
		);
		$granule = isset( $granule_map[ $family ] ) ? $granule_map[ $family ] : $granule_map['color'];

		$items = array(
			array( $granule[0], $granule[1], $granule[1] ),
			array( 'home-masterbatch-packaging.jpg', 'Stacked bags of white and black masterbatch on a pallet', 'Bagged masterbatch on a pallet' ),
			array( 'masterbatch-palletized-shipment.jpg', 'Palletized masterbatch bags wrapped in stretch film, ready for shipment', 'Wrapped pallets ready for shipment' ),
		);

		$html = '<div class="mtm-guide-media">';
		foreach ( $items as $item ) {
			$html .= '<figure class="mtm-guide-media__item">'
				. '<img src="' . esc_url( $base . $item[0] ) . '" alt="' . esc_attr( $item[1] ) . '"'
				. ' loading="lazy" decoding="async" />'
				. '<figcaption>' . esc_html( $item[2] ) . '</figcaption>'
				. '</figure>';
		}
		$html .= '</div>';

		return $html;
	}
);

/**
 * Render the shared RFQ intake form.
 *
 * Submission is handled by the mb-rfq-submissions MU Plugin.
 *
 * @param array<string,string> $atts Shortcode attributes.
 * @return string
 */
add_shortcode(
	'mb_rfq_form',
	static function ( $atts = array() ) {
		$atts = shortcode_atts(
			array(
				'context' => 'rfq',
			),
			$atts,
			'mb_rfq_form'
		);

		$context      = sanitize_key( $atts['context'] );
		if ( in_array( $context, array( 'documents', 'document', 'document-request', 'document_request' ), true ) ) {
			$context = 'documents';
		}
		$is_document_request = 'documents' === $context;
		$status       = isset( $_GET['rfq_status'] )
			? sanitize_key( wp_unslash( $_GET['rfq_status'] ) )
			: '';
		$intent       = isset( $_GET['intent'] )
			? sanitize_key( wp_unslash( $_GET['intent'] ) )
			: '';
		$intent_map   = array(
			'black'              => 'Black masterbatch',
			'black-masterbatch'  => 'Black masterbatch',
			'white'              => 'White masterbatch',
			'white-masterbatch'  => 'White masterbatch',
			'color'              => 'Color masterbatch',
			'color-masterbatch'  => 'Color masterbatch',
		);
		$product_interest = $intent_map[ $intent ] ?? 'Not sure';
		$source_page      = get_permalink() ?: home_url( '/request-a-quote/' );
		$document_fields = array(
			array( 'name' => 'full_name', 'label' => 'Full name', 'type' => 'text', 'required' => true, 'autocomplete' => 'name' ),
			array( 'name' => 'company', 'label' => 'Company', 'type' => 'text', 'required' => true, 'autocomplete' => 'organization' ),
			array( 'name' => 'email', 'label' => 'Email', 'type' => 'email', 'required' => true, 'autocomplete' => 'email' ),
			array( 'name' => 'country', 'label' => 'Country / region', 'type' => 'text', 'required' => true, 'autocomplete' => 'country-name' ),
			array( 'name' => 'product_interest', 'label' => 'Product interest', 'type' => 'select', 'required' => true, 'options' => array( 'Black masterbatch', 'White masterbatch', 'Color masterbatch', 'Not sure' ) ),
			array( 'name' => 'application', 'label' => 'Application (how it will be used)', 'type' => 'text', 'required' => true, 'full' => true ),
			array( 'name' => 'base_resin', 'label' => 'Base resin', 'type' => 'select', 'options' => array( 'Not sure', 'PE', 'PP', 'LDPE', 'LLDPE', 'HDPE', 'ABS', 'PET', 'PVC', 'Other' ) ),
			array( 'name' => 'processing_method', 'label' => 'Processing method', 'type' => 'select', 'options' => array( 'Not sure', 'Film blowing', 'Injection molding', 'Extrusion', 'Re-granulating', 'Other' ) ),
			array( 'name' => 'target_color_function', 'label' => 'Target color or function', 'type' => 'text' ),
			array( 'name' => 'color_reference_type', 'label' => 'Color reference type', 'type' => 'select', 'options' => array( 'Not sure', 'Physical sample', 'Pantone', 'RAL', 'Photo', 'Existing product', 'Previous grade', 'Customer standard' ) ),
			array( 'name' => 'product_grade', 'label' => 'Product grade or model (if known)', 'type' => 'text' ),
			array( 'name' => 'quantity', 'label' => 'Quantity (trial and estimated monthly)', 'type' => 'text' ),
			array( 'name' => 'destination_port', 'label' => 'Destination port (optional)', 'type' => 'text' ),
			array( 'name' => 'documents_requested', 'label' => $is_document_request ? 'Documents requested' : 'Documents requested (optional)', 'type' => 'select', 'required' => $is_document_request, 'options' => array( 'Not sure', 'TDS', 'SDS / MSDS', 'COA', 'RoHS-related documents', 'FDA-related documents', 'Food-contact-related documents', 'Other' ) ),
			array( 'name' => 'document_purpose', 'label' => $is_document_request ? 'Document purpose' : 'Document purpose (optional)', 'type' => 'select', 'required' => $is_document_request, 'options' => array( 'Not sure', 'Internal evaluation', 'Customer approval', 'Import clearance', 'Compliance review', 'Sample testing', 'Other' ) ),
			array( 'name' => 'message', 'label' => 'Message / details', 'type' => 'textarea', 'full' => true ),
		);

		$render_field = static function ( $field ) use ( $product_interest ) {
			$name        = $field['name'];
			$id          = 'mb-rfq-' . $name;
			$full        = ! empty( $field['full'] ) ? ' mtm-rfq-form__field--full' : '';
			$star        = ! empty( $field['required'] ) ? ' <span class="mtm-rfq-form__req" aria-hidden="true">*</span>' : '';
			$req         = ! empty( $field['required'] ) ? ' required' : '';
			$rows        = isset( $field['rows'] ) ? (int) $field['rows'] : 5;
			$placeholder = isset( $field['placeholder'] )
				? ' placeholder="' . esc_attr( $field['placeholder'] ) . '"'
				: '';

			$field_html  = '<div class="mtm-rfq-form__field' . $full . '">';
			$field_html .= '<label for="' . esc_attr( $id ) . '">' . esc_html( $field['label'] ) . $star . '</label>';

			if ( 'select' === $field['type'] ) {
				$field_html .= '<select id="' . esc_attr( $id ) . '" name="' . esc_attr( $name ) . '"' . $req . '>';
				$field_html .= '<option value="">Please choose</option>';
				foreach ( $field['options'] as $option ) {
					$selected    = 'product_interest' === $name && $product_interest === $option
						? ' selected'
						: '';
					$field_html .= '<option value="' . esc_attr( $option ) . '"' . $selected . '>' . esc_html( $option ) . '</option>';
				}
				$field_html .= '</select>';
			} elseif ( 'textarea' === $field['type'] ) {
				$field_html .= '<textarea id="' . esc_attr( $id ) . '" name="' . esc_attr( $name ) . '" rows="' . esc_attr( $rows ) . '"' . $placeholder . $req . '></textarea>';
			} else {
				$type        = 'email' === $field['type'] ? 'email' : 'text';
				$ac          = ! empty( $field['autocomplete'] ) ? ' autocomplete="' . esc_attr( $field['autocomplete'] ) . '"' : '';
				$field_html .= '<input type="' . esc_attr( $type ) . '" id="' . esc_attr( $id ) . '" name="' . esc_attr( $name ) . '"' . $ac . $placeholder . $req . ' />';
			}

			return $field_html . '</div>';
		};

		$contact_groups = array(
			array(
				'number' => '01',
				'label'  => 'Contact',
				'fields' => array(
					array( 'name' => 'full_name', 'label' => 'Full name', 'type' => 'text', 'required' => true, 'autocomplete' => 'name' ),
					array( 'name' => 'company', 'label' => 'Company', 'type' => 'text', 'required' => true, 'autocomplete' => 'organization' ),
					array( 'name' => 'email', 'label' => 'Email', 'type' => 'email', 'required' => true, 'autocomplete' => 'email' ),
					array( 'name' => 'country', 'label' => 'Country or region', 'type' => 'text', 'required' => true, 'autocomplete' => 'country-name' ),
				),
			),
			array(
				'number' => '02',
				'label'  => 'Material and application',
				'fields' => array(
					array( 'name' => 'product_interest', 'label' => 'Product interest', 'type' => 'select', 'required' => true, 'options' => array( 'Black masterbatch', 'White masterbatch', 'Color masterbatch', 'Not sure' ) ),
					array( 'name' => 'base_resin', 'label' => 'Base resin', 'type' => 'select', 'options' => array( 'Not sure', 'PE', 'PP', 'LDPE', 'LLDPE', 'HDPE', 'ABS', 'PET', 'PVC', 'Other' ) ),
					array( 'name' => 'application', 'label' => 'Application or end product', 'type' => 'text', 'required' => true, 'full' => true, 'placeholder' => 'For example, blown film, injection-molded part or extruded profile' ),
					array( 'name' => 'processing_method', 'label' => 'Processing method', 'type' => 'select', 'options' => array( 'Not sure', 'Film blowing', 'Injection molding', 'Extrusion', 'Re-granulating', 'Other' ) ),
					array( 'name' => 'target_color_function', 'label' => 'Target or current issue', 'type' => 'textarea', 'required' => true, 'full' => true, 'rows' => 4, 'placeholder' => 'For example: deeper blackness, higher opacity, better dispersion, a color reference or a current production problem.' ),
				),
			),
		);

		$optional_fields = array(
			array( 'name' => 'product_grade', 'label' => 'Current grade or model', 'type' => 'text' ),
			array( 'name' => 'quantity', 'label' => 'Quantity', 'type' => 'text', 'placeholder' => 'Trial and estimated monthly quantity' ),
			array( 'name' => 'destination_port', 'label' => 'Destination port', 'type' => 'text' ),
			array( 'name' => 'color_reference_type', 'label' => 'Color reference type', 'type' => 'select', 'options' => array( 'Not sure', 'Physical sample', 'Pantone', 'RAL', 'Photo', 'Existing product', 'Previous grade', 'Customer standard' ) ),
		);

		$notices = '';
		if ( 'success' === $status ) {
			$notices .= '<div class="mtm-rfq-form__notice mtm-rfq-form__notice--success" role="status">'
				. '<p>Your request has been received. Our team will review the product grade, application and document scope, then reply by email.</p>'
				. '</div>';
		} elseif ( 'error' === $status ) {
			$notices .= '<div class="mtm-rfq-form__notice mtm-rfq-form__notice--error" role="alert">'
				. '<p>We could not submit your request. Check the required fields and try again.</p>'
				. '</div>';
		}

		$html = '';
		if ( ! $is_document_request ) {
			$html .= '<div class="contact-form" id="request-form">';
			$html .= '<div class="contact-form__head">'
				. '<div><p class="contact-kicker">Your inquiry</p><h2>Your application.</h2></div>'
				. '<p>Required fields are marked with an asterisk. A known product grade is helpful, but not required.</p>'
				. '</div>';
			$html .= $notices;
		} else {
			$html .= $notices;
		}

		$form_class  = 'mtm-rfq-form' . ( $is_document_request ? '' : ' mtm-rfq-form--contact' );
		$html       .= '<form class="' . esc_attr( $form_class ) . '" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '" method="post">';
		$html .= '<input type="hidden" name="action" value="mb_submit_rfq" />';
		$html .= '<input type="hidden" name="form_context" value="' . esc_attr( $context ) . '" />';
		$html .= '<input type="hidden" name="source_page" value="' . esc_url( $source_page ) . '" />';
		$html .= '<input type="hidden" name="ga_client_id" value="" />';
		$html .= wp_nonce_field( 'mb_submit_rfq', 'mb_rfq_nonce', true, false );
		$html .= '<div class="mtm-rfq-form__honeypot" aria-hidden="true">'
			. '<label for="mb-rfq-website-url">Leave this field empty</label>'
			. '<input type="text" id="mb-rfq-website-url" name="website_url" value="" tabindex="-1" autocomplete="off" />'
			. '</div>';

		if ( $is_document_request ) {
			$html .= '<div class="mtm-rfq-form__grid">';
			foreach ( $document_fields as $field ) {
				$html .= $render_field( $field );
			}
			$html .= '</div>';
			$html .= '<div class="mtm-rfq-form__field mtm-rfq-form__field--full mtm-rfq-form__consent">'
				. '<label><input type="checkbox" name="privacy_consent" value="1" required /> '
				. 'I have read the <a href="/privacy-policy/">Privacy Policy</a>.</label>'
				. '</div>';
			$html .= '<p class="mtm-rfq-form__note">Fields marked <span aria-hidden="true">*</span> are required for document review. Document availability depends on the exact grade, application, country and intended use.</p>';
			$html .= '<div class="mtm-rfq-form__actions"><button type="submit" class="mtm-rfq-form__submit">Send inquiry</button></div>';
		} else {
			foreach ( $contact_groups as $group ) {
				$html .= '<fieldset class="contact-fieldset">';
				$html .= '<legend><span>' . esc_html( $group['number'] ) . '</span>' . esc_html( $group['label'] ) . '</legend>';
				$html .= '<div class="contact-form__grid">';
				foreach ( $group['fields'] as $field ) {
					$html .= $render_field( $field );
				}
				$html .= '</div></fieldset>';
			}

			$html .= '<details class="contact-advanced">'
				. '<summary>Add technical details <span>Optional</span></summary>'
				. '<div class="contact-form__grid">';
			foreach ( $optional_fields as $field ) {
				$html .= $render_field( $field );
			}
			$html .= '</div></details>';
			$html .= '<p class="contact-document-link">Need TDS, SDS/MSDS or COA? <a href="/technical-documents/">Request technical documents separately</a>.</p>';
			$html .= '<label class="contact-consent"><input type="checkbox" name="privacy_consent" value="1" required /> '
				. 'I have read the <a href="/privacy-policy/">Privacy Policy</a>.</label>';
			$html .= '<div class="contact-form__actions"><p>We review the application, grade and document scope, then reply by email with the next useful step.</p>'
				. '<button type="submit" class="mtm-rfq-form__submit">Submit inquiry</button></div>';
		}
		$html .= '</form>';
		if ( ! $is_document_request ) {
			$html .= '</div>';
		}

		return $html;
	}
);
