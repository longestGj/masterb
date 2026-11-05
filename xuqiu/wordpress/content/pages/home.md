---
content_id: "home"
content_type: "home"
schema_version: 1
locale: "en-US"
route_key: "home"
status: "review"
title: "Masterbatch Products"
primary_keyword: "masterbatch"
secondary_keywords:
  - "plastic masterbatch"
  - "black masterbatch"
  - "white masterbatch"
  - "color masterbatch"
  - "masterbatch for plastics"
  - "masterbatch applications"
  - "masterbatch RFQ"
  - "master batch"
  - "masterbatches"
  - "colour masterbatch"
  - "carbon black masterbatch"
  - "custom color masterbatch"
  - "masterbatch for blown film"
  - "masterbatch for injection molding"
  - "masterbatch for extrusion"
  - "masterbatch for recycled plastic"
  - "masterbatch color reference"
  - "masterbatch TDS"
  - "masterbatch document request"
  - "masterbatch supplier"
  - "masterbatch quotation"
search_intent: "commercial_investigation"
page_job: "Present black, white and color masterbatch product pathways for plastic processing buyers and guide product inquiries into an application-focused RFQ review."
product_family: "all"
body_format: "gutenberg-blocks-v1"
body_starts_at_heading: 1
h1_source: "body"

wp:
  object_type: "page"
  title: "Masterbatch Products"
  slug: "home"
  template: "page-home"
  status: "draft"
  comment_status: "closed"
  ping_status: "closed"
  noindex: true
  front_page: true

route:
  path: "/"
  canonical: "/"
  trailing_slash: true

seo:
  title: "Masterbatch Products for Plastic Processing | GE CHEMICAL"
  description: "Black, white and color masterbatch products for film, packaging, injection molding, extrusion and recycled plastics. Share your application requirements."
  robots: "noindex,nofollow"
  canonical_route_key: "home"
  open_graph_image_id: null
  structured_data:
    - "WebPage"

hero:
  eyebrow: "Black · White · Color Masterbatch"
  title: "Masterbatch Products for Plastic Processing"
  summary: "We review black, white and color plastic masterbatch inquiries for film blowing, packaging, injection molding, extrusion and recycled PE and PP applications. Send the resin, processing method, end product, target and current grade. We’ll check masterbatch product fit and document scope, then reply."
  image_id: null

conversion:
  primary_cta_id: "cta.general.rfq"
  secondary_cta_id: "cta.general.documents"
  form_key: "rfq_document_request"
  form_context: "rfq"

relations:
  parent_content_id: null
  related_content_ids:
    - "guide.black"
    - "guide.white"
    - "guide.color"
    - "quote.request"
    - "documents.request"
    - "resources.index"
    - "about.quality"

template_contract:
  required_sections:
    - "hero"
    - "products"
    - "applications"
    - "review-process"
    - "documents"
    - "about"
    - "resources"
    - "quote"
  render_h1_once: true
  render_body_from: "gutenberg-blocks-v1"

evidence:
  status: "approved-public-copy-only"
  public_entity: "GE CHEMICAL & POLYMER GROUP CO., LTD"
  source_files:
    - "xuqiu/MASTERBATCH_WEBSITE_CONTENT_STRUCTURE.md"
    - "xuqiu/COMPANY_PUBLIC_INFORMATION_DRAFT.md"
    - "Cmp_Info/LIMITED_PRD_BLACK_WHITE_COLOR_RFQ_CONTENT_GE_ONLY_DOCUMENT_REQUEST.md"
  grade_specific_values_published: false
  compliance_scope: "specific-tested-grades-or-samples-only"
  public_claims: "RFQ guidance, approved masterbatch supplier positioning and inquiry-process content only"

review:
  content_owner: "unassigned"
  seo_owner: "unassigned"
  evidence_owner: "unassigned"
  approved_at: null
  reviewed_at: "2026-11-05"
  next_review_at: null

import:
  target_environment: "staging"
  idempotency_key: "home"
  create_status: "draft"
  body_h1_allowed: true
  publish_blockers:
    - "Product guide and application pages are incomplete"
    - "RFQ and document request form submission workflows require approval"
    - "Company facts beyond masterbatch supplier positioning require approval"
    - "Privacy Policy requires final business and legal review"
---

