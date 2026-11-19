---
content_id: "product.black.film_packaging"
content_type: "product_application"
schema_version: 1
locale: "en-US"
route_key: "products.black.film_packaging"
status: "review"
title: "Black Masterbatch for Film and Packaging"
primary_keyword: "black masterbatch for film"
secondary_keywords:
  - "black masterbatch for film blowing"
  - "black masterbatch for trash bags"
  - "black masterbatch for bags"
  - "masterbatch for packaging film"
  - "film grade black masterbatch"
search_intent: "commercial_investigation"
page_job: "Route film, bag and packaging buyers to the BK020 to BK040 grades, the film checks that matter and a grade-specific RFQ."
product_family: "black"
body_format: "template-rendered-v1"
h1_source: "template:film-packaging"

wp:
  object_type: "page"
  title: "Black Masterbatch for Film and Packaging"
  slug: "film-packaging"
  parent_slug: "black-masterbatch"
  parent_title: "Black Masterbatch"
  parent_required: true
  template: "page-film-packaging"
  status: "draft"
  comment_status: "closed"
  ping_status: "closed"
  noindex: true

route:
  path: "/products/black-masterbatch/film-packaging/"
  canonical: "/products/black-masterbatch/film-packaging/"
  trailing_slash: true
  breadcrumb:
    - "Products"
    - "Black masterbatch"
    - "Film and packaging"

seo:
  title: "Black Masterbatch for Film & Packaging | GE CHEMICAL"
  description: "Black masterbatch for blown film, bags and packaging. Compare BK020 to BK040 by carbon black, filler, dispersion and let-down before a trial."
  robots: "noindex,nofollow"
  canonical_route_key: "products.black.film_packaging"
  open_graph_image: "assets/images/film-packaging-hero.webp"
  structured_data:
    - "WebPage"
    - "BreadcrumbList"
    - "FAQPage"

hero:
  title: "Black Masterbatch for Film and Packaging"
  summary: "Five BK grades from 20% to 40% carbon black for blown film, bags and packaging structures. Share the resin, film structure, thickness and target appearance for grade review."
  image: "assets/images/film-packaging-hero.webp"

conversion:
  primary_action: "Request a film masterbatch quote"
  primary_target: "/request-a-quote/?intent=black-masterbatch&source=film-packaging"
  secondary_action: "Compare BK grades"
  secondary_target: "#grades"

document_cta:
  label: "Request film grade TDS"
  target: "/technical-documents/?intent=black-masterbatch#request-form"

relations:
  parent_content_id: "guide.black"
  related_content_ids:
    - "guide.black"
    - "product.black.bk020"
    - "product.black.bk030"
    - "product.black.bk040"
    - "quote.request"
    - "documents.request"

evidence:
  status: "grade-specific-tds"
  public_entity: "GE CHEMICAL & POLYMER GROUP CO., LTD"
  source_files:
    - "Cmp_Info/TDS--BK020.doc"
    - "Cmp_Info/TDS--BK025.doc"
    - "Cmp_Info/TDS--BK030.doc"
    - "Cmp_Info/TDS--BK035.doc"
    - "Cmp_Info/TDS--BK040.doc"
    - "product/BK020-产品页.md"
    - "product/BK040-产品页.md"
  public_claims: "Grade values follow the current BK TDS examples. Addition range is a starting recommendation. Food contact, price, MOQ and lead time are not product-line claims."

review:
  design_preview: "xuqiu/design-preview/film-packaging-page-v1"
  reviewed_at: "2026-11-18"
  approved_at: null
  implementation_note: "Application page for film and packaging. Visible copy is maintained in page-film-packaging.html; the package records route, SEO, hero, conversion and evidence scope."

import:
  target_environment: "production"
  idempotency_key: "product.black.film_packaging"
  create_status: "draft"
  body_h1_allowed: false
---

The Film and Packaging page is rendered by `page-film-packaging`. Its visible content is maintained in
`themes/mtm-b2b-masterbatch/templates/page-film-packaging.html`. The page routes film, bag and packaging
buyers to BK020 to BK040, the film checks that matter and a grade-specific RFQ.
