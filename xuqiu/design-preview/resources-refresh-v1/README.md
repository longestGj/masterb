# Masterbatch Buyer Resources Refresh v1

Status: Static design preview. Production template is unchanged.

## Preview

```text
http://127.0.0.1:8766/xuqiu/design-preview/resources-refresh-v1/
```

## Direction

The page is designed as a buyer research desk:

- A white editorial hero with a dark green decision panel.
- One lead article and two compact article rows.
- A soft-sage buyer tool section with RFQ preparation as the primary action.
- Three product route surfaces matching the black, white and color range.
- A single final inquiry band.

The page reuses the global design tokens, shared Header/Footer, Georgia display
type and the existing article photography.

## Files

- `resources-main.html`: approved-content preview source.
- `resources.css`: page-only prototype styles.
- `build-preview.js`: combines the preview with the production Header/Footer.
- `capture-resources.js`: captures current and proposed desktop/tablet/mobile views.
- `compare.html`: current-versus-proposal review board.
- `output/audit.json`: viewport, H1, width and image checks.

## Validation

The preview is checked at `1440 / 768 / 390 / 320px` for one H1, no horizontal
overflow and no broken images.
