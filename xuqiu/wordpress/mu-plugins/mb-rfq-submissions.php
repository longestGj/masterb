<?php
/**
 * Plugin Name: Masterbatch RFQ Submissions
 * Description: Stores and emails masterbatch RFQ submissions from the website form.
 * Version: 0.2.0
 * Author: GE CHEMICAL website project
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Handles validated RFQ submissions.
 */
final class MB_RFQ_Submission {

	/**
	 * Private inquiry post type.
	 */
	const POST_TYPE = 'mb_inquiry';

	/**
	 * Register the private inquiry record type.
	 *
	 * @return void
	 */
	public static function register_post_type() {
		register_post_type(
			self::POST_TYPE,
			array(
				'labels' => array(
					'name'          => 'Masterbatch Inquiries',
					'singular_name' => 'Masterbatch Inquiry',
					'menu_name'     => 'Inquiries',
				),
				'public'              => false,
				'publicly_queryable'  => false,
				'exclude_from_search' => true,
				'show_ui'             => true,
				'show_in_menu'        => true,
				'show_in_rest'        => false,
				'menu_icon'           => 'dashicons-email-alt',
				'supports'            => array( 'title' ),
				'capability_type'     => 'post',
				'map_meta_cap'        => true,
				'capabilities'        => array(
					'create_posts' => 'do_not_allow',
				),
			)
		);
	}

	/**
	 * Process a submitted form payload.
	 *
	 * @param array<string,mixed> $input Raw input.
	 * @return array{status:string,id?:int,email_sent?:bool,product_interest?:string,form_context?:string,source_page?:string}
	 */
	public static function process( $input ) {
		$data = self::sanitize( $input );

		foreach ( array( 'full_name', 'company', 'email', 'country', 'product_interest', 'application' ) as $field ) {
			if ( '' === $data[ $field ] ) {
				return self::failure_result( $data );
			}
		}

		if ( ! is_email( $data['email'] ) ) {
			return self::failure_result( $data );
		}

		$allowed_products = array(
			'Black masterbatch',
			'White masterbatch',
			'Color masterbatch',
			'Not sure',
		);
		if ( ! in_array( $data['product_interest'], $allowed_products, true ) ) {
			return self::failure_result( $data );
		}

		if ( '1' !== $data['privacy_consent'] ) {
			return self::failure_result( $data );
		}

		if (
			'rfq' === $data['form_context']
			&& '' === $data['target_color_function']
		) {
			return self::failure_result( $data );
		}

		if (
			'documents' === $data['form_context']
			&& ( '' === $data['documents_requested'] || '' === $data['document_purpose'] )
		) {
			return self::failure_result( $data );
		}

		$rate_key = 'mb_rfq_rate_' . md5(
			strtolower( $data['email'] ) . '|' . ( $_SERVER['REMOTE_ADDR'] ?? '' )
		);
		if ( get_transient( $rate_key ) ) {
			return self::failure_result( $data );
		}

		$post_id = wp_insert_post(
			array(
				'post_type'      => self::POST_TYPE,
				'post_status'    => 'private',
				'post_title'     => sprintf(
					'RFQ - %s - %s',
					$data['company'],
					current_time( 'Y-m-d H:i' )
				),
				'comment_status' => 'closed',
				'ping_status'    => 'closed',
				'meta_input'     => array(
					'_mb_rfq_full_name'          => $data['full_name'],
					'_mb_rfq_company'            => $data['company'],
					'_mb_rfq_email'              => $data['email'],
					'_mb_rfq_country'            => $data['country'],
					'_mb_rfq_product_interest'   => $data['product_interest'],
					'_mb_rfq_application'        => $data['application'],
					'_mb_rfq_base_resin'         => $data['base_resin'],
					'_mb_rfq_processing_method'  => $data['processing_method'],
					'_mb_rfq_target'             => $data['target_color_function'],
					'_mb_rfq_color_reference'    => $data['color_reference_type'],
					'_mb_rfq_product_grade'      => $data['product_grade'],
					'_mb_rfq_quantity'           => $data['quantity'],
					'_mb_rfq_destination_port'   => $data['destination_port'],
					'_mb_rfq_documents_requested' => $data['documents_requested'],
					'_mb_rfq_document_purpose'   => $data['document_purpose'],
					'_mb_rfq_message'            => $data['message'],
					'_mb_rfq_form_context'       => $data['form_context'],
					'_mb_rfq_source_page'        => $data['source_page'],
					'_mb_rfq_submitted_at'       => current_time( 'mysql' ),
				),
			),
			true
		);

		if ( is_wp_error( $post_id ) ) {
			return self::failure_result( $data );
		}

		$recipient = getenv( 'MASTERBATCH_RFQ_RECIPIENT' );
		if ( ! $recipient ) {
			$recipient = get_option( 'admin_email' );
		}

		$email_sent = false;
		if ( is_email( $recipient ) ) {
			$subject = sprintf(
				'New masterbatch RFQ - %s - %s',
				$data['company'],
				$data['product_interest']
			);
			$body    = self::format_email( $data );
			$headers = array( 'Reply-To: ' . $data['full_name'] . ' <' . $data['email'] . '>' );
			$email_sent = wp_mail( $recipient, $subject, $body, $headers );
		}

		update_post_meta( $post_id, '_mb_rfq_email_sent', $email_sent ? '1' : '0' );
		set_transient( $rate_key, 1, 30 );

		if ( ! $email_sent ) {
			error_log( 'Masterbatch RFQ stored but email delivery failed for inquiry #' . $post_id );
			self::send_ga4_email_failure_event( $data, (int) $post_id );
		}

		return array(
			'status'     => 'success',
			'id'         => (int) $post_id,
			'email_sent' => $email_sent,
			'product_interest' => $data['product_interest'],
			'form_context'     => $data['form_context'],
			'source_page'      => $data['source_page'],
		);
	}

