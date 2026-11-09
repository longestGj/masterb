# Blog Refresh v1

Status: Static design preview. WordPress `page_for_posts` is unchanged.

## Preview

```text
http://127.0.0.1:8766/xuqiu/design-preview/blog-refresh-v1/
```

## Direction

The page is designed as an editorial buyer archive:

1. White editorial Hero with three question-based topic links.
2. One complete featured-article spread.
3. Two horizontal guide rows for supplier review and troubleshooting.
4. A dark green buyer-tools section connecting Blog to Resources.
5. A short inquiry close.

The page reuses the shared Header/Footer, global design tokens, Georgia display
type and four newly selected WebP images from the approved `img/` library.

## Files

- `blog-main.html`: preview source.
- `blog.css`: page-only prototype styles.
- `build-preview.js`: combines the main content with production Header/Footer.
- `capture-blog.js`: captures current Blog destination and proposal.
- `compare.html`: current-versus-proposal review board.
- `output/audit.json`: width, H1, heading, section, link and image checks.
