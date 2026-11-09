---
# gstack: design-md-format=spec
name: GE Chemical Masterbatch Website
description: Application-led industrial masterbatch website with a white technical surface, forest-green brand structure, and lime interaction signals.
colors:
  primary: "#305030"
  primary-dark: "#26372B"
  primary-mid: "#3D5A43"
  on-primary: "#FFFFFF"
  accent: "#D0F090"
  surface: "#FFFFFF"
  surface-soft: "#F6F8F4"
  surface-inverse: "#26372B"
  text: "#17201C"
  text-muted: "#68736E"
  text-subtle: "#8A938E"
  border: "#D8DED9"
  border-strong: "#C9D2CB"
  success: "#2F6F4E"
  warning: "#C99547"
  error: "#A33A32"
typography:
  display:
    fontFamily: "Georgia, Times New Roman, serif"
    fontWeight: 400
    fontSize: clamp(2.65rem, 4vw, 4.2rem)
    letterSpacing: -0.05em
  body:
    fontFamily: "Avenir Next, Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: 1rem
    lineHeight: 1.6
  label:
    fontFamily: "Avenir Next, Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: 0.75rem
    letterSpacing: 0.02em
  mono:
    fontFamily: "SFMono-Regular, Roboto Mono, Consolas, monospace"
    fontFeature: tnum
rounded:
  sm: 4px
  md: 6px
  lg: 8px
  full: 9999px
spacing:
  2xs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  4xl: 80px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
  button-primary-hover:
    backgroundColor: "{colors.primary-dark}"
  button-secondary:
    textColor: "{colors.primary}"
    borderColor: "{colors.primary}"
    rounded: "{rounded.sm}"
  nav-link:
    textColor: "{colors.primary}"
    activeColor: "{colors.primary-dark}"
  card:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    rounded: "{rounded.sm}"
  input:
    borderColor: "{colors.border-strong}"
    rounded: "{rounded.sm}"
---

# GE Chemical Masterbatch Website

## Overview

**Creative North Star:** A technical material workbook that helps a plastic
processor move from a production problem to a reviewable masterbatch direction.

**Product context:** English B2B supplier website for international plastic
processors, buyers and distributors. The main surfaces are marketing pages,
product guides, technical document requests, RFQ forms and buyer resources.

**Mode per surface:**

- Homepage and product routes: persuade through real production context.
- Guides, Resources and FAQ: read through short, structured explanations.
- RFQ and Documents: operate through clear fields and explicit next steps.

**Key characteristics:**

- White page surfaces with forest-green structural bands.
- Georgia display type against a restrained sans-serif UI.
- Lime marks interaction, focus and selected states rather than carrying body copy.
- Product routes differ by material treatment: black, white and color surfaces.
- White space separates ideas; it does not replace missing content.

## Colors

**Strategy:** Committed brand structure with restrained accents. Forest green
owns navigation, dark bands and Footer. Lime appears only as a signal: active
underlines, focus rings, short rules, selected states and key accents.

**Light or dark:** The primary reading surface is white because buyers compare
technical details, product inputs, documents and RFQ requirements. Dark green
is used for bounded structural emphasis, not as the default page background.

### Core palette

| Token | Hex | Use |
|---|---|---|
| Primary green | `#305030` | Header CTA, navigation text, Footer background |
| Deep green | `#26372B` | Hero review band, black product card, dark process panels |
| Mid green | `#3D5A43` | Dark support surfaces |
| Lime signal | `#D0F090` | Focus, active underline, short rules, dark-surface accent |
| White | `#FFFFFF` | Page background and primary cards |
| Soft sage | `#F6F8F4` | Application cards and FAQ background |
| Ink | `#17201C` | H1, H2, H3 and primary body text |
| Muted | `#68736E` | Body descriptions and supporting copy |
| Border | `#D8DED9` | Cards, tables, dividers and input borders |

### Color rules

- Do not use the old terracotta, brass or cream page background for new work.
- Use `#26372B` for black-masterbatch card surfaces and dark process bands.
- Use `#FFFFFF` for white-masterbatch cards.
- Use `#EEF4E9` for color-masterbatch cards.
- Use color for hierarchy, not decoration.
- Text on green surfaces is white or `rgba(255,255,255,0.64)` or higher.
- Lime is not used for long text or a white page background.

## Typography

**Display:** Georgia is the editorial voice for H1 and major section headings.
It gives the technical content a material-manual character that is distinct
from generic industrial templates.

**Body and UI:** Avenir Next is the preferred sans-serif, with Inter,
Helvetica Neue and Arial fallbacks. No external webfont request is required.

**Data and identifiers:** Monospace is limited to product codes, batch language
and short process numbers. It is not used for every label.

### Type scale

| Role | Desktop | Mobile | Weight | Line height |
|---|---:|---:|---:|---:|
| H1 | `clamp(3.7rem, 6vw, 6rem)` | `clamp(3.45rem, 16vw, 5rem)` | 400 | 0.96-1 |
| H2 | `clamp(2.65rem, 4vw, 4.2rem)` | `clamp(2.65rem, 12vw, 3.75rem)` | 400 | 0.96-1 |
| H3 | `1.85rem-2rem` | `1.6rem-1.85rem` | 400 | 1 |
| Section intro | `0.92rem` | `0.88rem` | 400 | 1.7 |
| Body | `1rem` | `1rem` | 400 | 1.6 |
| Card body | `0.8rem-0.84rem` | `0.78rem-0.82rem` | 400 | 1.5-1.65 |
| Navigation | `0.9rem-0.94rem` | `0.92rem` in menu | 600-650 | 1.2 |
| Buttons | `0.74rem-0.78rem` | `0.76rem-0.8rem` | 700-750 | 1.2 |
| Metadata | `0.6rem-0.68rem` | `0.6rem-0.66rem` | 650-750 | 1.4 |

