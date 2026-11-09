# Technical Article Mobile Fix 0.9.38

## Finding

The article body was not merely spaced incorrectly on mobile. The carbon black
comparison table kept `min-width: 600px`; because the grid item retained its
automatic min-content width, the whole `.article-reading__grid` expanded to
`602px`.

At a 390px viewport the article main column began at `-106px`, so body copy and
the table were clipped outside the left edge of the screen.

## Fix

- Added `min-width: 0` to the article main grid item.
- Kept the mobile breadcrumb on one 48px row with title ellipsis.
- Removed the fixed 430px mobile hero height and reduced H1 density.
- Set mobile article body copy to 16px.
- Added table cell labels in the WordPress builder.
- Converted labelled tables to grouped comparison cards below 620px.
- Capped the expanded mobile table of contents to the viewport.

## Before And After

| Metric | 390px before | 390px after | 320px before | 320px after |
|---|---:|---:|---:|---:|
| Article left edge | `-106px` | `16px` | `-141px` | `16px` |
| Article width | `602px` | `358px` | `602px` | `288px` |
| Body font size | `15.36px` | `16px` | `15.36px` | `16px` |
| Breadcrumb height | `71px` | `48px` | `89px` | `48px` |
| Hero height | `506px` | `436px` | `531px` | `432px` |
| Table overflow | clipped page | `0px` | clipped page | `0px` |

## Screenshots

- [Before, 390px](before-390.png)
- [After, 390px](after-390.png)
- [Before, 320px](before-320.png)
- [After, 320px](after-320.png)
- [Layout metrics](metrics.json)

## Validation

- Production route: `200`
- Theme: `0.9.38`
- Release: `/var/www/ashareai/releases/20261108-29`
- Production Playwright: `85 passed / 5 skipped`
