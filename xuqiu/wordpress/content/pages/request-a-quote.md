---
content_id: "quote.request"
content_type: "quote_request"
schema_version: 1
locale: "en-US"
route_key: "quote.request"
status: "review"
title: "Request a Masterbatch Quote"
primary_keyword: "masterbatch quote"
search_intent: "transactional"
page_job: "Collect a complete masterbatch RFQ in one place so the team can review product grade, application and document scope before replying."
product_family: "all"
body_format: "markdown-portable-v1"
body_starts_at_heading: 2
h1_source: "hero.title"

wp:
  object_type: "page"
  title: "Request a Masterbatch Quote"
  slug: "request-a-quote"
  template: "page-request-a-quote"
  status: "draft"
  comment_status: "closed"
  ping_status: "closed"
  noindex: true

route:
  path: "/request-a-quote/"
  canonical: "/request-a-quote/"
  trailing_slash: true

seo:
  title: "Request a Masterbatch Quote | GE CHEMICAL"
  description: "Send a masterbatch RFQ with resin, application, processing method, target requirement, quantity and document needs for manual review by email."
  robots: "index,follow"
  canonical_route_key: "quote.request"
  open_graph_image_id: null
  structured_data:
    - "WebPage"
    - "BreadcrumbList"

hero:
  eyebrow: "Request a Quote"
  title: "Request a masterbatch quote."
  summary: "Request a quote with your resin, process, end product and target. We review the application before replying by email."
  image_id: null

conversion:
  primary_cta_id: "cta.quote.submit"
  secondary_cta_id: "cta.quote.documents"
  form_key: "rfq_document_request"
  form_context: "rfq"

relations:
  parent_content_id: null
  related_content_ids:
    - "resources.index"
    - "resource.rfq_checklist"
    - "documents.request"
    - "faq"

evidence:
  status: "buyer-guidance-only"
  public_entity: "GE CHEMICAL & POLYMER GROUP CO., LTD"
  source_files:
    - "xuqiu/MASTERBATCH_WEBSITE_CONTENT_STRUCTURE.md"
    - "色母粒知识库/05_询盘与外贸/09_产品询盘需要问什么.md"
  public_claims: "RFQ preparation and review process only. No price, MOQ, lead time, payment or document-availability commitment."

review:
  content_owner: "unassigned"
  seo_owner: "unassigned"
  evidence_owner: "unassigned"
  reviewed_at: "2026-11-17"
  approved_at: null
  implementation_note: "Package reconstructed from the production Page 60 metadata. Visible RFQ copy and form are maintained in the page-request-a-quote template and the RFQ MU Plugin. Production is publish/index; the local package intentionally keeps draft status and noindex as the importer safety default."

import:
  target_environment: "production"
  idempotency_key: "quote.request"
  create_status: "draft"
  body_h1_allowed: false
---

The Request a Quote page is rendered by `page-request-a-quote`. Its visible copy and the RFQ form
are maintained in `themes/mtm-b2b-masterbatch/templates/page-request-a-quote.html` and
`mu-plugins/mb-rfq-submissions.php`; the production body stores only a short placeholder paragraph.
This package records the page route, SEO fields, hero copy and conversion context for local reference.
