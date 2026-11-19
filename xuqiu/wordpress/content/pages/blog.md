---
content_id: "blog.index"
content_type: "blog_index"
schema_version: 1
locale: "en-US"
route_key: "blog.index"
status: "review"
title: "Blog"
primary_keyword: "masterbatch guides"
search_intent: "informational"
page_job: "Route buyers into masterbatch selection, troubleshooting and supplier-review articles."
product_family: "all"
body_format: "markdown-portable-v1"
body_starts_at_heading: 2
h1_source: "hero.title"

wp:
  object_type: "page"
  title: "Blog"
  slug: "blog"
  template: ""
  status: "draft"
  comment_status: "closed"
  ping_status: "closed"
  noindex: true

route:
  path: "/blog/"
  canonical: "/blog/"
  trailing_slash: true

seo:
  title: "Masterbatch Guides and Buyer Articles | GE CHEMICAL"
  description: "Read masterbatch selection, troubleshooting and supplier review guides for plastic processing buyers, with practical checks for resin, film and documents."
  robots: "index,follow"
  canonical_route_key: "blog.index"
  open_graph_image_id: null
  structured_data:
    - "CollectionPage"
    - "BreadcrumbList"

hero:
  title: "Masterbatch guides for better buying decisions."
  summary: "Read practical notes on material selection, supplier review and production troubleshooting before the next quote or trial."
  image_id: null

relations:
  parent_content_id: null
  related_content_ids:
    - "resources.index"
    - "faq"
    - "quote.request"

evidence:
  status: "buyer-guidance-only"
  public_entity: "GE CHEMICAL & POLYMER GROUP CO., LTD"
  source_files:
    - "xuqiu/wordpress/content/posts/manifest.json"
  public_claims: "Article index only. Individual articles keep their own evidence boundaries."

review:
  content_owner: "unassigned"
  seo_owner: "unassigned"
  evidence_owner: "unassigned"
  reviewed_at: "2026-11-17"
  approved_at: null
  implementation_note: "Package reconstructed from the production Page 132 metadata. Page 132 is the WordPress posts page; there is no page template. Production is publish/index; the local package intentionally keeps draft status and noindex as the importer safety default."

import:
  target_environment: "production"
  idempotency_key: "blog.index"
  create_status: "draft"
  body_h1_allowed: false
---

The `/blog/` page is the WordPress posts page (`page_for_posts` = 132) and has no page template of
its own. Post cards and pagination are rendered by the blog archive template; individual article
content is stored in `content/posts/` and `content/posts/manifest.json`.
