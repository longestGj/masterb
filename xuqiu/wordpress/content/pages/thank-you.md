---
content_id: "page.thank_you"
content_type: "utility_page"
schema_version: 1
locale: "en-US"
route_key: "page.thank_you"
status: "published"
title: "Thank You"
primary_keyword: ""
secondary_keywords: []
search_intent: "transactional_confirmation"
page_job: "Confirm that a form submission was received, set expectations for manual review, and offer useful next links."
product_family: "black"
body_format: "template-rendered-v1"
h1_source: "template:thank-you"

wp:
  object_type: "page"
  title: "Thank You"
  slug: "thank-you"
  parent_slug: ""
  parent_title: ""
  parent_required: false
  template: "page-thank-you"
  status: "publish"
  comment_status: "closed"
  ping_status: "closed"
  noindex: true

route:
  path: "/thank-you/"
  canonical: "/thank-you/"
  trailing_slash: true
  breadcrumb: []

seo:
  title: "Thank You | GE CHEMICAL"
  description: "Your request has been received. The team reviews the grade, application and document scope, then replies by email."
  robots: "noindex,nofollow"
  canonical_route_key: "page.thank_you"
  noindex_reason: "Transactional confirmation page; it must not compete in search or enter the XML sitemap."
  structured_data:
    - "WebPage"

hero:
  title: "Thank you. Your request is with our team."
  summary: "We have received your request. The team reviews the product grade, application, quantity and document scope, then replies by email."

conversion:
  primary_action: "Back to Black Masterbatch"
  primary_target: "/products/black-masterbatch/"
  secondary_action: "View technical documents"
  secondary_target: "/technical-documents/"

relations:
  related_content_ids:
    - "quote.request"
    - "documents.request"
    - "guide.black"

evidence:
  status: "form-confirmation"
  public_entity: "GE CHEMICAL & POLYMER GROUP CO., LTD"
  public_claims: "Confirms receipt only. Does not promise price, sample, lead time, document release or compliance approval."

review:
  design_preview: "xuqiu/design-preview/thank-you-page-v1"
  reviewed_at: "2026-11-20"
  approved_at: "2026-11-20"
  implementation_note: "Noindex transactional page. The RFQ handler redirects successful submissions here; the page is not linked from navigation."

import:
  target_environment: "production"
  idempotency_key: "page.thank_you"
  create_status: "publish"
  body_h1_allowed: false
---

The Thank You page is rendered by `page-thank-you`. Its visible content is maintained in
`themes/mtm-b2b-masterbatch/templates/page-thank-you.html`. The RFQ handler redirects successful
submissions here; the page is intentionally noindex and is not part of the public navigation.
