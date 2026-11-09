# Page Redesign Queue

Status: design review required before implementation.

## Rules

- Read `DESIGN.md` before each page.
- Use `design-taste-frontend` and `frontend-design` for every page design.
- Reuse `design-tokens.css`; do not introduce page-local color systems.
- Produce desktop, mobile and current-vs-proposed previews.
- Do not edit or deploy the WordPress page before explicit approval.
- After approval, run syntax, Playwright and live release checks.

## Queue

| Order | Page | Current status | Required next step |
|---:|---|---|---|
| 1 | About / Quality | Implemented as theme `0.9.21` in production release `20261108-12`; desktop/mobile and live checks passed | Review live page |
| 2 | Contact / Request a Quote + RFQ form | Implemented as theme `0.9.23` in production release `20261108-14`; 9 visible fields, optional details and live checks passed | Review live page, then continue to Buyer FAQ |
| 3 | Buyer FAQ | Legacy Field Manual styling | Design preview and comparison |
| 4 | Black Guide | Existing guide layout | Design preview and comparison |
| 5 | White Guide | Existing guide layout | Design preview and comparison |
| 6 | Color Guide | Existing guide layout | Design preview and comparison |
| 7 | Resources | Existing resources layout | Design preview and comparison |
| 8 | Technical Documents | Existing document template | Design preview and comparison |
| 9 | Inputs and validation states | Shared form styles | Component preview and comparison |
| 10 | Privacy Policy | Existing content template | Design preview and comparison |
| 11 | Remaining content templates | Mixed legacy layouts | Inventory, then previews |
