<?php
/**
 * Smoke test the RFQ processor without sending a real email.
 *
 * Run from the WordPress environment:
 * wp eval-file /import/rfq-runtime-smoke.php
 */

if ( ! class_exists( 'MB_RFQ_Submission' ) ) {
	WP_CLI::error( 'MB_RFQ_Submission is not loaded.' );
}

if ( ! post_type_exists( 'mb_inquiry' ) ) {
	WP_CLI::error( 'The mb_inquiry post type is not registered.' );
}

add_filter( 'pre_wp_mail', '__return_true' );

$result = MB_RFQ_Submission::process(
	array(
		'full_name'             => 'Integration Test',
		'company'               => 'Test Company',
		'email'                 => 'rfq-smoke@example.com',
		'country'               => 'Test Country',
		'product_interest'      => 'Black masterbatch',
		'application'           => 'Integration test only',
		'base_resin'            => 'PE',
		'processing_method'     => 'Film blowing',
		'target_color_function' => 'Test target',
		'color_reference_type'  => 'Not sure',
		'product_grade'         => '',
		'quantity'              => '1 test',
		'destination_port'      => '',
		'documents_requested'   => 'TDS',
		'document_purpose'      => 'Internal evaluation',
		'message'               => 'Automated integration test.',
		'privacy_consent'       => '1',
		'form_context'          => 'rfq',
		'source_page'           => home_url( '/request-a-quote/' ),
	)
);

if ( 'success' !== ( $result['status'] ?? '' ) ) {
	WP_CLI::error( 'The RFQ processor did not return success.' );
}
if (
	'Black masterbatch' !== ( $result['product_interest'] ?? '' )
	|| 'rfq' !== ( $result['form_context'] ?? '' )
) {
	WP_CLI::error( 'The RFQ analytics context was not returned.' );
}

$post_id = (int) $result['id'];
$post    = get_post( $post_id );
$checks  = array(
	'private_record' => $post && 'mb_inquiry' === $post->post_type && 'private' === $post->post_status,
	'email_sent'     => '1' === get_post_meta( $post_id, '_mb_rfq_email_sent', true ),
	'company_saved'  => 'Test Company' === get_post_meta( $post_id, '_mb_rfq_company', true ),
	'product_saved'  => 'Black masterbatch' === get_post_meta( $post_id, '_mb_rfq_product_interest', true ),
);

foreach ( $checks as $check => $passed ) {
	if ( ! $passed ) {
		wp_delete_post( $post_id, true );
		WP_CLI::error( 'RFQ runtime check failed: ' . $check );
	}
}

wp_delete_post( $post_id, true );

$invalid_rfq = MB_RFQ_Submission::process(
	array(
		'full_name'        => 'RFQ Validation Test',
		'company'          => 'Test Company',
		'email'            => 'rfq-missing-target@example.com',
		'country'          => 'Test Country',
		'product_interest' => 'Black masterbatch',
		'application'      => 'Integration test only',
		'privacy_consent'  => '1',
		'form_context'     => 'rfq',
		'source_page'      => home_url( '/request-a-quote/' ),
	)
);

if ( 'error' !== ( $invalid_rfq['status'] ?? '' ) ) {
	WP_CLI::error( 'RFQs without a target or current issue must be rejected.' );
}

$invalid_document_request = MB_RFQ_Submission::process(
	array(
		'full_name'             => 'Document Validation Test',
		'company'               => 'Test Company',
		'email'                 => 'rfq-document-invalid@example.com',
		'country'               => 'Test Country',
		'product_interest'      => 'White masterbatch',
		'application'           => 'Integration test only',
		'privacy_consent'       => '1',
		'form_context'          => 'documents',
		'documents_requested'   => '',
		'document_purpose'      => '',
		'source_page'           => home_url( '/technical-documents/' ),
	)
);

if ( 'error' !== ( $invalid_document_request['status'] ?? '' ) ) {
	WP_CLI::error( 'Document requests without a type and purpose must be rejected.' );
}