	/**
	 * Sanitize all supported fields.
	 *
	 * @param array<string,mixed> $input Raw input.
	 * @return array<string,string>
	 */
	private static function sanitize( $input ) {
		$output = array();
		$text_fields = array(
			'full_name',
			'company',
			'country',
			'application',
			'base_resin',
			'processing_method',
			'target_color_function',
			'color_reference_type',
			'product_grade',
			'quantity',
			'destination_port',
			'documents_requested',
			'document_purpose',
			'ga_client_id',
			'form_context',
			'source_page',
		);

		foreach ( $text_fields as $field ) {
			$output[ $field ] = sanitize_text_field(
				wp_unslash( (string) ( $input[ $field ] ?? '' ) )
			);
		}

		$output['email']            = sanitize_email( wp_unslash( (string) ( $input['email'] ?? '' ) ) );
		$output['product_interest'] = sanitize_text_field(
			wp_unslash( (string) ( $input['product_interest'] ?? '' ) )
		);
		$output['message']          = sanitize_textarea_field(
			wp_unslash( (string) ( $input['message'] ?? '' ) )
		);
		$output['privacy_consent']  = isset( $input['privacy_consent'] )
			? sanitize_text_field( wp_unslash( (string) $input['privacy_consent'] ) )
			: '';

		return $output;
	}

	/**
	 * Return safe analytics context for a rejected submission.
	 *
	 * @param array<string,string> $data Sanitized form data.
	 * @return array{status:string,product_interest:string,form_context:string,source_page:string}
	 */
	private static function failure_result( $data ) {
		return array(
			'status'           => 'error',
			'product_interest' => $data['product_interest'],
			'form_context'     => $data['form_context'],
			'source_page'      => $data['source_page'],
		);
	}