### Typography rules

- One H1 per page.
- Do not add a tracked all-caps eyebrow above every section.
- Use numbering only for an actual process or sequence.
- H2 titles stay on one line on desktop where the content allows it.
- Body line length stays below roughly 72 characters where practical.

## Layout

**Container:** Maximum content width is `1240px`, with `20px` side padding on
desktop and `16px` on mobile.

**Grid:** Use a 12-column mental model. Product cards use three equal columns
on desktop. Application cards use a two-by-two grid. Review and Documents use
two equal columns. Factory copy and imagery use approximately `0.82fr 1.18fr`.

**Breakpoints:**

- `1120px`: compress navigation and Footer columns.
- `1024px`: switch Header to mobile navigation.
- `768px`: collapse two-column card layouts.
- `620px`: move to the phone layout and reduce section rhythm.

### Vertical rhythm

| Context | Desktop | Mobile |
|---|---:|---:|
| Header | `80px` | `64px` |
| Section top/bottom | `52-68px` | `44px` |
| Continuous white-section transition | `40-48px` | `40-48px` |
| Heading to section content | `24px` | `20-24px` |
| Card grid gap | `16-20px` | `16px` |

## Components

### Header

- White sticky surface with a `1px` muted-green border and restrained shadow.
- Desktop height `80px`; compact `70px`; mobile `64px`.
- Logo height `50px` desktop, `42px` compact, `38px` mobile.
- Navigation gap `28px` desktop, `18px` compact.
- Primary button minimum height `46px`, radius `4px`.
- Mobile menu is a white dropdown, not a full-screen takeover.

### Hero

- White background.
- `0.95fr 1.05fr` split at desktop.
- Factory image height `500px`; inset product image `150px`.
- Inset image uses `6px` white border plus `1px` border and a soft offset shadow.
- Hero review-basis band uses four cells on desktop and stacks on mobile.

### Buttons and links

- Primary button: green background, white text, `4px` radius, minimum `46px`.
- Secondary button: transparent, green border and green text.
- Text link: green text with a thin underline, minimum `44px` hit area.
- Hover: one-step darkening or 1px lift, duration `160-180ms`.

### Cards

- Default radius `4px`; never bubble-radius every surface.
- Border `#D8DED9`; white or soft-sage background.
- Use one shadow family: `0 14px 30px rgba(24,32,29,0.08)`.
- Product images fill a `210px` frame on desktop and `160px` on mobile.
- Product surfaces:
  - Black: `#26372B` background with white text.
  - White: `#FFFFFF` background with ink text.
  - Color: `#EEF4E9` background with ink text.

### Application cards

- Soft-sage background `#F6F8F4`.
- Desktop 2×2 grid, minimum height `190px`.
- Padding `20-22px`.
- Icons are real supplied SVG assets, not colored-circle decoration.

### Review and Documents

- Two equal columns, no separate full-section gap.
- Process panel uses deep green; Documents panel uses white.
- Internal padding `38-54px` desktop and `36px` mobile.
- Process numbering is the only place where `01-04` is appropriate.

### Forms

- White input surface.
- Border `#C9D2CB`.
- Minimum target height `44px`.
- Labels use `0.75rem` and remain visible.
- Error and success colors use the semantic tokens only.

### Footer

- Background `#305030`.
- Five columns on wide screens: brand, Quick Links, Product Lines, Contact Us, QR.
- Section headings use a `30×2px` lime rule.
- Footer link text starts at `0.72-0.76rem` and uses a `32px` row rhythm.
- Full public entity name remains visible.

## Do's and Don'ts

- Do keep page backgrounds white unless a specific section needs a dark structural band.
- Do use the same container width, section rhythm and card radius across pages.
- Do use lime for state and hierarchy signals.
- Do preserve generous white space around images, but remove double padding between consecutive sections.
- Do use real product and factory photography.
- Do check desktop and mobile before shipping.

- Don't introduce new greys, creams, oranges or blues without adding them to the tokens.
- Don't put a kicker above every heading.
- Don't use numbering unless the content is a sequence.
- Don't append arrows to every link.
- Don't make every card visually identical when the content has different hierarchy.
- Don't nest cards inside cards.
- Don't use gradients, glows, floating blobs or decorative SVG dividers.
- Don't use full-screen mobile menus when a compact dropdown is sufficient.

## Motion

- **Approach:** Minimal functional motion.
- **Easing:** enter `ease-out`, exit `ease-in`, move `ease-in-out`.
- **Duration:** micro `80ms`, short `160-180ms`, medium `220-260ms`, image zoom `400-450ms`.
- **Hover:** links reveal a lime rule; cards lift `1-2px`; images scale no more than `1.02-1.03`.
- **Reduced motion:** disable transforms and smooth scrolling.

## Migration Plan

1. Load `design-tokens.css` globally before base and page-specific styles.
2. Move Header and Footer to shared tokens first because they appear on every page.
3. Convert the homepage next, then About/FAQ, guides, Resources and forms.
4. Delete duplicated local `:root` variables after each page has moved.
5. Run Playwright at `1440`, `1024`, `768`, `390` and `320px`.
6. Update this file whenever a new component or color is introduced.

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-11-08 | White base, forest-green structure, lime signal | Matches the approved homepage and keeps technical content readable |
| 2026-11-08 | Georgia display, Avenir/Inter body | Editorial material-manual character without external font dependency |
| 2026-11-08 | 1240px container and compact 44px section rhythm | Consistent wide-grid layout without repeated double spacing |
| 2026-11-08 | Radius 4px for cards and buttons | Keeps the industrial B2B system restrained |