$document_result = MB_RFQ_Submission::process(
	array(
		'full_name'             => 'Document Integration Test',
		'company'               => 'Test Company',
		'email'                 => 'rfq-document-valid@example.com',
		'country'               => 'Test Country',
		'product_interest'      => 'White masterbatch',
		'application'           => 'Document review integration test',
		'privacy_consent'       => '1',
		'form_context'          => 'documents',
		'documents_requested'   => 'SDS / MSDS',
		'document_purpose'      => 'Customer approval',
		'source_page'           => home_url( '/technical-documents/' ),
	)
);

if ( 'success' !== ( $document_result['status'] ?? '' ) ) {
	WP_CLI::error( 'The valid document request was not accepted.' );
}
if (
	'White masterbatch' !== ( $document_result['product_interest'] ?? '' )
	|| 'documents' !== ( $document_result['form_context'] ?? '' )
) {
	WP_CLI::error( 'The document analytics context was not returned.' );
}

$document_post_id = (int) $document_result['id'];
if ( 'Customer approval' !== get_post_meta( $document_post_id, '_mb_rfq_document_purpose', true ) ) {
	wp_delete_post( $document_post_id, true );
	WP_CLI::error( 'The document purpose was not stored.' );
}
wp_delete_post( $document_post_id, true );

remove_filter( 'pre_wp_mail', '__return_true' );
add_filter( 'pre_wp_mail', '__return_false' );
putenv( 'MASTERBATCH_GA4_MEASUREMENT_ID=G-TEST1234' );
putenv( 'MASTERBATCH_GA4_API_SECRET=test-secret' );

$ga_request = null;
$capture_ga = static function ( $pre, $args, $url ) use ( &$ga_request ) {
	if ( false === strpos( $url, 'google-analytics.com/mp/collect' ) ) {
		return $pre;
	}

	$ga_request = array(
		'url'  => $url,
		'body' => json_decode( $args['body'] ?? '', true ),
	);

	return array(
		'headers'  => array(),
		'body'     => '',
		'response' => array(
			'code'    => 204,
			'message' => 'No Content',
		),
		'cookies'  => array(),
		'filename' => null,
	);
};
add_filter( 'pre_http_request', $capture_ga, 10, 3 );

$ga_result = MB_RFQ_Submission::process(
	array(
		'full_name'             => 'GA4 Email Failure Test',
		'company'               => 'Test Company',
		'email'                 => 'rfq-ga4-failure@example.com',
		'country'               => 'Test Country',
		'product_interest'      => 'Color masterbatch',
		'application'           => 'Email failure integration test',
		'target_color_function' => 'Test target',
		'privacy_consent'       => '1',
		'form_context'          => 'rfq',
		'ga_client_id'          => 'ga4-test-client.123',
		'source_page'           => home_url( '/request-a-quote/' ),
	)
);

if ( 'success' !== ( $ga_result['status'] ?? '' ) || true === ( $ga_result['email_sent'] ?? null ) ) {
	wp_delete_post( (int) ( $ga_result['id'] ?? 0 ), true );
	WP_CLI::error( 'The email failure test did not produce the expected stored-only result.' );
}

$ga_event = $ga_request['body']['events'][0] ?? array();
if (
	'rfq_email_delivery_failed' !== ( $ga_event['name'] ?? '' )
	|| 'Color masterbatch' !== ( $ga_event['params']['product_interest'] ?? '' )
) {
	wp_delete_post( (int) $ga_result['id'], true );
	WP_CLI::error( 'The GA4 email delivery failure event was not generated correctly.' );
}

remove_filter( 'pre_http_request', $capture_ga, 10 );
wp_delete_post( (int) $ga_result['id'], true );
putenv( 'MASTERBATCH_GA4_MEASUREMENT_ID' );
putenv( 'MASTERBATCH_GA4_API_SECRET' );

WP_CLI::success(
	wp_json_encode(
		array(
			'processed'                => true,
			'private_record'           => true,
			'email_intercept'          => true,
			'document_validation'      => true,
			'rfq_validation'           => true,
			'document_purpose_saved'   => true,
			'ga_email_failure_event'   => true,
			'test_records_gone'        => null === get_post( $post_id )
				&& null === get_post( $document_post_id )
				&& null === get_post( (int) $ga_result['id'] ),
		)
	)
);
