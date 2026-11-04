<?php
/**
 * Plugin Name: Masterbatch Content Importer
 * Description: Imports structured Masterbatch Markdown content into WordPress as draft pages.
 * Version: 0.1.0
 * Author: GE CHEMICAL website project
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Parses the limited YAML subset used by the project's Markdown Front Matter.
 */
final class MBCI_Yaml_Subset {

	/**
	 * Parse a project Front Matter YAML document.
	 *
	 * Supported structures are maps, nested maps and scalar lists. Unsupported
	 * YAML features fail instead of being interpreted silently.
	 *
	 * @param string $yaml YAML content without the `---` delimiters.
	 * @return array<string,mixed>
	 */
	public static function parse( $yaml ) {
		$tokens = self::tokenize( $yaml );
		if ( empty( $tokens ) ) {
			return array();
		}

		$index = 0;
		if ( 0 !== $tokens[0]['indent'] ) {
			throw new RuntimeException( 'The first Front Matter key must start at column one.' );
		}

		$value = self::parse_node( $tokens, $index, 0 );
		if ( $index !== count( $tokens ) ) {
			throw new RuntimeException( 'Unexpected Front Matter content at line ' . $tokens[ $index ]['line'] . '.' );
		}

		if ( ! is_array( $value ) ) {
			throw new RuntimeException( 'Front Matter must contain a mapping at the root.' );
		}

		return $value;
	}

	/**
	 * Convert YAML lines to indentation-aware tokens.
	 *
	 * @param string $yaml YAML content.
	 * @return array<int,array{indent:int,text:string,line:int}>
	 */
	private static function tokenize( $yaml ) {
		$lines  = preg_split( '/\R/', $yaml );
		$tokens = array();

		foreach ( $lines as $line_index => $line ) {
			if ( false !== strpos( $line, "\t" ) ) {
				throw new RuntimeException( 'Tabs are not allowed in Front Matter at line ' . ( $line_index + 1 ) . '.' );
			}

			if ( '' === trim( $line ) || preg_match( '/^\s*#/', $line ) ) {
				continue;
			}

			$trimmed = ltrim( $line, ' ' );
			$indent  = strlen( $line ) - strlen( $trimmed );
			if ( 0 !== $indent % 2 ) {
				throw new RuntimeException( 'Front Matter indentation must use two spaces at line ' . ( $line_index + 1 ) . '.' );
			}

			$tokens[] = array(
				'indent' => $indent,
				'text'   => rtrim( $trimmed ),
				'line'   => $line_index + 1,
			);
		}

		return $tokens;
	}

	/**
	 * Parse one node at a specific indentation.
	 *
	 * @param array<int,array{indent:int,text:string,line:int}> $tokens Tokens.
	 * @param int                                               $index Token index.
	 * @param int                                               $indent Expected indentation.
	 * @return mixed
	 */
	private static function parse_node( $tokens, &$index, $indent ) {
		if ( ! isset( $tokens[ $index ] ) ) {
			return null;
		}

		if ( $tokens[ $index ]['indent'] !== $indent ) {
			throw new RuntimeException( 'Unexpected indentation at line ' . $tokens[ $index ]['line'] . '.' );
		}

		if ( 0 === strpos( $tokens[ $index ]['text'], '- ' ) ) {
			return self::parse_sequence( $tokens, $index, $indent );
		}

		return self::parse_mapping( $tokens, $index, $indent );
	}

	/**
	 * Parse a mapping.
	 *
	 * @param array<int,array{indent:int,text:string,line:int}> $tokens Tokens.
	 * @param int                                               $index Token index.
	 * @param int                                               $indent Expected indentation.
	 * @return array<string,mixed>
	 */
	private static function parse_mapping( $tokens, &$index, $indent ) {
		$result = array();
		$count  = count( $tokens );

		while ( $index < $count ) {
			$token = $tokens[ $index ];
			if ( $token['indent'] < $indent ) {
				break;
			}
			if ( $token['indent'] > $indent ) {
				throw new RuntimeException( 'Unexpected mapping indentation at line ' . $token['line'] . '.' );
			}
			if ( 0 === strpos( $token['text'], '- ' ) ) {
				break;
			}

			if ( ! preg_match( '/^([A-Za-z0-9_-]+):(.*)$/', $token['text'], $matches ) ) {
				throw new RuntimeException( 'Unsupported YAML mapping at line ' . $token['line'] . '.' );
			}

			$key = $matches[1];
			if ( array_key_exists( $key, $result ) ) {
				throw new RuntimeException( 'Duplicate Front Matter key "' . $key . '" at line ' . $token['line'] . '.' );
			}

			$raw_value = trim( $matches[2] );
			if ( '' !== $raw_value ) {
				$result[ $key ] = self::parse_scalar( $raw_value, $token['line'] );
				$index++;
				continue;
			}

			$index++;
			if ( $index >= $count || $tokens[ $index ]['indent'] <= $indent ) {
				$result[ $key ] = null;
				continue;
			}

			$result[ $key ] = self::parse_node( $tokens, $index, $tokens[ $index ]['indent'] );
		}

		return $result;
	}

