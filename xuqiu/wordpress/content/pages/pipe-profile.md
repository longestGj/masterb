---
content_id: "product.black.pipe_profile"
content_type: "product_application"
schema_version: 1
locale: "en-US"
route_key: "products.black.pipe_profile"
status: "published"
title: "Black Masterbatch for Pipe and Profile Extrusion"
primary_keyword: "black masterbatch for pipe"
secondary_keywords:
  - "black masterbatch for HDPE pipe"
  - "black masterbatch for profile extrusion"
  - "carbon black masterbatch for pipe"
  - "black masterbatch for conduit"
search_intent: "commercial_investigation"
page_job: "Route HDPE pipe, conduit and profile buyers to the BK020 to BK040 grades, the checks that matter and a grade-specific RFQ."
product_family: "black"
body_format: "template-rendered-v1"
h1_source: "template:pipe-profile"

wp:
  object_type: "page"
  title: "Black Masterbatch for Pipe and Profile Extrusion"
  slug: "pipe-profile"
  parent_slug: "black-masterbatch"
  parent_title: "Black Masterbatch"
  parent_required: true
  template: "page-pipe-profile"
  status: "publish"
  comment_status: "closed"
  ping_status: "closed"
  noindex: false

route:
  path: "/products/black-masterbatch/pipe-profile/"
  canonical: "/products/black-masterbatch/pipe-profile/"
  trailing_slash: true
  breadcrumb:
    - "Products"
    - "Black masterbatch"
    - "Pipe and profile"

seo:
  title: "Black Masterbatch for Pipe & Profile | GE CHEMICAL"
  description: "Black masterbatch for HDPE pipe, conduit and profile extrusion. Compare BK020 to BK040 by carbon black, filler, carrier and trial result."
  robots: "index,follow"
  canonical_route_key: "products.black.pipe_profile"
  open_graph_image: "assets/images/pipe-profile-hero.webp"
  structured_data:
    - "WebPage"
    - "BreadcrumbList"
    - "FAQPage"

hero:
  title: "Black Masterbatch for Pipe and Profile Extrusion"
  summary: "Five BK grades from 20% to 40% carbon black for HDPE pipe, conduit and profile extrusion. Share the resin, dimensions, surface target and service conditions for grade review."
  image: "assets/images/pipe-profile-hero.webp"

conversion:
  primary_action: "Request a pipe masterbatch quote"
  primary_target: "/request-a-quote/?intent=black-masterbatch&source=pipe-profile-page"
  secondary_action: "Compare BK grades"
  secondary_target: "#grades"

document_cta:
  label: "Request pipe grade TDS"
  target: "/technical-documents/?intent=black-masterbatch#request-form"

relations:
  parent_content_id: "guide.black"
  related_content_ids:
    - "guide.black"
    - "product.black.bk020"
    - "product.black.bk030"
    - "product.black.bk040"
    - "product.black.film_packaging"
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
  public_claims: "Grade values follow the current BK TDS examples. Addition range is a starting recommendation. UV, pressure-pipe, WRAS, NSF, food contact, price, MOQ and lead time are not product-line claims."

review:
  design_preview: "xuqiu/design-preview/pipe-profile-page-v1"
  reviewed_at: "2026-11-23"
  approved_at: "2026-11-23"
  implementation_note: "Application page for pipe and profile. Visible copy is maintained in page-pipe-profile.html; the package records route, SEO, hero, conversion and evidence scope."

import:
  target_environment: "production"
  idempotency_key: "product.black.pipe_profile"
  create_status: "publish"
  body_h1_allowed: false
---

The Pipe and Profile page is rendered by `page-pipe-profile`. Its visible content is maintained in
`themes/mtm-b2b-masterbatch/templates/page-pipe-profile.html`. The page routes HDPE pipe, conduit and
profile buyers to BK020 to BK040, the checks that matter and a grade-specific RFQ.
