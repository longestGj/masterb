---
content_id: "about.quality"
content_type: "about_quality"
schema_version: 1
locale: "en-US"
route_key: "about.quality"
status: "review"
title: "About / Quality"
primary_keyword: "masterbatch company"
search_intent: "commercial_investigation"
page_job: "Explain the approved company scope and how masterbatch inquiries and technical documents are reviewed, without unverified scale or compliance claims."
product_family: "all"
body_format: "markdown-portable-v1"
body_starts_at_heading: 2
h1_source: "hero.title"

wp:
  object_type: "page"
  title: "About / Quality"
  slug: "about-quality"
  template: "page-about-quality"
  status: "draft"
  comment_status: "closed"
  ping_status: "closed"
  noindex: true

route:
  path: "/about-quality/"
  canonical: "/about-quality/"
  trailing_slash: true

seo:
  title: "About GE Chemical | Masterbatch Quality & Review"
  description: "How GE CHEMICAL reviews black and desiccant masterbatch inquiries by exact grade and application. Documents are handled by request and review."
  robots: "index,follow"
  canonical_route_key: "about.quality"
  open_graph_image_id: null
  structured_data:
    - "WebPage"
    - "BreadcrumbList"

hero:
  eyebrow: "About / Quality"
  title: "About GE Chemical and masterbatch review."
  summary: "GE CHEMICAL & POLYMER GROUP CO., LTD reviews black and desiccant masterbatch inquiries for plastic processing."
  image_id: null

conversion:
  primary_cta_id: "cta.about.rfq"
  secondary_cta_id: "cta.about.documents"

relations:
  parent_content_id: null
  related_content_ids:
    - "guide.black"
    - "product.desiccant.index"
    - "quote.request"
    - "documents.request"

evidence:
  status: "approved-company-facts"
  public_entity: "GE CHEMICAL & POLYMER GROUP CO., LTD"
  source_files:
    - "xuqiu/COMPANY_PUBLIC_INFORMATION_DRAFT.md"
    - "色母粒知识库/README.md"
  public_claims: "Company facts follow the approved public-information draft. Grade-specific parameters, certifications and compliance conclusions remain document- and application-specific."

review:
  content_owner: "unassigned"
  seo_owner: "unassigned"
  evidence_owner: "unassigned"
  reviewed_at: "2026-11-17"
  approved_at: null
  implementation_note: "Package reconstructed from the production Page 66 metadata. Visible About / Quality copy is maintained in the page-about-quality template. Production is publish/index; the local package intentionally keeps draft status and noindex as the importer safety default."

import:
  target_environment: "production"
  idempotency_key: "about.quality"
  create_status: "draft"
  body_h1_allowed: false
---

The About / Quality page is rendered by `page-about-quality`. Its visible copy is maintained in
`themes/mtm-b2b-masterbatch/templates/page-about-quality.html`; the production body stores only a
short placeholder paragraph. This package records the page route, SEO fields, hero copy and
conversion context for local reference.