	/**
	 * Parse a scalar list.
	 *
	 * @param array<int,array{indent:int,text:string,line:int}> $tokens Tokens.
	 * @param int                                               $index Token index.
	 * @param int                                               $indent Expected indentation.
	 * @return array<int,mixed>
	 */
	private static function parse_sequence( $tokens, &$index, $indent ) {
		$result = array();
		$count  = count( $tokens );

		while ( $index < $count ) {
			$token = $tokens[ $index ];
			if ( $token['indent'] < $indent ) {
				break;
			}
			if ( $token['indent'] > $indent ) {
				throw new RuntimeException( 'Unexpected list indentation at line ' . $token['line'] . '.' );
			}
			if ( 0 !== strpos( $token['text'], '- ' ) ) {
				break;
			}

			$item = trim( substr( $token['text'], 2 ) );
			if ( '' === $item ) {
				throw new RuntimeException( 'Nested or empty YAML list items are not supported at line ' . $token['line'] . '.' );
			}

			$result[] = self::parse_scalar( $item, $token['line'] );
			$index++;
		}

		return $result;
	}

	/**
	 * Parse a YAML scalar.
	 *
	 * @param string $value Raw scalar.
	 * @param int    $line  Source line.
	 * @return mixed
	 */
	private static function parse_scalar( $value, $line ) {
		if ( '"' === $value[0] ) {
			$decoded = json_decode( $value, true );
			if ( JSON_ERROR_NONE !== json_last_error() || ! is_string( $decoded ) ) {
				throw new RuntimeException( 'Invalid double-quoted value at line ' . $line . '.' );
			}
			return $decoded;
		}

		if ( "'" === $value[0] ) {
			if ( strlen( $value ) < 2 || "'" !== substr( $value, -1 ) ) {
				throw new RuntimeException( 'Invalid single-quoted value at line ' . $line . '.' );
			}
			return str_replace( "''", "'", substr( $value, 1, -1 ) );
		}

		if ( 'null' === $value ) {
			return null;
		}
		if ( 'true' === $value ) {
			return true;
		}
		if ( 'false' === $value ) {
			return false;
		}
		if ( preg_match( '/^-?\d+$/', $value ) ) {
			return (int) $value;
		}

		return $value;
	}
}

/**
 * Converts the controlled Markdown body to editable Gutenberg blocks.
 */
final class MBCI_Markdown {

	/**
	 * Convert project Markdown to WordPress block markup.
	 *
	 * @param string $markdown Public Markdown body.
	 * @return string
	 */
	public static function to_blocks( $markdown ) {
		$markdown = preg_replace( '/<!--.*?-->/s', '', $markdown );
		$lines    = preg_split( '/\R/', str_replace( array( "\r\n", "\r" ), "\n", $markdown ) );
		$blocks   = array();
		$index    = 0;
		$count    = count( $lines );

		while ( $index < $count ) {
			$line = $lines[ $index ];
			if ( '' === trim( $line ) ) {
				$index++;
				continue;
			}

			if ( preg_match( '/^##\s+(.+)$/', $line, $matches ) ) {
				$blocks[] = self::heading_block( 2, $matches[1] );
				$index++;
				continue;
			}

			if ( preg_match( '/^###\s+(.+)$/', $line, $matches ) ) {
				$blocks[] = self::heading_block( 3, $matches[1] );
				$index++;
				continue;
			}

			if ( preg_match( '/^#{1,6}\s+/', $line ) ) {
				throw new RuntimeException( 'Only H2 and H3 headings are supported in the Markdown body.' );
			}

			if ( preg_match( '/^-\s+(.+)$/', $line ) ) {
				$items = array();
				while ( $index < $count && preg_match( '/^-\s+(.+)$/', $lines[ $index ], $matches ) ) {
					$items[] = $matches[1];
					$index++;
				}
				$blocks[] = self::list_block( $items );
				continue;
			}

			if ( self::is_table_start( $lines, $index ) ) {
				$table_lines = array();
				while ( $index < $count && '' !== trim( $lines[ $index ] ) && '|' === substr( ltrim( $lines[ $index ] ), 0, 1 ) ) {
					$table_lines[] = trim( $lines[ $index ] );
					$index++;
				}
				$blocks[] = self::table_block( $table_lines );
				continue;
			}

			$paragraph = array();
			while ( $index < $count ) {
				$current = $lines[ $index ];
				if ( '' === trim( $current ) || preg_match( '/^#{2,3}\s+/', $current ) || preg_match( '/^-\s+/', $current ) ) {
					break;
				}
				if ( self::is_table_start( $lines, $index ) ) {
					break;
				}
				if ( '<' === substr( ltrim( $current ), 0, 1 ) ) {
					throw new RuntimeException( 'Raw HTML is not supported in the Markdown body.' );
				}
				$paragraph[] = trim( $current );
				$index++;
			}

			if ( empty( $paragraph ) ) {
				throw new RuntimeException( 'Unable to parse Markdown near line ' . ( $index + 1 ) . '.' );
			}

			$blocks[] = "<!-- wp:paragraph -->\n<p>" . self::inline( implode( "\n", $paragraph ) ) . "</p>\n<!-- /wp:paragraph -->";
		}

		return implode( "\n\n", $blocks );
	}

