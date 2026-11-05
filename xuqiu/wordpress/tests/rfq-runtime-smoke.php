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
		'message'               => 'Automated integration test.',
		'privacy_consent'       => '1',
		'form_context'          => 'rfq',
		'source_page'           => home_url( '/request-a-quote/' ),
	)
);

if ( 'success' !== ( $result['status'] ?? '' ) ) {
	WP_CLI::error( 'The RFQ processor did not return success.' );
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

WP_CLI::success(
	wp_json_encode(
		array(
			'processed'       => true,
			'private_record'  => true,
			'email_intercept' => true,
			'test_record_gone' => null === get_post( $post_id ),
		)
	)
);