<!-- wp:group {"tagName":"main","className":"mtm-home","layout":{"type":"default"}} -->
<main class="wp-block-group mtm-home">

	<!-- wp:group {"tagName":"section","anchor":"hero","className":"mtm-home-section mtm-home-hero","layout":{"type":"default"}} -->
	<section id="hero" class="wp-block-group mtm-home-section mtm-home-hero">
		<!-- wp:columns {"align":"wide","className":"mtm-home-shell mtm-home-hero__grid","verticalAlignment":"center"} -->
		<div class="wp-block-columns alignwide mtm-home-shell mtm-home-hero__grid are-vertically-aligned-center">
			<!-- wp:column {"verticalAlignment":"center","width":"58%"} -->
			<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:58%">
				<!-- wp:group {"className":"mtm-home-hero__copy","layout":{"type":"constrained"}} -->
				<div class="wp-block-group mtm-home-hero__copy">
					<!-- wp:paragraph {"className":"mtm-eyebrow mtm-home-hero__eyebrow"} -->
					<p class="mtm-eyebrow mtm-home-hero__eyebrow">Black &middot; White &middot; Color Masterbatch</p>
					<!-- /wp:paragraph -->

					<!-- wp:heading {"level":1,"className":"mtm-home-hero__title"} -->
					<h1 class="wp-block-heading mtm-home-hero__title">Masterbatch Products for Plastic Processing</h1>
					<!-- /wp:heading -->

					<!-- wp:paragraph {"className":"mtm-home-hero__summary"} -->
					<p class="mtm-home-hero__summary">We review black, white and color plastic masterbatch inquiries for film blowing, packaging, injection molding, extrusion and recycled PE and PP applications. Send the resin, processing method, end product, target and current grade. We&rsquo;ll check masterbatch product fit and document scope, then reply.</p>
					<!-- /wp:paragraph -->

					<!-- wp:buttons {"className":"mtm-home-hero__actions"} -->
					<div class="wp-block-buttons mtm-home-hero__actions">
						<!-- wp:button {"backgroundColor":"brass","textColor":"ink","className":"is-style-fill"} -->
						<div class="wp-block-button is-style-fill"><a class="wp-block-button__link has-ink-color has-brass-background-color has-text-color has-background wp-element-button" href="/request-a-quote/">Discuss Your Requirements</a></div>
						<!-- /wp:button -->

						<!-- wp:button {"className":"is-style-outline mtm-home-button-light"} -->
						<div class="wp-block-button is-style-outline mtm-home-button-light"><a class="wp-block-button__link wp-element-button" href="/masterbatch-guides/">Explore Masterbatch Products</a></div>
						<!-- /wp:button -->
					</div>
					<!-- /wp:buttons -->

					<!-- wp:paragraph {"className":"mtm-home-hero__note"} -->
					<p class="mtm-home-hero__note">For plastic processors, distributors and masterbatch buyers.</p>
					<!-- /wp:paragraph -->
				</div>
				<!-- /wp:group -->
			</div>
			<!-- /wp:column -->

			<!-- wp:column {"verticalAlignment":"center","width":"42%"} -->
			<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:42%">
				<!-- wp:group {"className":"mtm-home-hero-stack","layout":{"type":"default"}} -->
				<div class="wp-block-group mtm-home-hero-stack">
					<!-- wp:image {"sizeSlug":"full","className":"mtm-home-hero-photo"} -->
					<figure class="wp-block-image size-full mtm-home-hero-photo">
						<img src="/wp-content/themes/mtm-b2b-masterbatch/assets/images/home-factory-building.jpg" alt="Masterbatch factory building exterior" width="1600" height="1200" loading="eager" fetchpriority="high" decoding="async" />
						<figcaption class="wp-element-caption">Masterbatch factory building exterior</figcaption>
					</figure>
					<!-- /wp:image -->

					<!-- wp:image {"sizeSlug":"full","className":"mtm-home-hero-photo-inset"} -->
					<figure class="wp-block-image size-full mtm-home-hero-photo-inset">
						<img src="/wp-content/themes/mtm-b2b-masterbatch/assets/images/home-masterbatch-product.jpg" alt="Masterbatch product granules" width="800" height="800" loading="eager" decoding="async" />
						<figcaption class="wp-element-caption">Masterbatch product granules</figcaption>
					</figure>
					<!-- /wp:image -->
				</div>
				<!-- /wp:group -->
			</div>
			<!-- /wp:column -->
		</div>
		<!-- /wp:columns -->

	</section>
	<!-- /wp:group -->

	<!-- wp:group {"tagName":"section","anchor":"products","className":"mtm-home-section mtm-home-products","backgroundColor":"ink","textColor":"mist","layout":{"type":"default"}} -->
	<section id="products" class="wp-block-group mtm-home-section mtm-home-products has-mist-color has-text-color has-ink-background-color has-background">
		<!-- wp:group {"align":"wide","className":"mtm-home-shell","layout":{"type":"constrained","contentSize":"1120px"}} -->
		<div class="wp-block-group alignwide mtm-home-shell">
			<!-- wp:group {"className":"mtm-home-section-heading mtm-home-section-heading\u002d\u002dcenter","layout":{"type":"constrained","contentSize":"760px"}} -->
			<div class="wp-block-group mtm-home-section-heading mtm-home-section-heading--center">
				<!-- wp:paragraph {"className":"mtm-eyebrow"} -->
				<p class="mtm-eyebrow">Product pathways</p>
				<!-- /wp:paragraph -->

				<!-- wp:heading {"level":2} -->
				<h2 class="wp-block-heading">Start with a product family</h2>
				<!-- /wp:heading -->

				<!-- wp:paragraph -->
				<p>Pick the closest family and check what to send before we discuss a grade or document.</p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:group -->

			<!-- wp:columns {"className":"mtm-home-card-grid mtm-home-card-grid\u002d\u002dthree"} -->
			<div class="wp-block-columns mtm-home-card-grid mtm-home-card-grid--three">
				<!-- wp:column {"className":"mtm-home-card-column"} -->
				<div class="wp-block-column mtm-home-card-column">
					<!-- wp:group {"className":"mtm-home-card mtm-home-card\u002d\u002dblack mtm-home-card\u002d\u002ddark","layout":{"type":"constrained"}} -->
					<div class="wp-block-group mtm-home-card mtm-home-card--black mtm-home-card--dark">
						<!-- wp:paragraph {"className":"mtm-eyebrow"} -->
						<p class="mtm-eyebrow">Black Masterbatch</p>
						<!-- /wp:paragraph -->
						<!-- wp:heading {"level":3} -->
						<h3 class="wp-block-heading">Blackness, dispersion and resin</h3>
						<!-- /wp:heading -->
						<!-- wp:paragraph -->
						<p>Tell us the resin and process. Add the blackness target, dispersion needs, current grade and any quality issue.</p>
						<!-- /wp:paragraph -->
						<!-- wp:paragraph {"className":"mtm-home-card-link"} -->
						<p class="mtm-home-card-link"><a href="/masterbatch-guides/black-masterbatch/">View black masterbatch</a></p>
						<!-- /wp:paragraph -->
					</div>
					<!-- /wp:group -->
				</div>
				<!-- /wp:column -->

				<!-- wp:column {"className":"mtm-home-card-column"} -->
				<div class="wp-block-column mtm-home-card-column">
					<!-- wp:group {"className":"mtm-home-card mtm-home-card\u002d\u002dwhite mtm-home-card\u002d\u002ddark","layout":{"type":"constrained"}} -->
					<div class="wp-block-group mtm-home-card mtm-home-card--white mtm-home-card--dark">
						<!-- wp:paragraph {"className":"mtm-eyebrow"} -->
						<p class="mtm-eyebrow">White Masterbatch</p>
						<!-- /wp:paragraph -->
						<!-- wp:heading {"level":3} -->
						<h3 class="wp-block-heading">White, opacity and TiO2</h3>
						<!-- /wp:heading -->
						<!-- wp:paragraph -->
						<p>Send the resin and process, along with the opacity target, TiO2 context, end product and document requirements.</p>
						<!-- /wp:paragraph -->
						<!-- wp:paragraph {"className":"mtm-home-card-link"} -->
						<p class="mtm-home-card-link"><a href="/masterbatch-guides/white-masterbatch/">View white masterbatch</a></p>
						<!-- /wp:paragraph -->
					</div>
					<!-- /wp:group -->
				</div>
				<!-- /wp:column -->

				<!-- wp:column {"className":"mtm-home-card-column"} -->
				<div class="wp-block-column mtm-home-card-column">
					<!-- wp:group {"className":"mtm-home-card mtm-home-card\u002d\u002dcolor mtm-home-card\u002d\u002ddark","layout":{"type":"constrained"}} -->
					<div class="wp-block-group mtm-home-card mtm-home-card--color mtm-home-card--dark">
						<!-- wp:paragraph {"className":"mtm-eyebrow"} -->
						<p class="mtm-eyebrow">Color Masterbatch</p>
						<!-- /wp:paragraph -->
						<!-- wp:heading {"level":3} -->
						<h3 class="wp-block-heading">Color reference and tolerance</h3>
						<!-- /wp:heading -->
						<!-- wp:paragraph -->
						<p>Describe the resin and end product. Include the color reference and tolerance expectation, and say whether a sample discussion is needed.</p>
						<!-- /wp:paragraph -->
						<!-- wp:paragraph {"className":"mtm-home-card-link"} -->
						<p class="mtm-home-card-link"><a href="/masterbatch-guides/color-masterbatch/">View color masterbatch</a></p>
						<!-- /wp:paragraph -->
					</div>
					<!-- /wp:group -->
				</div>
				<!-- /wp:column -->
			</div>
			<!-- /wp:columns -->

		</div>
		<!-- /wp:group -->
	</section>
	<!-- /wp:group -->

	<!-- wp:group {"tagName":"section","anchor":"applications","className":"mtm-home-section mtm-home-applications","backgroundColor":"paper","layout":{"type":"default"}} -->
	<section id="applications" class="wp-block-group mtm-home-section mtm-home-applications has-paper-background-color has-background">
		<!-- wp:group {"align":"wide","className":"mtm-home-shell","layout":{"type":"constrained","contentSize":"1120px"}} -->
		<div class="wp-block-group alignwide mtm-home-shell">
			<!-- wp:group {"className":"mtm-home-section-heading mtm-home-section-heading\u002d\u002dcenter","layout":{"type":"constrained","contentSize":"760px"}} -->
			<div class="wp-block-group mtm-home-section-heading mtm-home-section-heading--center">
				<!-- wp:paragraph {"className":"mtm-eyebrow"} -->
				<p class="mtm-eyebrow">Masterbatch applications</p>
				<!-- /wp:paragraph -->

				<!-- wp:heading {"level":2} -->
				<h2 class="wp-block-heading">Where it will be used</h2>
				<!-- /wp:heading -->

				<!-- wp:paragraph -->
				<p>Masterbatch applications vary by end product. The film, molding, extrusion or recycled plastic you run changes what we ask. Pick the closest case.</p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:group -->

			<!-- wp:group {"className":"mtm-home-app-list","layout":{"type":"default"}} -->
			<div class="wp-block-group mtm-home-app-list">
				<!-- wp:group {"className":"mtm-home-app-row","layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"center"}} -->
				<div class="wp-block-group mtm-home-app-row is-layout-flex">
					<!-- wp:paragraph {"className":"mtm-home-app-row__number"} -->
					<p class="mtm-home-app-row__number">01</p>
					<!-- /wp:paragraph -->
					<!-- wp:heading {"level":3,"className":"mtm-home-app-row__title"} -->
					<h3 class="wp-block-heading mtm-home-app-row__title">Packaging film &amp; blown film</h3>
					<!-- /wp:heading -->
					<!-- wp:paragraph {"className":"mtm-home-app-row__desc"} -->
					<p class="mtm-home-app-row__desc">For blown film and packaging bags, include the film structure, thickness, appearance target and dispersion needs.</p>
					<!-- /wp:paragraph -->
				</div>
				<!-- /wp:group -->

				<!-- wp:group {"className":"mtm-home-app-row","layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"center"}} -->
				<div class="wp-block-group mtm-home-app-row is-layout-flex">
					<!-- wp:paragraph {"className":"mtm-home-app-row__number"} -->
					<p class="mtm-home-app-row__number">02</p>
					<!-- /wp:paragraph -->
					<!-- wp:heading {"level":3,"className":"mtm-home-app-row__title"} -->
					<h3 class="wp-block-heading mtm-home-app-row__title">Injection molding</h3>
					<!-- /wp:heading -->
					<!-- wp:paragraph {"className":"mtm-home-app-row__desc"} -->
					<p class="mtm-home-app-row__desc">Molded parts need the resin, part type, surface requirement, color target and any current problem.</p>
					<!-- /wp:paragraph -->
				</div>
				<!-- /wp:group -->

				<!-- wp:group {"className":"mtm-home-app-row","layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"center"}} -->
				<div class="wp-block-group mtm-home-app-row is-layout-flex">
					<!-- wp:paragraph {"className":"mtm-home-app-row__number"} -->
					<p class="mtm-home-app-row__number">03</p>
					<!-- /wp:paragraph -->
					<!-- wp:heading {"level":3,"className":"mtm-home-app-row__title"} -->
					<h3 class="wp-block-heading mtm-home-app-row__title">General extrusion</h3>
					<!-- /wp:heading -->
					<!-- wp:paragraph {"className":"mtm-home-app-row__desc"} -->
					<p class="mtm-home-app-row__desc">For extrusion, tell us the final product, base resin, processing conditions and target.</p>
					<!-- /wp:paragraph -->
				</div>
				<!-- /wp:group -->

				<!-- wp:group {"className":"mtm-home-app-row","layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"center"}} -->
				<div class="wp-block-group mtm-home-app-row is-layout-flex">
					<!-- wp:paragraph {"className":"mtm-home-app-row__number"} -->
					<p class="mtm-home-app-row__number">04</p>
					<!-- /wp:paragraph -->
					<!-- wp:heading {"level":3,"className":"mtm-home-app-row__title"} -->
					<h3 class="wp-block-heading mtm-home-app-row__title">Recycled PE/PP</h3>
					<!-- /wp:heading -->
					<!-- wp:paragraph {"className":"mtm-home-app-row__desc"} -->
					<p class="mtm-home-app-row__desc">With recycled PE or PP, note the feedstock variation, current issue and any control sample you can provide.</p>
					<!-- /wp:paragraph -->
				</div>
				<!-- /wp:group -->
			</div>
			<!-- /wp:group -->

		</div>
		<!-- /wp:group -->
	</section>
	<!-- /wp:group -->

	<!-- wp:group {"tagName":"section","anchor":"review-process","className":"mtm-home-section mtm-home-process","layout":{"type":"default"}} -->
	<section id="review-process" class="wp-block-group mtm-home-section mtm-home-process">
		<!-- wp:group {"align":"wide","className":"mtm-home-shell mtm-home-process__shell","layout":{"type":"constrained","contentSize":"1120px"}} -->
		<div class="wp-block-group alignwide mtm-home-shell mtm-home-process__shell">
			<!-- wp:group {"className":"mtm-home-section-heading","layout":{"type":"constrained","contentSize":"760px"}} -->
			<div class="wp-block-group mtm-home-section-heading">
				<!-- wp:paragraph {"className":"mtm-eyebrow"} -->
				<p class="mtm-eyebrow">How your inquiry is reviewed</p>
				<!-- /wp:paragraph -->

				<!-- wp:heading {"level":2} -->
				<h2 class="wp-block-heading">What happens next</h2>
				<!-- /wp:heading -->
			</div>
			<!-- /wp:group -->

			<!-- wp:columns {"className":"mtm-home-process-grid"} -->
			<div class="wp-block-columns mtm-home-process-grid">
				<!-- wp:column {"className":"mtm-home-card-column"} -->
				<div class="wp-block-column mtm-home-card-column">
					<!-- wp:group {"className":"mtm-home-process-step","layout":{"type":"constrained"}} -->
					<div class="wp-block-group mtm-home-process-step">
						<!-- wp:paragraph {"className":"mtm-home-step-number"} -->
						<p class="mtm-home-step-number">1</p>
						<!-- /wp:paragraph -->
						<!-- wp:heading {"level":3} -->
						<h3 class="wp-block-heading">Send the basics</h3>
						<!-- /wp:heading -->
						<!-- wp:paragraph -->
						<p>Start with the resin, process and end product.</p>
						<!-- /wp:paragraph -->
					</div>
					<!-- /wp:group -->
				</div>
				<!-- /wp:column -->

				<!-- wp:column {"className":"mtm-home-card-column"} -->
				<div class="wp-block-column mtm-home-card-column">
					<!-- wp:group {"className":"mtm-home-process-step","layout":{"type":"constrained"}} -->
					<div class="wp-block-group mtm-home-process-step">
						<!-- wp:paragraph {"className":"mtm-home-step-number"} -->
						<p class="mtm-home-step-number">2</p>
						<!-- /wp:paragraph -->
						<!-- wp:heading {"level":3} -->
						<h3 class="wp-block-heading">Add the target</h3>
						<!-- /wp:heading -->
						<!-- wp:paragraph -->
						<p>Add the appearance target, current issue, known grade and any documents you need.</p>
						<!-- /wp:paragraph -->
					</div>
					<!-- /wp:group -->
				</div>
				<!-- /wp:column -->

				<!-- wp:column {"className":"mtm-home-card-column"} -->
				<div class="wp-block-column mtm-home-card-column">
					<!-- wp:group {"className":"mtm-home-process-step","layout":{"type":"constrained"}} -->
					<div class="wp-block-group mtm-home-process-step">
						<!-- wp:paragraph {"className":"mtm-home-step-number"} -->
						<p class="mtm-home-step-number">3</p>
						<!-- /wp:paragraph -->
						<!-- wp:heading {"level":3} -->
						<h3 class="wp-block-heading">We check the request</h3>
						<!-- /wp:heading -->
						<!-- wp:paragraph -->
						<p>We look at the grade, application, country and document scope.</p>
						<!-- /wp:paragraph -->
					</div>
					<!-- /wp:group -->
				</div>
				<!-- /wp:column -->

				<!-- wp:column {"className":"mtm-home-card-column"} -->
				<div class="wp-block-column mtm-home-card-column">
					<!-- wp:group {"className":"mtm-home-process-step","layout":{"type":"constrained"}} -->
					<div class="wp-block-group mtm-home-process-step">
						<!-- wp:paragraph {"className":"mtm-home-step-number"} -->
						<p class="mtm-home-step-number">4</p>
						<!-- /wp:paragraph -->
						<!-- wp:heading {"level":3} -->
						<h3 class="wp-block-heading">We reply by email</h3>
						<!-- /wp:heading -->
						<!-- wp:paragraph -->
						<p>The email will explain the next suitable step.</p>
						<!-- /wp:paragraph -->
					</div>
					<!-- /wp:group -->
				</div>
				<!-- /wp:column -->
			</div>
			<!-- /wp:columns -->
		</div>
		<!-- /wp:group -->
	</section>
	<!-- /wp:group -->

	<!-- wp:group {"tagName":"section","anchor":"documents","className":"mtm-home-section mtm-home-documents","backgroundColor":"ink","textColor":"mist","layout":{"type":"default"}} -->
	<section id="documents" class="wp-block-group mtm-home-section mtm-home-documents has-mist-color has-text-color has-ink-background-color has-background">
		<!-- wp:columns {"align":"wide","className":"mtm-home-shell mtm-home-documents__grid","verticalAlignment":"center"} -->
		<div class="wp-block-columns alignwide mtm-home-shell mtm-home-documents__grid are-vertically-aligned-center">
			<!-- wp:column {"verticalAlignment":"center","width":"58%"} -->
			<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:58%">
				<!-- wp:paragraph {"className":"mtm-eyebrow"} -->
				<p class="mtm-eyebrow">Technical document review</p>
				<!-- /wp:paragraph -->

				<!-- wp:heading {"level":2} -->
				<h2 class="wp-block-heading">Technical documents are checked by grade</h2>
				<!-- /wp:heading -->

				<!-- wp:paragraph -->
				<p>Availability depends on the product grade, application, country and intended use. Send a document request and we&rsquo;ll check whether suitable files exist for that grade. If they do, we reply by email.</p>
				<!-- /wp:paragraph -->

				<!-- wp:buttons -->
				<div class="wp-block-buttons">
					<!-- wp:button {"backgroundColor":"brass","textColor":"ink"} -->
					<div class="wp-block-button"><a class="wp-block-button__link has-ink-color has-brass-background-color has-text-color has-background wp-element-button" href="/technical-documents/">Request Technical Documents</a></div>
					<!-- /wp:button -->
				</div>
				<!-- /wp:buttons -->
			</div>
			<!-- /wp:column -->

			<!-- wp:column {"verticalAlignment":"center","width":"42%"} -->
			<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:42%">
				<!-- wp:group {"className":"mtm-home-document-panel","layout":{"type":"constrained"}} -->
				<div class="wp-block-group mtm-home-document-panel">
					<!-- wp:paragraph {"className":"mtm-home-document-panel__label"} -->
					<p class="mtm-home-document-panel__label">Typical document requests</p>
					<!-- /wp:paragraph -->

					<!-- wp:group {"className":"mtm-home-document-types","layout":{"type":"flex","flexWrap":"wrap"}} -->
					<div class="wp-block-group mtm-home-document-types is-layout-flex">
						<!-- wp:paragraph {"className":"mtm-home-document-type"} -->
						<p class="mtm-home-document-type">TDS</p>
						<!-- /wp:paragraph -->
						<!-- wp:paragraph {"className":"mtm-home-document-type"} -->
						<p class="mtm-home-document-type">SDS / MSDS</p>
						<!-- /wp:paragraph -->
						<!-- wp:paragraph {"className":"mtm-home-document-type"} -->
						<p class="mtm-home-document-type">COA</p>
						<!-- /wp:paragraph -->
						<!-- wp:paragraph {"className":"mtm-home-document-type"} -->
						<p class="mtm-home-document-type">RoHS-related</p>
						<!-- /wp:paragraph -->
						<!-- wp:paragraph {"className":"mtm-home-document-type"} -->
						<p class="mtm-home-document-type">FDA-related</p>
						<!-- /wp:paragraph -->
					</div>
					<!-- /wp:group -->

					<!-- wp:paragraph {"className":"mtm-home-document-caption"} -->
					<p class="mtm-home-document-caption">Not every product has every document. Compliance-related documents, if available, apply only to the specific tested grade or sample.</p>
					<!-- /wp:paragraph -->
				</div>
				<!-- /wp:group -->
			</div>
			<!-- /wp:column -->
		</div>
		<!-- /wp:columns -->

	</section>
	<!-- /wp:group -->

	<!-- wp:group {"tagName":"section","anchor":"about","className":"mtm-home-section mtm-home-about","layout":{"type":"default"}} -->
	<section id="about" class="wp-block-group mtm-home-section mtm-home-about">
		<!-- wp:columns {"align":"wide","className":"mtm-home-shell mtm-home-about__grid","verticalAlignment":"center"} -->
		<div class="wp-block-columns alignwide mtm-home-shell mtm-home-about__grid are-vertically-aligned-center">
			<!-- wp:column {"verticalAlignment":"center","width":"52%"} -->
			<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:52%">
				<!-- wp:paragraph {"className":"mtm-eyebrow"} -->
				<p class="mtm-eyebrow">About GE</p>
				<!-- /wp:paragraph -->

				<!-- wp:heading {"level":2} -->
				<h2 class="wp-block-heading">A masterbatch supplier focused on application fit</h2>
				<!-- /wp:heading -->

				<!-- wp:paragraph -->
				<p>GE CHEMICAL &amp; POLYMER GROUP CO., LTD is a masterbatch supplier for black, white and color inquiries. We begin with the buyer&rsquo;s base resin, processing method and end product, then review which grade and documents may fit.</p>
				<!-- /wp:paragraph -->

				<!-- wp:paragraph {"className":"mtm-home-about__link"} -->
				<p class="mtm-home-about__link"><a href="/about-quality/">About GE and Quality</a></p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:column -->

			<!-- wp:column {"verticalAlignment":"center","width":"48%"} -->
			<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:48%">
				<!-- wp:group {"className":"mtm-home-principles","layout":{"type":"default"}} -->
				<div class="wp-block-group mtm-home-principles">
					<!-- wp:group {"className":"mtm-home-principle","layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"center"}} -->
					<div class="wp-block-group mtm-home-principle is-layout-flex">
						<!-- wp:paragraph {"className":"mtm-home-principle__mark"} -->
						<p class="mtm-home-principle__mark">01</p>
						<!-- /wp:paragraph -->
						<!-- wp:paragraph -->
						<p>Black, white and color product families</p>
						<!-- /wp:paragraph -->
					</div>
					<!-- /wp:group -->

					<!-- wp:group {"className":"mtm-home-principle","layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"center"}} -->
					<div class="wp-block-group mtm-home-principle is-layout-flex">
						<!-- wp:paragraph {"className":"mtm-home-principle__mark"} -->
						<p class="mtm-home-principle__mark">02</p>
						<!-- /wp:paragraph -->
						<!-- wp:paragraph -->
						<p>Resin, process and end product before grade selection</p>
						<!-- /wp:paragraph -->
					</div>
					<!-- /wp:group -->

					<!-- wp:group {"className":"mtm-home-principle","layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"center"}} -->
					<div class="wp-block-group mtm-home-principle is-layout-flex">
						<!-- wp:paragraph {"className":"mtm-home-principle__mark"} -->
						<p class="mtm-home-principle__mark">03</p>
						<!-- /wp:paragraph -->
						<!-- wp:paragraph -->
						<p>Grade-specific document review</p>
						<!-- /wp:paragraph -->
					</div>
					<!-- /wp:group -->
				</div>
				<!-- /wp:group -->
			</div>
			<!-- /wp:column -->
		</div>
		<!-- /wp:columns -->

		<!-- wp:columns {"align":"wide","className":"mtm-home-shell mtm-home-about-gallery"} -->
		<div class="wp-block-columns alignwide mtm-home-shell mtm-home-about-gallery">
			<!-- wp:column -->
			<div class="wp-block-column">
				<!-- wp:image {"sizeSlug":"full","className":"mtm-home-about-photo"} -->
				<figure class="wp-block-image size-full mtm-home-about-photo">
					<img src="/wp-content/themes/mtm-b2b-masterbatch/assets/images/home-workshop-equipment.jpg" alt="Masterbatch workshop equipment" width="1200" height="900" loading="lazy" decoding="async" />
					<figcaption class="wp-element-caption">Workshop equipment</figcaption>
				</figure>
				<!-- /wp:image -->
			</div>
			<!-- /wp:column -->

			<!-- wp:column -->
			<div class="wp-block-column">
				<!-- wp:image {"sizeSlug":"full","className":"mtm-home-about-photo"} -->
				<figure class="wp-block-image size-full mtm-home-about-photo">
					<img src="/wp-content/themes/mtm-b2b-masterbatch/assets/images/home-masterbatch-packaging.jpg" alt="Bagged masterbatch on a pallet" width="506" height="675" loading="lazy" decoding="async" />
					<figcaption class="wp-element-caption">Bagged masterbatch on a pallet</figcaption>
				</figure>
				<!-- /wp:image -->
			</div>
			<!-- /wp:column -->

			<!-- wp:column -->
			<div class="wp-block-column">
				<!-- wp:image {"sizeSlug":"full","className":"mtm-home-about-photo"} -->
				<figure class="wp-block-image size-full mtm-home-about-photo">
					<img src="/wp-content/themes/mtm-b2b-masterbatch/assets/images/masterbatch-palletized-shipment.jpg" alt="Wrapped masterbatch pallets ready for shipment" width="638" height="716" loading="lazy" decoding="async" />
					<figcaption class="wp-element-caption">Wrapped pallets ready for shipment</figcaption>
				</figure>
				<!-- /wp:image -->
			</div>
			<!-- /wp:column -->
		</div>
		<!-- /wp:columns -->
	</section>
	<!-- /wp:group -->

	<!-- wp:group {"tagName":"section","anchor":"resources","className":"mtm-home-section mtm-home-resources","backgroundColor":"paper","layout":{"type":"default"}} -->
	<section id="resources" class="wp-block-group mtm-home-section mtm-home-resources has-paper-background-color has-background">
		<!-- wp:group {"align":"wide","className":"mtm-home-shell","layout":{"type":"constrained","contentSize":"1120px"}} -->
		<div class="wp-block-group alignwide mtm-home-shell">
			<!-- wp:columns {"verticalAlignment":"bottom","className":"mtm-home-resources__intro"} -->
			<div class="wp-block-columns mtm-home-resources__intro are-vertically-aligned-bottom">
				<!-- wp:column {"verticalAlignment":"bottom","width":"68%"} -->
				<div class="wp-block-column is-vertically-aligned-bottom" style="flex-basis:68%">
					<!-- wp:group {"className":"mtm-home-section-heading","layout":{"type":"constrained","contentSize":"760px"}} -->
					<div class="wp-block-group mtm-home-section-heading">
						<!-- wp:paragraph {"className":"mtm-eyebrow"} -->
						<p class="mtm-eyebrow">Buyer resources</p>
						<!-- /wp:paragraph -->

						<!-- wp:heading {"level":2} -->
				<h2 class="wp-block-heading">Read before an RFQ</h2>
						<!-- /wp:heading -->

						<!-- wp:paragraph -->
				<p>These guides cover product basics, selection details and document review.</p>
						<!-- /wp:paragraph -->
					</div>
					<!-- /wp:group -->
				</div>
				<!-- /wp:column -->

				<!-- wp:column {"verticalAlignment":"bottom","width":"32%"} -->
				<div class="wp-block-column is-vertically-aligned-bottom" style="flex-basis:32%">
					<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"right"}} -->
					<div class="wp-block-buttons">
						<!-- wp:button {"className":"is-style-outline"} -->
						<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="/resources/">Explore Resources</a></div>
						<!-- /wp:button -->
					</div>
					<!-- /wp:buttons -->
				</div>
				<!-- /wp:column -->
			</div>
			<!-- /wp:columns -->

			<!-- wp:columns {"className":"mtm-home-resource-grid"} -->
			<div class="wp-block-columns mtm-home-resource-grid">
				<!-- wp:column {"className":"mtm-home-card-column"} -->
				<div class="wp-block-column mtm-home-card-column">
					<!-- wp:group {"className":"mtm-home-resource-card","layout":{"type":"constrained"}} -->
					<div class="wp-block-group mtm-home-resource-card">
						<!-- wp:paragraph {"className":"mtm-home-resource-card__index"} -->
						<p class="mtm-home-resource-card__index">01</p>
						<!-- /wp:paragraph -->
						<!-- wp:heading {"level":3} -->
						<h3 class="wp-block-heading">Masterbatch basics</h3>
						<!-- /wp:heading -->
						<!-- wp:paragraph -->
						<p>Definitions, composition, carrier context and product classifications.</p>
						<!-- /wp:paragraph -->
					</div>
					<!-- /wp:group -->
				</div>
				<!-- /wp:column -->

				<!-- wp:column {"className":"mtm-home-card-column"} -->
				<div class="wp-block-column mtm-home-card-column">
					<!-- wp:group {"className":"mtm-home-resource-card","layout":{"type":"constrained"}} -->
					<div class="wp-block-group mtm-home-resource-card">
						<!-- wp:paragraph {"className":"mtm-home-resource-card__index"} -->
						<p class="mtm-home-resource-card__index">02</p>
						<!-- /wp:paragraph -->
						<!-- wp:heading {"level":3} -->
						<h3 class="wp-block-heading">Selection and applications</h3>
						<!-- /wp:heading -->
						<!-- wp:paragraph -->
						<p>Resin, process, end product and target requirement questions.</p>
						<!-- /wp:paragraph -->
					</div>
					<!-- /wp:group -->
				</div>
				<!-- /wp:column -->

				<!-- wp:column {"className":"mtm-home-card-column"} -->
				<div class="wp-block-column mtm-home-card-column">
					<!-- wp:group {"className":"mtm-home-resource-card","layout":{"type":"constrained"}} -->
					<div class="wp-block-group mtm-home-resource-card">
						<!-- wp:paragraph {"className":"mtm-home-resource-card__index"} -->
						<p class="mtm-home-resource-card__index">03</p>
						<!-- /wp:paragraph -->
						<!-- wp:heading {"level":3} -->
						<h3 class="wp-block-heading">RFQ preparation and documents</h3>
						<!-- /wp:heading -->
						<!-- wp:paragraph -->
						<p>Inquiry preparation, document meanings and grade-specific review.</p>
						<!-- /wp:paragraph -->
					</div>
					<!-- /wp:group -->
				</div>
				<!-- /wp:column -->
			</div>
			<!-- /wp:columns -->

			<!-- wp:group {"className":"mtm-home-faq","layout":{"type":"constrained","contentSize":"920px"}} -->
			<div class="wp-block-group mtm-home-faq">
				<!-- wp:paragraph {"className":"mtm-eyebrow"} -->
				<p class="mtm-eyebrow">Buyer FAQ</p>
				<!-- /wp:paragraph -->

				<!-- wp:heading {"level":2} -->
				<h2 class="wp-block-heading">Questions before you contact us</h2>
				<!-- /wp:heading -->

				<!-- wp:group {"className":"mtm-home-faq__item","layout":{"type":"default"}} -->
				<div class="wp-block-group mtm-home-faq__item">
					<!-- wp:heading {"level":3} -->
					<h3 class="wp-block-heading">What can I send?</h3>
					<!-- /wp:heading -->
					<!-- wp:paragraph -->
					<p>We review black, white and color masterbatch inquiries for plastic processing.</p>
					<!-- /wp:paragraph -->
				</div>
				<!-- /wp:group -->

				<!-- wp:group {"className":"mtm-home-faq__item","layout":{"type":"default"}} -->
				<div class="wp-block-group mtm-home-faq__item">
					<!-- wp:heading {"level":3} -->
					<h3 class="wp-block-heading">Which details help with an RFQ?</h3>
					<!-- /wp:heading -->
					<!-- wp:paragraph -->
					<p>A complete masterbatch RFQ includes the base resin, processing method, end product, appearance or performance target, current issue, known grade, quantity and document needs.</p>
					<!-- /wp:paragraph -->
				</div>
				<!-- /wp:group -->

				<!-- wp:group {"className":"mtm-home-faq__item","layout":{"type":"default"}} -->
				<div class="wp-block-group mtm-home-faq__item">
					<!-- wp:heading {"level":3} -->
					<h3 class="wp-block-heading">Should I choose a grade first?</h3>
					<!-- /wp:heading -->
					<!-- wp:paragraph -->
					<p>No. Share your resin, application and current requirement. A known grade or replacement target helps, but it is not required to start the review.</p>
					<!-- /wp:paragraph -->
				</div>
				<!-- /wp:group -->

				<!-- wp:group {"className":"mtm-home-faq__item","layout":{"type":"default"}} -->
				<div class="wp-block-group mtm-home-faq__item">
					<!-- wp:heading {"level":3} -->
					<h3 class="wp-block-heading">How do I ask for TDS, SDS/MSDS or COA?</h3>
					<!-- /wp:heading -->
					<!-- wp:paragraph -->
					<p>Yes. Send the request by form. We check the product grade, application and document scope before replying by email.</p>
					<!-- /wp:paragraph -->
				</div>
				<!-- /wp:group -->

				<!-- wp:group {"className":"mtm-home-faq__item","layout":{"type":"default"}} -->
				<div class="wp-block-group mtm-home-faq__item">
					<!-- wp:heading {"level":3} -->
					<h3 class="wp-block-heading">Does one document cover every grade?</h3>
					<!-- /wp:heading -->
					<!-- wp:paragraph -->
					<p>No. Technical and compliance-related documents relate to the product, grade or sample they describe.</p>
					<!-- /wp:paragraph -->
				</div>
				<!-- /wp:group -->
			</div>
			<!-- /wp:group -->
		</div>
		<!-- /wp:group -->
	</section>
	<!-- /wp:group -->

	<!-- wp:group {"tagName":"section","anchor":"quote","className":"mtm-home-section mtm-home-final-cta","layout":{"type":"default"}} -->
	<section id="quote" class="wp-block-group mtm-home-section mtm-home-final-cta">
		<!-- wp:group {"align":"wide","className":"mtm-home-shell mtm-home-final-cta__panel","backgroundColor":"brass","textColor":"ink","layout":{"type":"constrained","contentSize":"1120px"}} -->
		<div class="wp-block-group alignwide mtm-home-shell mtm-home-final-cta__panel has-ink-color has-brass-background-color has-text-color has-background">
			<!-- wp:group {"className":"mtm-home-final-cta__copy","layout":{"type":"constrained","contentSize":"760px"}} -->
			<div class="wp-block-group mtm-home-final-cta__copy">
				<!-- wp:paragraph {"className":"mtm-eyebrow"} -->
				<p class="mtm-eyebrow">Next step</p>
				<!-- /wp:paragraph -->

				<!-- wp:heading {"level":2} -->
				<h2 class="wp-block-heading">Send us the job details</h2>
				<!-- /wp:heading -->

				<!-- wp:paragraph -->
				<p>Send the resin, process, end product, target, current grade and any masterbatch RFQ, quotation or document request. We will review the product and document scope.</p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:group -->

			<!-- wp:buttons {"className":"mtm-home-final-cta__actions","layout":{"type":"flex","justifyContent":"center","flexWrap":"wrap"}} -->
			<div class="wp-block-buttons mtm-home-final-cta__actions">
				<!-- wp:button {"backgroundColor":"ink","textColor":"white"} -->
				<div class="wp-block-button"><a class="wp-block-button__link has-white-color has-ink-background-color has-text-color has-background wp-element-button" href="/request-a-quote/">Discuss Your Requirements</a></div>
				<!-- /wp:button -->

				<!-- wp:button {"className":"is-style-outline mtm-home-button-dark"} -->
				<div class="wp-block-button is-style-outline mtm-home-button-dark"><a class="wp-block-button__link wp-element-button" href="/technical-documents/">Request Technical Documents</a></div>
				<!-- /wp:button -->
			</div>
			<!-- /wp:buttons -->
		</div>
		<!-- /wp:group -->
	</section>
	<!-- /wp:group -->

</main>
<!-- /wp:group -->
