# Black Specks Article Refresh v1

Status: Static article design preview. Production article template is unchanged.

## Preview

```text
http://127.0.0.1:8766/xuqiu/design-preview/article-refresh-v1/
```

## Direction

The article is treated as a technical diagnostic report:

- Compact breadcrumb directly below the shared Header.
- White Hero with large editorial title and a product close-up.
- Sticky On this page navigation on desktop.
- Collapsible article contents on tablet and mobile.
- 760px reading column with technical tables and evidence callouts.
- Related-guide cards and one inquiry close.

## Files

- `build-preview.js`: injects the real Gutenberg article content and builds the TOC.
- `article.css`: page-only preview styles.
- `capture-article.js`: current/proposal screenshots and geometry audit.
- `compare.html`: current-versus-proposal review board.
- `output/audit.json`: viewport, H1, section, link and image checks.