	/**
	 * Build a heading block.
	 *
	 * @param int    $level Heading level.
	 * @param string $text  Heading text.
	 * @return string
	 */
	private static function heading_block( $level, $text ) {
		return sprintf(
			"<!-- wp:heading {\"level\":%d} -->\n<h%d>%s</h%d>\n<!-- /wp:heading -->",
			$level,
			$level,
			self::inline( $text ),
			$level
		);
	}

	/**
	 * Build a list block.
	 *
	 * @param array<int,string> $items List items.
	 * @return string
	 */
	private static function list_block( $items ) {
		$html = array_map(
			static function ( $item ) {
				return "<!-- wp:list-item -->\n<li>" . self::inline( $item ) . "</li>\n<!-- /wp:list-item -->";
			},
			$items
		);

		return "<!-- wp:list -->\n<ul class=\"wp-block-list\">\n" .
			implode( "\n", $html ) .
			"\n</ul>\n<!-- /wp:list -->";
	}

	/**
	 * Determine whether a line starts a Markdown table.
	 *
	 * @param array<int,string> $lines Lines.
	 * @param int               $index Current index.
	 * @return bool
	 */
	private static function is_table_start( $lines, $index ) {
		if ( ! isset( $lines[ $index ], $lines[ $index + 1 ] ) ) {
			return false;
		}
		if ( '|' !== substr( ltrim( $lines[ $index ] ), 0, 1 ) ) {
			return false;
		}

		return (bool) preg_match( '/^\|(?:\s*:?-{3,}:?\s*\|)+\s*$/', trim( $lines[ $index + 1 ] ) );
	}

	/**
	 * Build a table block.
	 *
	 * @param array<int,string> $lines Table lines.
	 * @return string
	 */
	private static function table_block( $lines ) {
		if ( count( $lines ) < 3 ) {
			throw new RuntimeException( 'A Markdown table requires a header, separator and body row.' );
		}

		$headers = self::table_cells( $lines[0] );
		$columns = count( $headers );
		$head    = array();
		foreach ( $headers as $cell ) {
			$head[] = '<th>' . self::inline( $cell ) . '</th>';
		}

		$rows = array();
		foreach ( array_slice( $lines, 2 ) as $line ) {
			$cells = self::table_cells( $line );
			if ( count( $cells ) !== $columns ) {
				throw new RuntimeException( 'Table row column count does not match the header.' );
			}
			$row = array();
			foreach ( $cells as $cell ) {
				$row[] = '<td>' . self::inline( $cell ) . '</td>';
			}
			$rows[] = '<tr>' . implode( '', $row ) . '</tr>';
		}

		return "<!-- wp:table -->\n<figure class=\"wp-block-table\"><table><thead><tr>" .
			implode( '', $head ) . '</tr></thead><tbody>' . implode( '', $rows ) .
			"</tbody></table></figure>\n<!-- /wp:table -->";
	}

	/**
	 * Split a Markdown table row.
	 *
	 * @param string $line Table row.
	 * @return array<int,string>
	 */
	private static function table_cells( $line ) {
		$line = trim( $line );
		$line = trim( $line, '|' );
		return array_map( 'trim', explode( '|', $line ) );
	}

