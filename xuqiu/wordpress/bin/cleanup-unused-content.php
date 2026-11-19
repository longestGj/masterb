<?php
/**
 * Remove unused WordPress content rows after a verified database backup.
 *
 * Dry run:
 * MB_CLEANUP_APPLY=0 wp eval-file cleanup-unused-content.php
 *
 * Apply:
 * MB_CLEANUP_APPLY=1 wp eval-file cleanup-unused-content.php
 */

if ( ! defined( 'ABSPATH' ) || ! class_exists( 'WP_CLI' ) ) {
	throw new RuntimeException( 'This cleanup must run through WP-CLI.' );
}

$apply = '1' === getenv( 'MB_CLEANUP_APPLY' );

if ( ! $apply ) {
	WP_CLI::log( 'DRY RUN: set MB_CLEANUP_APPLY=1 to delete the listed records.' );
}

/**
 * Delete one content row, or report it during a dry run.
 *
 * @param int    $post_id Post ID.
 * @param string $reason  Why the row is unused.
 * @param bool   $apply   Whether to execute the deletion.
 * @return bool
 */
function mb_cleanup_delete_post( $post_id, $reason, $apply ) {
	$post = get_post( $post_id );
	if ( ! $post instanceof WP_Post ) {
		return false;
	}

	$label = sprintf(
		'%d [%s/%s] %s',
		$post->ID,
		$post->post_type,
		$post->post_status,
		$post->post_title
	);

	if ( ! $apply ) {
		WP_CLI::log( 'WOULD DELETE ' . $reason . ': ' . $label );
		return true;
	}

	$result = wp_delete_post( $post->ID, true );
	if ( ! $result ) {
		WP_CLI::warning( 'Could not delete ' . $label );
		return false;
	}

	return true;
}

global $wpdb;

$published_ids = $wpdb->get_col(
	$wpdb->prepare(
		"SELECT ID FROM {$wpdb->posts}
		WHERE post_type IN ('page','post') AND post_status = %s",
		'publish'
	)
);
$published_ids = array_map( 'intval', $published_ids );

$all_revisions = get_posts(
	array(
		'post_type'      => 'revision',
		'post_status'    => 'inherit',
		'posts_per_page' => -1,
		'orderby'        => array(
			'post_parent' => 'DESC',
			'post_date'   => 'DESC',
			'ID'          => 'DESC',
		),
	)
);

$revision_groups = array();
foreach ( $all_revisions as $revision ) {
	$revision_groups[ (int) $revision->post_parent ][] = $revision;
}

$stale_revision_ids = array();

foreach ( $revision_groups as $parent_id => $revisions ) {
	if ( ! in_array( $parent_id, $published_ids, true ) ) {
		foreach ( $revisions as $revision ) {
			$stale_revision_ids[] = (int) $revision->ID;
		}
		continue;
	}

	foreach ( array_slice( $revisions, 3 ) as $revision ) {
		$stale_revision_ids[] = (int) $revision->ID;
	}
}

$unused_content = get_posts(
	array(
		'post_type'      => array( 'page', 'post', 'product' ),
		'post_status'    => 'trash',
		'posts_per_page' => -1,
		'orderby'        => 'ID',
		'order'          => 'ASC',
	)
);

$auto_drafts = get_posts(
	array(
		'post_type'      => array( 'page', 'post' ),
		'post_status'    => 'auto-draft',
		'posts_per_page' => -1,
		'orderby'        => 'ID',
		'order'          => 'ASC',
	)
);

WP_CLI::log(
	sprintf(
		'Candidates: %d stale revisions, %d trash content rows, %d auto-drafts.',
		count( $stale_revision_ids ),
		count( $unused_content ),
		count( $auto_drafts )
	)
);

$deleted = 0;

foreach ( $stale_revision_ids as $revision_id ) {
	if ( mb_cleanup_delete_post( $revision_id, 'stale revision', $apply ) ) {
		$deleted++;
	}
}

foreach ( $unused_content as $post ) {
	if ( mb_cleanup_delete_post( $post->ID, 'trash content', $apply ) ) {
		$deleted++;
	}
}

foreach ( $auto_drafts as $post ) {
	if ( mb_cleanup_delete_post( $post->ID, 'auto-draft', $apply ) ) {
		$deleted++;
	}
}

$remaining_revisions = (int) $wpdb->get_var(
	"SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_type = 'revision'"
);
$remaining_trash = (int) $wpdb->get_var(
	$wpdb->prepare(
		"SELECT COUNT(*) FROM {$wpdb->posts}
		WHERE post_type IN ('page','post','product') AND post_status = %s",
		'trash'
	)
);
$remaining_auto_drafts = (int) $wpdb->get_var(
	$wpdb->prepare(
		"SELECT COUNT(*) FROM {$wpdb->posts}
		WHERE post_type IN ('page','post') AND post_status = %s",
		'auto-draft'
	)
);

WP_CLI::log(
	sprintf(
		'%s: %d records. Remaining: revisions=%d trash=%d auto-drafts=%d.',
		$apply ? 'Deleted' : 'Would delete',
		$deleted,
		$remaining_revisions,
		$remaining_trash,
		$remaining_auto_drafts
	)
);
