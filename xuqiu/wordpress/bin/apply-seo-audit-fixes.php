<?php
/**
 * Reapply the current public SEO metadata after a release.
 *
 * Run with:
 * wp eval-file apply-seo-audit-fixes.php
 */

if ( ! defined( 'ABSPATH' ) || ! class_exists( 'WP_CLI' ) ) {
	throw new RuntimeException( 'This migration must run through WP-CLI.' );
}

$seo = array(
	58  => array(
		'title'       => 'Masterbatch Buyer FAQ | Quotes, Samples & Documents',
		'description' => 'Answers to common masterbatch buyer questions on product range, RFQ preparation, samples, technical document review and application fit.',
	),
	66  => array(
		'title'       => 'About GE Chemical | Masterbatch Quality & Review',
		'description' => 'How GE CHEMICAL reviews black and desiccant masterbatch inquiries by exact grade and application. Documents are handled by request and review.',
	),
	80  => array(
		'title'       => 'Masterbatch Buyer Resources | GE CHEMICAL',
		'description' => 'Compare masterbatch product routes, read film and troubleshooting guides, prepare an RFQ and understand technical document review.',
	),
	81  => array(
		'title'       => 'Masterbatch RFQ Checklist | Inputs & Documents',
		'description' => 'Use this masterbatch RFQ checklist to collect resin, process, application, target, quantity, destination and document review details.',
	),
	132 => array(
		'title'       => 'Masterbatch Guides and Buyer Articles | GE CHEMICAL',
		'description' => 'Read masterbatch selection, troubleshooting and supplier review guides for plastic processing buyers, with practical checks for resin, film and documents.',
	),
	142 => array(
		'title'       => 'Black Masterbatch BK020 | 20% Carbon Black Grade',
		'description' => 'BK020 is a 20% carbon black masterbatch with a PE carrier and 47.8% CaCO3 filler for trash bags, injection molding and re-granulating.',
	),
	147 => array(
		'title'       => 'Carbon Black Content in Black Masterbatch | GE CHEMICAL',
		'description' => 'Compare 20%, 30%, 35% and 40% carbon black masterbatch grades by resin, filler, dispersion, use rate, trial results and cost per tonne.',
	),
	153 => array(
		'title'       => 'Black Masterbatch PT-300 | 25% Carbon Black, Filled',
		'description' => 'PT-300 is a 25% virgin carbon black masterbatch with a PE carrier and 41.8% CaCO3 filler for film blowing, injection molding and re-granulating.',
	),
	162 => array(
		'title'       => 'Desiccant Masterbatch DM2476G | 75.9% CaO Grade',
		'description' => 'DM2476G is a 75.9% grey CaO drying masterbatch in a 24% recycled PE carrier for moisture-exposed injection, extrusion and film blowing.',
	),
);

foreach ( $seo as $post_id => $values ) {
	if ( ! get_post( $post_id ) ) {
		WP_CLI::error( 'SEO target post was not found: ' . $post_id );
	}

	update_post_meta( $post_id, '_mb_seo_title', $values['title'] );
	update_post_meta( $post_id, '_mb_seo_description', $values['description'] );
	update_post_meta( $post_id, 'rank_math_title', $values['title'] );
	update_post_meta( $post_id, 'rank_math_description', $values['description'] );
}

WP_CLI::success( 'Reapplied current SEO metadata.' );