	/**
	 * Convert supported inline Markdown to escaped HTML.
	 *
	 * @param string $text Source text.
	 * @return string
	 */
	public static function inline( $text ) {
		$links = array();
		$text  = preg_replace_callback(
			'/\[([^\]]+)\]\(([^)]+)\)/',
			static function ( $matches ) use ( &$links ) {
				$key           = "\x1A" . count( $links ) . "\x1A";
				$links[ $key ] = array( $matches[1], $matches[2] );
				return $key;
			},
			$text
		);

		$text = htmlspecialchars( $text, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8' );
		$text = preg_replace( '/\*\*([^*]+)\*\*/', '<strong>$1</strong>', $text );

		foreach ( $links as $key => $link ) {
			$url  = self::safe_url( $link[1] );
			$html = '<a href="' . htmlspecialchars( $url, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8' ) . '">' .
				htmlspecialchars( $link[0], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8' ) . '</a>';
			$text = str_replace( $key, $html, $text );
		}

		return $text;
	}

	/**
	 * Allow only safe project link schemes.
	 *
	 * @param string $url Candidate URL.
	 * @return string
	 */
	public static function safe_url( $url ) {
		$url = trim( $url );
		if ( '' === $url ) {
			throw new RuntimeException( 'Empty Markdown link URL.' );
		}

		if ( '/' === $url[0] || '#' === $url[0] ) {
			if ( '//' === substr( $url, 0, 2 ) ) {
				throw new RuntimeException( 'Protocol-relative links are not supported: ' . $url );
			}
			return $url;
		}

		if ( preg_match( '#^https?://#i', $url ) ) {
			return $url;
		}

		throw new RuntimeException( 'Unsupported or unsafe Markdown link URL: ' . $url );
	}
}

/**
 * Validates and normalizes controlled Gutenberg block content.
 */
final class MBCI_Gutenberg_Blocks {

	/**
	 * Allowed top-level and nested block names for imported homepage content.
	 *
	 * @var array<int,string>
	 */
	private static $allowed_blocks = array(
		'group',
		'columns',
		'column',
		'paragraph',
		'heading',
		'buttons',
		'button',
		'image',
		'list',
		'list-item',
		'table',
	);

	/**
	 * Validate block markup and return normalized content.
	 *
	 * @param string $content Raw Gutenberg block markup.
	 * @return string
	 */
	public static function normalize( $content ) {
		$content = trim( preg_replace( '/^\xEF\xBB\xBF/', '', $content ) );
		if ( '' === $content ) {
			throw new RuntimeException( 'Gutenberg block content is empty.' );
		}

		if ( preg_match( '/<(?:script|iframe|object|embed|style|link|meta|form|input|textarea|select|button|svg|math)\b/i', $content ) ) {
			throw new RuntimeException( 'Unsafe executable or embedded HTML is not allowed in Gutenberg content.' );
		}
		if ( preg_match( '/\son[a-z]+\s*=/i', $content ) || preg_match( '/javascript\s*:/i', $content ) ) {
			throw new RuntimeException( 'Inline event handlers and JavaScript URLs are not allowed in Gutenberg content.' );
		}

		self::validate_block_markers( $content );

		if ( preg_match_all( '/\b(?:href|src)="([^"]*)"/i', $content, $attributes ) ) {
			foreach ( $attributes[1] as $url ) {
				MBCI_Markdown::safe_url( html_entity_decode( $url, ENT_QUOTES | ENT_HTML5, 'UTF-8' ) );
			}
		}

		return $content;
	}

	/**
	 * Enforce balanced block comments and a project block allowlist.
	 *
	 * @param string $content Block markup.
	 * @return void
	 */
	private static function validate_block_markers( $content ) {
		$lines = preg_split( '/\R/', $content );
		$stack = array();
		$count = 0;

		foreach ( $lines as $line_number => $line ) {
			$trimmed = trim( $line );

			if ( preg_match( '/^<!--\s+\/wp:([a-z0-9-]+)\s+-->$/', $trimmed, $matches ) ) {
				$block = $matches[1];
				self::assert_allowed_block( $block, $line_number + 1 );
				$open = array_pop( $stack );
				if ( null === $open || $open['name'] !== $block ) {
					throw new RuntimeException( 'Mismatched Gutenberg closing block "' . $block . '" at line ' . ( $line_number + 1 ) . '.' );
				}
				continue;
			}

			if ( preg_match( '/^<!--\s+wp:([a-z0-9-]+)(?:\s+\{.*\})?\s+(\/)?-->$/', $trimmed, $matches ) ) {
				$block = $matches[1];
				self::assert_allowed_block( $block, $line_number + 1 );
				$count++;
				if ( empty( $matches[2] ) ) {
					$stack[] = array(
						'name' => $block,
						'line' => $line_number + 1,
					);
				}
			}
		}

		if ( 0 === $count ) {
			throw new RuntimeException( 'No WordPress block markers were found in Gutenberg content.' );
		}
		if ( ! empty( $stack ) ) {
			$open = array_pop( $stack );
			throw new RuntimeException( 'Unclosed Gutenberg block "' . $open['name'] . '" from line ' . $open['line'] . '.' );
		}
	}

	/**
	 * Reject unsupported block names.
	 *
	 * @param string $block Block name.
	 * @param int    $line  Source line.
	 * @return void
	 */
	private static function assert_allowed_block( $block, $line ) {
		if ( ! in_array( $block, self::$allowed_blocks, true ) ) {
			throw new RuntimeException( 'Unsupported Gutenberg block "' . $block . '" at line ' . $line . '.' );
		}
	}
}

/**
 * Reads, validates and imports one Masterbatch Markdown package.
 */
final class MBCI_Content_Importer {

	/**
	 * Split and parse a package.
	 *
	 * @param string $raw Markdown file content.
	 * @return array{front_matter:array<string,mixed>,body:string}
	 */
	public static function parse_document( $raw ) {
		$raw = preg_replace( '/^\xEF\xBB\xBF/', '', $raw );
		if ( ! preg_match( '/\A---\n(.*?)\n---\n(.*)\z/s', $raw, $matches ) ) {
			throw new RuntimeException( 'Markdown Front Matter must start with --- and contain a second --- line.' );
		}

		return array(
			'front_matter' => MBCI_Yaml_Subset::parse( $matches[1] ),
			'body'         => ltrim( $matches[2] ),
		);
	}

	/**
	 * Convert a validated package body to WordPress block content.
	 *
	 * @param array<string,mixed> $data Parsed Front Matter.
	 * @param string              $body Package body.
	 * @return string
	 */
	public static function to_wordpress_blocks( $data, $body ) {
		$body_format = $data['body_format'] ?? 'markdown-portable-v1';
		if ( 'gutenberg-blocks-v1' === $body_format ) {
			return MBCI_Gutenberg_Blocks::normalize( $body );
		}
		if ( 'markdown-portable-v1' === $body_format ) {
			return MBCI_Markdown::to_blocks( $body );
		}

		throw new RuntimeException( 'Unsupported body_format: ' . $body_format );
	}

	/**
	 * Validate project content before any WordPress write.
	 *
	 * @param array<string,mixed> $data Parsed Front Matter.
	 * @param string              $body Markdown body.
	 * @return void
	 */
	public static function validate_document( $data, $body ) {
		foreach ( array( 'content_id', 'content_type', 'locale', 'route_key', 'title', 'primary_keyword', 'search_intent', 'page_job' ) as $key ) {
			if ( ! isset( $data[ $key ] ) || ! is_string( $data[ $key ] ) || '' === trim( $data[ $key ] ) ) {
				throw new RuntimeException( 'Missing required Front Matter field: ' . $key );
			}
		}

		if ( ! preg_match( '/^[a-z0-9._-]+$/', $data['content_id'] ) ) {
			throw new RuntimeException( 'content_id must contain only lowercase letters, numbers, dots, underscores and hyphens.' );
		}

		$wp = $data['wp'] ?? null;
		if ( ! is_array( $wp ) ) {
			throw new RuntimeException( 'Missing wp mapping in Front Matter.' );
		}
		if ( 'page' !== ( $wp['object_type'] ?? null ) ) {
			throw new RuntimeException( 'Only WordPress page imports are supported in this importer version.' );
		}
		if ( 'draft' !== ( $wp['status'] ?? null ) || true !== ( $wp['noindex'] ?? null ) ) {
			throw new RuntimeException( 'Imported pages must be draft pages with noindex enabled.' );
		}
		if ( empty( $wp['title'] ) || empty( $wp['slug'] ) ) {
			throw new RuntimeException( 'wp.title and wp.slug are required.' );
		}
		if ( ! preg_match( '/^[a-z0-9-]+$/', $wp['slug'] ) ) {
			throw new RuntimeException( 'wp.slug must use lowercase letters, numbers and hyphens.' );
		}

		$seo = $data['seo'] ?? null;
		$hero = $data['hero'] ?? null;
		if ( ! is_array( $seo ) || ! is_array( $hero ) ) {
			throw new RuntimeException( 'SEO and hero mappings are required.' );
		}
		if ( empty( $seo['title'] ) || empty( $seo['description'] ) || empty( $hero['title'] ) ) {
			throw new RuntimeException( 'SEO title, SEO description and hero title are required.' );
		}
		if ( self::text_length( $seo['title'] ) > 60 ) {
			throw new RuntimeException( 'SEO title exceeds the 60-character planning limit.' );
		}
		$description_length = self::text_length( $seo['description'] );
		if ( $description_length < 120 || $description_length > 155 ) {
			throw new RuntimeException( 'SEO description must be between 120 and 155 characters; found ' . $description_length . '.' );
		}

		$public_body = preg_replace( '/<!--.*?-->/s', '', $body );
		$body_format = $data['body_format'] ?? 'markdown-portable-v1';
		if ( ! in_array( $body_format, array( 'markdown-portable-v1', 'gutenberg-blocks-v1' ), true ) ) {
			throw new RuntimeException( 'Unsupported body_format: ' . $body_format );
		}
		if ( 'gutenberg-blocks-v1' === $body_format ) {
			MBCI_Gutenberg_Blocks::normalize( $body );
		}

		$markdown_h1_count = preg_match_all( '/^#\s+/m', $public_body, $unused_matches );
		$html_h1_count     = preg_match_all( '/<h1\b/i', $public_body, $unused_matches );
		$h1_count          = $markdown_h1_count + $html_h1_count;
		$body_h1_allowed   = true === ( $data['import']['body_h1_allowed'] ?? false );
		if ( $body_h1_allowed && 'home' !== $data['content_type'] ) {
			throw new RuntimeException( 'Only the homepage content type may own its body H1.' );
		}
		if ( $h1_count > 0 && ! $body_h1_allowed ) {
			throw new RuntimeException( 'This content package must not contain an H1 in the body.' );
		}
		if ( $body_h1_allowed && 1 !== $h1_count ) {
			throw new RuntimeException( 'A content package that owns its body H1 must contain exactly one H1.' );
		}
		if ( 'gutenberg-blocks-v1' === $body_format && 'home' !== $data['content_type'] ) {
			throw new RuntimeException( 'gutenberg-blocks-v1 is currently restricted to homepage content.' );
		}
		if ( ! isset( $data['evidence']['public_entity'] ) || 'GE CHEMICAL & POLYMER GROUP CO., LTD' !== $data['evidence']['public_entity'] ) {
			throw new RuntimeException( 'Front Matter must identify GE CHEMICAL as the public entity.' );
		}

		$searchable = wp_json_encode_stub( $data ) . "\n" . $public_body;
		if ( preg_match( '/(wudi\s+longda|binzhou\s+leachy|shandong\s+beihong)/i', $searchable ) ) {
			throw new RuntimeException( 'A non-GE public entity was found in the content package.' );
		}

		$prohibited = array(
			'download tds',
			'download sds',
			'download msds',
			'download coa',
			'instant download',
			'public download center',
			'file is attached',
		);
		$lower_body = strtolower( $public_body );
		foreach ( $prohibited as $phrase ) {
			if ( false !== strpos( $lower_body, $phrase ) ) {
				throw new RuntimeException( 'Prohibited public document-delivery wording: ' . $phrase );
			}
		}

		$parent_slug = $wp['parent_slug'] ?? null;
		if ( null !== $parent_slug && ! preg_match( '/^[a-z0-9-]+$/', $parent_slug ) ) {
			throw new RuntimeException( 'wp.parent_slug must use lowercase letters, numbers and hyphens.' );
		}
	}

	/**
	 * Import a Masterbatch Markdown package as a draft WordPress page.
	 *
	 * ## OPTIONS
	 *
	 * <file>
	 * : Path to the Markdown content package.
	 *
	 * [--dry-run]
	 * : Validate and preview the import without writing to WordPress.
	 *
	 * [--update]
	 * : Update an existing draft with the same content ID.
	 *
	 * [--parent-id=<id>]
	 * : Assign an existing WordPress page as the parent.
	 *
	 * [--create-parent]
	 * : Create the missing parent page from wp.parent_slug as a draft.
	 *
	 * ## EXAMPLES
	 *
	 *     wp mb-content import /import/black-masterbatch.md --dry-run
	 *     wp mb-content import /import/black-masterbatch.md --create-parent
	 *     wp mb-content import /import/black-masterbatch.md --update
	 *
	 * @when after_wp_load
	 * @param array<int,string>   $args       Positional arguments.
	 * @param array<string,mixed> $assoc_args Associative arguments.
	 * @return void
	 */
	public function import( $args, $assoc_args ) {
		if ( empty( $args[0] ) ) {
			WP_CLI::error( 'Provide the path to a Markdown content package.' );
		}

		$path = $args[0];
		if ( ! is_file( $path ) || ! is_readable( $path ) ) {
			WP_CLI::error( 'Markdown file is not readable: ' . $path );
		}

		try {
			$document = self::parse_document( file_get_contents( $path ) );
			self::validate_document( $document['front_matter'], $document['body'] );
			$data   = $document['front_matter'];
			$blocks = self::to_wordpress_blocks( $data, $document['body'] );
			$hash   = hash( 'sha256', file_get_contents( $path ) );
			$dry    = isset( $assoc_args['dry-run'] );
			$update = isset( $assoc_args['update'] );

			$existing = self::find_existing_page( $data['content_id'] );
			if ( $existing && ! $update ) {
				throw new RuntimeException( 'Content ID already exists as page #' . $existing->ID . '. Re-run with --update after reviewing the target.' );
			}
			if ( $existing && 'draft' !== $existing->post_status ) {
				throw new RuntimeException( 'Existing page #' . $existing->ID . ' is not a draft. This importer will not overwrite a published page.' );
			}

			$parent_id = self::resolve_parent( $data, $assoc_args, $dry );
			$current_hash = $existing ? (string) get_post_meta( $existing->ID, '_mb_content_hash', true ) : '';

			WP_CLI::log( 'Content ID: ' . $data['content_id'] );
			WP_CLI::log( 'WordPress page: ' . ( $existing ? '#' . $existing->ID : 'new draft' ) );
			WP_CLI::log( 'Title: ' . $data['wp']['title'] );
			WP_CLI::log( 'Slug: ' . $data['wp']['slug'] );
			WP_CLI::log( 'Parent ID: ' . $parent_id );
			WP_CLI::log( 'Content hash: ' . $hash );
			WP_CLI::log( 'Generated blocks: ' . substr_count( $blocks, '<!-- wp:' ) );

			if ( $dry ) {
				WP_CLI::success( 'Dry run complete. No WordPress content was changed.' );
				return;
			}

			if ( $existing && hash_equals( $current_hash, $hash ) ) {
				WP_CLI::success( 'Content is unchanged. Page #' . $existing->ID . ' was not modified.' );
				return;
			}

			$postarr = array(
				'post_type'    => 'page',
				'post_status'  => 'draft',
				'post_title'   => $data['wp']['title'],
				'post_name'    => $data['wp']['slug'],
				'post_parent'  => $parent_id,
				'post_excerpt' => $data['hero']['summary'] ?? '',
				'post_content' => $blocks,
				'comment_status' => 'closed',
				'ping_status'  => 'closed',
			);
			if ( $existing ) {
				$postarr['ID'] = $existing->ID;
				$post_id       = wp_update_post( wp_slash( $postarr ), true );
			} else {
				$post_id = wp_insert_post( wp_slash( $postarr ), true );
			}

			if ( is_wp_error( $post_id ) ) {
				throw new RuntimeException( $post_id->get_error_message() );
			}

			self::save_meta( (int) $post_id, $data, $blocks, $hash, $parent_id );
			WP_CLI::success( 'Imported draft page #' . $post_id . '. Review it in WordPress before publishing.' );
		} catch ( Throwable $error ) {
			WP_CLI::error( $error->getMessage() );
		}
	}

	/**
	 * Find an imported page by stable content ID.
	 *
	 * @param string $content_id Stable content ID.
	 * @return WP_Post|null
	 */
	private static function find_existing_page( $content_id ) {
		$pages = get_posts(
			array(
				'post_type'      => 'page',
				'post_status'    => array( 'draft', 'pending', 'private', 'publish', 'future' ),
				'meta_key'       => '_mb_content_id',
				'meta_value'     => $content_id,
				'posts_per_page' => 2,
				'orderby'        => 'ID',
				'order'          => 'ASC',
			)
		);

		if ( count( $pages ) > 1 ) {
			throw new RuntimeException( 'Multiple pages use content ID ' . $content_id . '. Resolve the duplicate before importing.' );
		}

		return $pages ? $pages[0] : null;
	}

	/**
	 * Resolve or optionally create the parent page.
	 *
	 * @param array<string,mixed> $data       Front Matter.
	 * @param array<string,mixed> $assoc_args CLI arguments.
	 * @param bool                $dry        Whether this is a dry run.
	 * @return int
	 */
	private static function resolve_parent( $data, $assoc_args, $dry ) {
		if ( isset( $assoc_args['parent-id'] ) ) {
			$parent_id = absint( $assoc_args['parent-id'] );
			$parent    = $parent_id ? get_post( $parent_id ) : null;
			if ( ! $parent || 'page' !== $parent->post_type ) {
				throw new RuntimeException( '--parent-id must reference an existing WordPress page.' );
			}
			return $parent_id;
		}

		$slug = $data['wp']['parent_slug'] ?? '';
		if ( '' === $slug ) {
			return 0;
		}

		$parent = get_page_by_path( $slug, OBJECT, 'page' );
		if ( $parent ) {
			return (int) $parent->ID;
		}

		if ( ! isset( $assoc_args['create-parent'] ) ) {
			if ( $dry ) {
				WP_CLI::warning( 'Parent page "' . $slug . '" does not exist. Add --create-parent for a real import.' );
				return 0;
			}
			throw new RuntimeException( 'Parent page "' . $slug . '" does not exist. Re-run with --create-parent or --parent-id.' );
		}

		if ( $dry ) {
			WP_CLI::log( 'Would create missing parent page "' . $slug . '" as a draft.' );
			return 0;
		}

		$title = $data['wp']['parent_title'] ?? ucwords( str_replace( '-', ' ', $slug ) );
		$id    = wp_insert_post(
			wp_slash(
				array(
					'post_type'      => 'page',
					'post_status'    => 'draft',
					'post_title'     => $title,
					'post_name'      => $slug,
					'comment_status' => 'closed',
					'ping_status'    => 'closed',
				)
			),
			true
		);
		if ( is_wp_error( $id ) ) {
			throw new RuntimeException( 'Could not create parent page: ' . $id->get_error_message() );
		}

		update_post_meta( $id, '_mb_noindex', '1' );
		update_post_meta( $id, '_mb_content_id', $slug . '.index' );
		update_post_meta( $id, '_mb_route_key', $slug );
		WP_CLI::log( 'Created parent page #' . $id . ' (' . $slug . ').' );

		return (int) $id;
	}

	/**
	 * Save structured content metadata.
	 *
	 * @param int                 $post_id  Page ID.
	 * @param array<string,mixed> $data     Front Matter.
	 * @param string              $blocks   Gutenberg block content.
	 * @param string              $hash     Source hash.
	 * @param int                 $parent_id Parent page ID.
	 * @return void
	 */
	private static function save_meta( $post_id, $data, $blocks, $hash, $parent_id ) {
		$wp      = $data['wp'];
		$route   = $data['route'] ?? array();
		$seo     = $data['seo'] ?? array();
		$hero    = $data['hero'] ?? array();
		$convert = $data['conversion'] ?? array();
		$form    = $data['form'] ?? array();

		$meta = array(
			'_mb_content_id'       => $data['content_id'],
			'_mb_content_type'     => $data['content_type'],
			'_mb_schema_version'   => (string) $data['schema_version'],
			'_mb_locale'           => $data['locale'],
			'_mb_route_key'        => $data['route_key'],
			'_mb_route_path'       => $route['path'] ?? '',
			'_mb_canonical'        => $route['canonical'] ?? '',
			'_mb_primary_keyword'  => $data['primary_keyword'],
			'_mb_search_intent'    => $data['search_intent'],
			'_mb_page_job'         => $data['page_job'],
			'_mb_product_family'   => $data['product_family'] ?? '',
			'_mb_hero_eyebrow'     => $hero['eyebrow'] ?? '',
			'_mb_hero_title'       => $hero['title'] ?? '',
			'_mb_hero_summary'     => $hero['summary'] ?? '',
			'_mb_primary_cta_id'   => $convert['primary_cta_id'] ?? '',
			'_mb_secondary_cta_id' => $convert['secondary_cta_id'] ?? '',
			'_mb_form_key'         => $form['key'] ?? ( $convert['form_key'] ?? '' ),
			'_mb_form_context'     => $convert['form_context'] ?? '',
			'_mb_form_prefill'     => $form['product_interest_prefill'] ?? '',
			'_mb_seo_title'        => $seo['title'] ?? '',
			'_mb_seo_description'  => $seo['description'] ?? '',
			'_mb_robots'           => $seo['robots'] ?? 'noindex,nofollow',
			'_mb_noindex'          => '1',
			'_mb_content_hash'     => $hash,
			'_mb_front_matter'     => wp_json_encode_stub( $data ),
			'_mb_template_contract' => wp_json_encode_stub( $data['template_contract'] ?? array() ),
			'_mb_parent_content_id' => self::resolve_parent_content_id( $parent_id ),
		);

		foreach ( $meta as $key => $value ) {
			update_post_meta( $post_id, $key, $value );
		}

		if ( ! empty( $wp['template'] ) ) {
			update_post_meta( $post_id, '_wp_page_template', $wp['template'] );
		}
		update_post_meta( $post_id, '_mb_body_format', $data['body_format'] ?? 'markdown-portable-v1' );
		update_post_meta( $post_id, '_mb_front_page', true === ( $wp['front_page'] ?? false ) ? '1' : '' );
	}

	/**
	 * Read the stable content ID from a parent page when available.
	 *
	 * @param int $parent_id Parent page ID.
	 * @return string
	 */
	private static function resolve_parent_content_id( $parent_id ) {
		if ( ! $parent_id ) {
			return '';
		}
		return (string) get_post_meta( $parent_id, '_mb_content_id', true );
	}

	/**
	 * Measure UTF-8 text length with a safe fallback.
	 *
	 * @param string $text Text.
	 * @return int
	 */
	private static function text_length( $text ) {
		return function_exists( 'mb_strlen' ) ? mb_strlen( $text, 'UTF-8' ) : strlen( $text );
	}
}

/**
 * Minimal JSON helper used by the standalone parser test as well as WordPress.
 *
 * @param mixed $value Value.
 * @return string|false
 */
function wp_json_encode_stub( $value ) {
	if ( function_exists( 'wp_json_encode' ) ) {
		return wp_json_encode( $value );
	}

	return json_encode( $value, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE );
}

if ( defined( 'WP_CLI' ) && WP_CLI ) {
	WP_CLI::add_command( 'mb-content', new MBCI_Content_Importer() );
}

if ( function_exists( 'add_filter' ) ) {
	add_filter(
		'wp_robots',
		static function ( $robots ) {
			$post_id = get_queried_object_id();
			if ( $post_id && '1' === get_post_meta( $post_id, '_mb_noindex', true ) ) {
				$robots['noindex'] = true;
				$robots['nofollow'] = true;
			}
			return $robots;
		},
		1
	);
}
