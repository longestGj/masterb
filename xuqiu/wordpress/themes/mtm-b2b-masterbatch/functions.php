<?php
/**
 * Child theme styles.
 */

defined( 'ABSPATH' ) || exit;

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
			'mtm-b2b-masterbatch',
			get_stylesheet_uri(),
			array( 'mtm-b2b-theme' ),
			$theme->get( 'Version' )
		);
		if ( is_front_page() ) {
			wp_enqueue_style(
				'mtm-b2b-material-field-manual',
				get_stylesheet_directory_uri() . '/assets/css/material-field-manual.css',
				array( 'mtm-b2b-masterbatch' ),
				$theme->get( 'Version' )
			);
		}
	},
	20
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
		$fields = array(
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

		$html = '';
		if ( 'success' === $status ) {
			$html .= '<div class="mtm-rfq-form__notice mtm-rfq-form__notice--success" role="status">'
				. '<p>Your request has been received. Our team will review the product grade, application and document scope, then reply by email.</p>'
				. '</div>';
		} elseif ( 'error' === $status ) {
			$html .= '<div class="mtm-rfq-form__notice mtm-rfq-form__notice--error" role="alert">'
				. '<p>We could not submit your request. Check the required fields and try again.</p>'
				. '</div>';
		}

		$html .= '<form class="mtm-rfq-form" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '" method="post">';
		$html .= '<input type="hidden" name="action" value="mb_submit_rfq" />';
		$html .= '<input type="hidden" name="form_context" value="' . esc_attr( $context ) . '" />';
		$html .= '<input type="hidden" name="source_page" value="' . esc_url( $source_page ) . '" />';
		$html .= '<input type="hidden" name="ga_client_id" value="" />';
		$html .= wp_nonce_field( 'mb_submit_rfq', 'mb_rfq_nonce', true, false );
		$html .= '<div class="mtm-rfq-form__honeypot" aria-hidden="true">'
			. '<label for="mb-rfq-website-url">Leave this field empty</label>'
			. '<input type="text" id="mb-rfq-website-url" name="website_url" value="" tabindex="-1" autocomplete="off" />'
			. '</div>';
		$html .= '<div class="mtm-rfq-form__grid">';

		foreach ( $fields as $field ) {
			$name = $field['name'];
			$id   = 'mb-rfq-' . $name;
			$full = ! empty( $field['full'] ) ? ' mtm-rfq-form__field--full' : '';
			$star = ! empty( $field['required'] ) ? ' <span class="mtm-rfq-form__req" aria-hidden="true">*</span>' : '';
			$req  = ! empty( $field['required'] ) ? ' required' : '';

			$html .= '<div class="mtm-rfq-form__field' . $full . '">';
			$html .= '<label for="' . esc_attr( $id ) . '">' . esc_html( $field['label'] ) . $star . '</label>';

			if ( 'select' === $field['type'] ) {
				$html .= '<select id="' . esc_attr( $id ) . '" name="' . esc_attr( $name ) . '"' . $req . '>';
				$html .= '<option value="">Please choose</option>';
				foreach ( $field['options'] as $option ) {
					$selected = 'product_interest' === $name && $product_interest === $option
						? ' selected'
						: '';
					$html .= '<option value="' . esc_attr( $option ) . '"' . $selected . '>' . esc_html( $option ) . '</option>';
				}
				$html .= '</select>';
			} elseif ( 'textarea' === $field['type'] ) {
				$html .= '<textarea id="' . esc_attr( $id ) . '" name="' . esc_attr( $name ) . '" rows="5"' . $req . '></textarea>';
			} else {
				$type = 'email' === $field['type'] ? 'email' : 'text';
				$ac   = ! empty( $field['autocomplete'] ) ? ' autocomplete="' . esc_attr( $field['autocomplete'] ) . '"' : '';
				$html .= '<input type="' . esc_attr( $type ) . '" id="' . esc_attr( $id ) . '" name="' . esc_attr( $name ) . '"' . $ac . $req . ' />';
			}

			$html .= '</div>';
		}

		$html .= '</div>';
		$html .= '<div class="mtm-rfq-form__field mtm-rfq-form__field--full mtm-rfq-form__consent">'
			. '<label><input type="checkbox" name="privacy_consent" value="1" required /> '
			. 'I have read the <a href="/privacy-policy/">Privacy Policy</a>.</label>'
			. '</div>';
		$html .= $is_document_request
			? '<p class="mtm-rfq-form__note">Fields marked <span aria-hidden="true">*</span> are required for document review. Document availability depends on the exact grade, application, country and intended use.</p>'
			: '<p class="mtm-rfq-form__note">Fields marked <span aria-hidden="true">*</span> are the core details the team needs to review and reply. Share your resin, processing method, end product and target requirement where you can.</p>';
		$html .= '<div class="mtm-rfq-form__actions"><button type="submit" class="mtm-rfq-form__submit">Send inquiry</button></div>';
		$html .= '</form>';

		return $html;
	}
);