	/**
	 * Best-effort GA4 Measurement Protocol event for failed email delivery.
	 *
	 * The API secret is read from the environment and is never stored in the
	 * database or repository.
	 *
	 * @param array<string,string> $data    Sanitized form data.
	 * @param int                  $post_id Stored inquiry ID.
	 * @return void
	 */
	private static function send_ga4_email_failure_event( $data, $post_id ) {
		$measurement_id = getenv( 'MASTERBATCH_GA4_MEASUREMENT_ID' );
		if ( ! $measurement_id ) {
			$measurement_id = get_option( 'mb_ga4_measurement_id', '' );
		}
		$measurement_id = strtoupper( trim( (string) $measurement_id ) );
		$api_secret     = trim( (string) getenv( 'MASTERBATCH_GA4_API_SECRET' ) );
		if (
			! preg_match( '/^G-[A-Z0-9]{4,}$/', $measurement_id )
			|| '' === $api_secret
		) {
			return;
		}

		$client_id = trim( (string) $data['ga_client_id'] );
		if ( '' === $client_id ) {
			$client_id = 'server-' . substr( hash( 'sha256', $data['email'] ), 0, 24 );
		}

		$event_name = 'documents' === $data['form_context']
			? 'documents_email_delivery_failed'
			: 'rfq_email_delivery_failed';
		$endpoint   = add_query_arg(
			array(
				'measurement_id' => $measurement_id,
				'api_secret'     => $api_secret,
			),
			'https://www.google-analytics.com/mp/collect'
		);

		wp_remote_post(
			$endpoint,
			array(
				'timeout'  => 2,
				'blocking' => false,
				'headers'  => array( 'Content-Type' => 'application/json' ),
				'body'     => wp_json_encode(
					array(
						'client_id' => $client_id,
						'events'    => array(
							array(
								'name'   => $event_name,
								'params' => array(
									'form_context'     => $data['form_context'],
									'product_interest' => $data['product_interest'],
									'source_page'      => $data['source_page'],
									'inquiry_id'       => $post_id,
								),
							),
						),
					)
				),
			)
		);
	}

	/**
	 * Format the internal notification.
	 *
	 * @param array<string,string> $data Sanitized form data.
	 * @return string
	 */
	private static function format_email( $data ) {
		$labels = array(
			'Full name'             => 'full_name',
			'Company'               => 'company',
			'Email'                 => 'email',
			'Country / region'      => 'country',
			'Product interest'      => 'product_interest',
			'Application'           => 'application',
			'Base resin'            => 'base_resin',
			'Processing method'     => 'processing_method',
			'Target or current issue' => 'target_color_function',
			'Color reference type'  => 'color_reference_type',
			'Product grade/model'   => 'product_grade',
			'Quantity'              => 'quantity',
			'Destination port'      => 'destination_port',
			'Documents requested'   => 'documents_requested',
			'Document purpose'      => 'document_purpose',
			'Message'               => 'message',
			'Form context'          => 'form_context',
			'Source page'           => 'source_page',
		);

		$lines = array( 'A new masterbatch inquiry was submitted.', '' );
		foreach ( $labels as $label => $key ) {
			$value = trim( $data[ $key ] ?? '' );
			if ( '' !== $value ) {
				$lines[] = $label . ': ' . $value;
			}
		}

		$lines[] = '';
		$lines[] = 'Review this inquiry in WordPress under Inquiries.';

		return implode( "\n", $lines );
	}

	/**
	 * Handle the form POST and redirect back to the originating page.
	 *
	 * @return void
	 */
	public static function handle() {
		$nonce = isset( $_POST['mb_rfq_nonce'] )
			? sanitize_text_field( wp_unslash( $_POST['mb_rfq_nonce'] ) )
			: '';

		if ( ! wp_verify_nonce( $nonce, 'mb_submit_rfq' ) ) {
			self::redirect( 'error' );
		}

		if ( ! empty( $_POST['website_url'] ) ) {
			self::redirect( 'success' );
		}

		$result = self::process( $_POST );
		self::redirect( $result['status'], $result );
	}

	/**
	 * Redirect to the form with a bounded status value.
	 *
	 * @param string              $status  Submission status.
	 * @param array<string,mixed> $context Safe analytics context.
	 * @return void
	 */
	private static function redirect( $status, $context = array() ) {
		$fallback = home_url( '/request-a-quote/' );
		$referer  = wp_get_referer();
		$target   = wp_validate_redirect( $referer, $fallback );
		$target   = remove_query_arg( array( 'rfq_status' ), $target );
		$target   = add_query_arg(
			'rfq_status',
			'success' === $status ? 'success' : 'error',
			$target
		);
		$source_page = wp_parse_url( (string) ( $context['source_page'] ?? '' ) );
		$analytics_args = array_filter(
			array(
				'rfq_context' => sanitize_key( (string) ( $context['form_context'] ?? '' ) ),
				'rfq_product' => sanitize_text_field( (string) ( $context['product_interest'] ?? '' ) ),
				'rfq_source'  => isset( $source_page['path'] )
					? sanitize_text_field( $source_page['path'] )
					: '',
			)
		);
		if ( $analytics_args ) {
			$target = add_query_arg( $analytics_args, $target );
		}

		wp_safe_redirect( $target . '#request-form' );
		exit;
	}
}

add_action( 'init', array( 'MB_RFQ_Submission', 'register_post_type' ) );
add_action( 'admin_post_mb_submit_rfq', array( 'MB_RFQ_Submission', 'handle' ) );
add_action( 'admin_post_nopriv_mb_submit_rfq', array( 'MB_RFQ_Submission', 'handle' ) );

add_filter(
	'manage_mb_inquiry_posts_columns',
	static function ( $columns ) {
		return array(
			'cb'                        => $columns['cb'],
			'title'                     => 'Inquiry',
			'_mb_rfq_company'           => 'Company',
			'_mb_rfq_product_interest'  => 'Product',
			'_mb_rfq_country'           => 'Country',
			'_mb_rfq_email_sent'        => 'Email',
			'date'                      => 'Submitted',
		);
	}
);

add_action(
	'manage_mb_inquiry_posts_custom_column',
	static function ( $column, $post_id ) {
		$key_map = array(
			'_mb_rfq_company'          => '_mb_rfq_company',
			'_mb_rfq_product_interest' => '_mb_rfq_product_interest',
			'_mb_rfq_country'          => '_mb_rfq_country',
		);
		if ( isset( $key_map[ $column ] ) ) {
			echo esc_html( (string) get_post_meta( $post_id, $key_map[ $column ], true ) );
		} elseif ( '_mb_rfq_email_sent' === $column ) {
			echo '1' === get_post_meta( $post_id, '_mb_rfq_email_sent', true )
				? 'Sent'
				: 'Stored only';
		}
	},
	10,
	2
);

add_action(
	'add_meta_boxes_mb_inquiry',
	static function () {
		add_meta_box(
			'mb-rfq-details',
			'RFQ details',
			static function ( $post ) {
				$fields = array(
					'Full name'             => '_mb_rfq_full_name',
					'Company'               => '_mb_rfq_company',
					'Email'                 => '_mb_rfq_email',
					'Country / region'      => '_mb_rfq_country',
					'Product interest'      => '_mb_rfq_product_interest',
					'Application'           => '_mb_rfq_application',
					'Base resin'            => '_mb_rfq_base_resin',
					'Processing method'     => '_mb_rfq_processing_method',
					'Target color/function' => '_mb_rfq_target',
					'Color reference type'  => '_mb_rfq_color_reference',
					'Product grade/model'   => '_mb_rfq_product_grade',
					'Quantity'              => '_mb_rfq_quantity',
					'Destination port'      => '_mb_rfq_destination_port',
					'Documents requested'   => '_mb_rfq_documents_requested',
					'Document purpose'      => '_mb_rfq_document_purpose',
					'Message'               => '_mb_rfq_message',
					'Form context'          => '_mb_rfq_form_context',
					'Source page'           => '_mb_rfq_source_page',
					'Submitted at'          => '_mb_rfq_submitted_at',
					'Email sent'            => '_mb_rfq_email_sent',
				);

				echo '<table class="widefat striped">';
				foreach ( $fields as $label => $key ) {
					$value = (string) get_post_meta( $post->ID, $key, true );
					echo '<tr><th style="width:180px">' . esc_html( $label ) . '</th><td>';
					echo nl2br( esc_html( $value ) );
					echo '</td></tr>';
				}
				echo '</table>';
			},
			self::POST_TYPE,
			'normal',
			'high'
		);
	}
);
