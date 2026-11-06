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
					<p class="mtm-eyebrow mtm-home-hero__eyebrow">Material systems / Issue 01</p>
					<!-- /wp:paragraph -->

					<!-- wp:heading {"level":1,"className":"mtm-home-hero__title"} -->
					<h1 class="wp-block-heading mtm-home-hero__title">Masterbatch, tuned to the line.</h1>
					<!-- /wp:heading -->

					<!-- wp:paragraph {"className":"mtm-home-hero__summary"} -->
					<p class="mtm-home-hero__summary">Black, white and color systems for film, packaging, molding and extrusion, backed by a conversation about resin, process and the result you need.</p>
					<!-- /wp:paragraph -->

					<!-- wp:buttons {"className":"mtm-home-hero__actions"} -->
					<div class="wp-block-buttons mtm-home-hero__actions">
						<!-- wp:button {"backgroundColor":"brass","textColor":"ink","className":"is-style-fill"} -->
						<div class="wp-block-button is-style-fill"><a class="wp-block-button__link has-ink-color has-brass-background-color has-text-color has-background wp-element-button" href="/request-a-quote/">Build your RFQ</a></div>
						<!-- /wp:button -->

						<!-- wp:button {"className":"is-style-outline mtm-home-button-light"} -->
						<div class="wp-block-button is-style-outline mtm-home-button-light"><a class="wp-block-button__link wp-element-button" href="/masterbatch-guides/">See material routes</a></div>
						<!-- /wp:button -->
					</div>
					<!-- /wp:buttons -->

					<!-- wp:group {"className":"mtm-home-hero__specs","layout":{"type":"flex","flexWrap":"wrap"}} -->
					<div class="wp-block-group mtm-home-hero__specs">
						<!-- wp:paragraph {"className":"mtm-home-hero__spec"} -->
						<p class="mtm-home-hero__spec"><span>Materials</span><strong>Black / White / Color</strong></p>
						<!-- /wp:paragraph -->

						<!-- wp:paragraph {"className":"mtm-home-hero__spec"} -->
						<p class="mtm-home-hero__spec"><span>Processes</span><strong>Film / Molding / Extrusion</strong></p>
						<!-- /wp:paragraph -->

						<!-- wp:paragraph {"className":"mtm-home-hero__spec"} -->
						<p class="mtm-home-hero__spec"><span>Review basis</span><strong>Resin + application + grade</strong></p>
						<!-- /wp:paragraph -->
					</div>
					<!-- /wp:group -->
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
						<figcaption class="wp-element-caption">Factory context / review by exact grade and application</figcaption>
					</figure>
					<!-- /wp:image -->

					<!-- wp:image {"sizeSlug":"full","className":"mtm-home-hero-photo-inset"} -->
					<figure class="wp-block-image size-full mtm-home-hero-photo-inset">
						<img src="/wp-content/themes/mtm-b2b-masterbatch/assets/images/guide-black-granules.jpg" alt="Black masterbatch granules" width="800" height="800" loading="eager" decoding="async" />
						<figcaption class="wp-element-caption">BK / carbon system</figcaption>
					</figure>
					<!-- /wp:image -->

						<!-- wp:group {"className":"mtm-home-hero-tech","layout":{"type":"constrained"}} -->
						<div class="wp-block-group mtm-home-hero-tech">
							<!-- wp:paragraph -->
							<p>BK / CARBON SYSTEM</p>
							<!-- /wp:paragraph -->
							<!-- wp:paragraph -->
							<p>Film · Molding · Extrusion</p>
							<!-- /wp:paragraph -->
							<!-- wp:paragraph -->
							<p>Grade-led review</p>
							<!-- /wp:paragraph -->
						</div>
						<!-- /wp:group -->
				</div>
				<!-- /wp:group -->
			</div>
			<!-- /wp:column -->
		</div>
		<!-- /wp:columns -->

	</section>
	<!-- /wp:group -->

	<!-- wp:group {"className":"mtm-field-marquee","layout":{"type":"flex","flexWrap":"nowrap"}} -->
	<div class="wp-block-group mtm-field-marquee">
		<!-- wp:paragraph -->
		<p>Black masterbatch</p>
		<!-- /wp:paragraph -->
		<!-- wp:paragraph -->
		<p>White masterbatch</p>
		<!-- /wp:paragraph -->
		<!-- wp:paragraph -->
		<p>Color masterbatch</p>
		<!-- /wp:paragraph -->
		<!-- wp:paragraph -->
		<p>Application review</p>
		<!-- /wp:paragraph -->
	</div>
	<!-- /wp:group -->

	<!-- wp:group {"tagName":"section","anchor":"products","className":"mtm-home-section mtm-home-products","backgroundColor":"ink","textColor":"mist","layout":{"type":"default"}} -->
	<section id="products" class="wp-block-group mtm-home-section mtm-home-products has-mist-color has-text-color has-ink-background-color has-background">
		<!-- wp:group {"align":"wide","className":"mtm-home-shell","layout":{"type":"constrained","contentSize":"1120px"}} -->
		<div class="wp-block-group alignwide mtm-home-shell">
			<!-- wp:group {"align":"wide","className":"mtm-home-section-heading mtm-home-section-heading\u002d\u002dcenter mtm-home-applications-transition","backgroundColor":"ink","textColor":"mist","layout":{"type":"constrained","contentSize":"760px"}} -->
			<div class="wp-block-group alignwide mtm-home-section-heading mtm-home-section-heading--center mtm-home-applications-transition has-mist-color has-text-color has-ink-background-color has-background">
				<!-- wp:paragraph {"className":"mtm-eyebrow"} -->
				<p class="mtm-eyebrow">Product pathways</p>
				<!-- /wp:paragraph -->

				<!-- wp:heading {"level":2} -->
				<h2 class="wp-block-heading">Choose by what the material must do.</h2>
				<!-- /wp:heading -->

				<!-- wp:paragraph -->
				<p>Start with the job, then the color system. Each route shows the details that change the review.</p>
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
						<!-- wp:image {"sizeSlug":"medium","linkDestination":"none","className":"mtm-home-product-thumb"} -->
						<figure class="wp-block-image size-medium mtm-home-product-thumb"><img src="/wp-content/themes/mtm-b2b-masterbatch/assets/images/guide-black-granules.jpg" alt="Black masterbatch granules" loading="lazy" decoding="async" /></figure>
						<!-- /wp:image -->
						<!-- wp:heading {"level":3} -->
						<h3 class="wp-block-heading">Depth with control.</h3>
						<!-- /wp:heading -->
						<!-- wp:paragraph -->
						<p>Tell us the resin and process. Add the blackness target, dispersion needs, current grade and any quality issue.</p>
						<!-- /wp:paragraph -->
						<!-- wp:group {"className":"mtm-home-spec-tags","layout":{"type":"flex","flexWrap":"wrap"}} -->
						<div class="wp-block-group mtm-home-spec-tags">
							<!-- wp:paragraph {"className":"mtm-home-spec-tag"} -->
							<p class="mtm-home-spec-tag">Blackness</p>
							<!-- /wp:paragraph -->
							<!-- wp:paragraph {"className":"mtm-home-spec-tag"} -->
							<p class="mtm-home-spec-tag">Dispersion</p>
							<!-- /wp:paragraph -->
							<!-- wp:paragraph {"className":"mtm-home-spec-tag"} -->
							<p class="mtm-home-spec-tag">Carrier resin</p>
							<!-- /wp:paragraph -->
						</div>
						<!-- /wp:group -->
						<!-- wp:paragraph {"className":"mtm-home-card-link"} -->
						<p class="mtm-home-card-link"><a href="/masterbatch-guides/black-masterbatch/">Open black route</a></p>
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
						<!-- wp:image {"sizeSlug":"medium","linkDestination":"none","className":"mtm-home-product-thumb"} -->
						<figure class="wp-block-image size-medium mtm-home-product-thumb"><img src="/wp-content/themes/mtm-b2b-masterbatch/assets/images/guide-white-granules.jpg" alt="White masterbatch granules" loading="lazy" decoding="async" /></figure>
						<!-- /wp:image -->
						<!-- wp:heading {"level":3} -->
						<h3 class="wp-block-heading">Opacity with context.</h3>
						<!-- /wp:heading -->
						<!-- wp:paragraph -->
						<p>Send the resin and process, along with the opacity target, TiO2 context, end product and document requirements.</p>
						<!-- /wp:paragraph -->
						<!-- wp:group {"className":"mtm-home-spec-tags","layout":{"type":"flex","flexWrap":"wrap"}} -->
						<div class="wp-block-group mtm-home-spec-tags">
							<!-- wp:paragraph {"className":"mtm-home-spec-tag"} -->
							<p class="mtm-home-spec-tag">Opacity</p>
							<!-- /wp:paragraph -->
							<!-- wp:paragraph {"className":"mtm-home-spec-tag"} -->
							<p class="mtm-home-spec-tag">Whiteness</p>
							<!-- /wp:paragraph -->
							<!-- wp:paragraph {"className":"mtm-home-spec-tag"} -->
							<p class="mtm-home-spec-tag">TiO2 context</p>
							<!-- /wp:paragraph -->
						</div>
						<!-- /wp:group -->
						<!-- wp:paragraph {"className":"mtm-home-card-link"} -->
						<p class="mtm-home-card-link"><a href="/masterbatch-guides/white-masterbatch/">Open white route</a></p>
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
						<!-- wp:image {"sizeSlug":"medium","linkDestination":"none","className":"mtm-home-product-thumb"} -->
						<figure class="wp-block-image size-medium mtm-home-product-thumb"><img src="/wp-content/themes/mtm-b2b-masterbatch/assets/images/guide-color-granules.jpg" alt="Mixed-color masterbatch granules" loading="lazy" decoding="async" /></figure>
						<!-- /wp:image -->
						<!-- wp:heading {"level":3} -->
						<h3 class="wp-block-heading">Reference becomes direction.</h3>
						<!-- /wp:heading -->
						<!-- wp:paragraph -->
						<p>Describe the resin and end product. Include the color reference and tolerance expectation, and say whether a sample discussion is needed.</p>
						<!-- /wp:paragraph -->
						<!-- wp:group {"className":"mtm-home-spec-tags","layout":{"type":"flex","flexWrap":"wrap"}} -->
						<div class="wp-block-group mtm-home-spec-tags">
							<!-- wp:paragraph {"className":"mtm-home-spec-tag"} -->
							<p class="mtm-home-spec-tag">Reference</p>
							<!-- /wp:paragraph -->
							<!-- wp:paragraph {"className":"mtm-home-spec-tag"} -->
							<p class="mtm-home-spec-tag">Tolerance</p>
							<!-- /wp:paragraph -->
							<!-- wp:paragraph {"className":"mtm-home-spec-tag"} -->
							<p class="mtm-home-spec-tag">Sample review</p>
							<!-- /wp:paragraph -->
						</div>
						<!-- /wp:group -->
						<!-- wp:paragraph {"className":"mtm-home-card-link"} -->
						<p class="mtm-home-card-link"><a href="/masterbatch-guides/color-masterbatch/">Open color route</a></p>
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
				<h2 class="wp-block-heading">The run changes the requirement.</h2>
				<!-- /wp:heading -->

				<!-- wp:paragraph -->
				<p>Film, molding, extrusion and recycled feedstock each expose different questions. Start with the production context closest to yours.</p>
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
				<h2 class="wp-block-heading">From brief to a useful answer.</h2>
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
				<h2 class="wp-block-heading">Documents follow the grade.</h2>
				<!-- /wp:heading -->

				<!-- wp:paragraph -->
				<p>A TDS, SDS/MSDS, COA or compliance-related file only means something when tied to the exact product, application, country and intended use. Request the review and the team will check the scope.</p>
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
					<!-- wp:paragraph {"className":"mtm-home-document-row"} -->
					<p class="mtm-home-document-row"><span>TDS</span><strong>Technical data</strong><em>Typical and specification values by grade.</em></p>
					<!-- /wp:paragraph -->

					<!-- wp:paragraph {"className":"mtm-home-document-row"} -->
					<p class="mtm-home-document-row"><span>SDS / MSDS</span><strong>Safety information</strong><em>By supplied product where available.</em></p>
					<!-- /wp:paragraph -->

					<!-- wp:paragraph {"className":"mtm-home-document-row"} -->
					<p class="mtm-home-document-row"><span>COA</span><strong>Batch record</strong><em>Batch-specific where available.</em></p>
					<!-- /wp:paragraph -->

					<!-- wp:paragraph {"className":"mtm-home-document-row"} -->
					<p class="mtm-home-document-row"><span>COMPLIANCE</span><strong>Tested scope</strong><em>Only the tested grade or sample.</em></p>
					<!-- /wp:paragraph -->

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
		<!-- wp:group {"align":"wide","className":"mtm-home-shell mtm-home-about__overlay","layout":{"type":"constrained","contentSize":"760px"}} -->
		<div class="wp-block-group alignwide mtm-home-shell mtm-home-about__overlay">
			<!-- wp:paragraph {"className":"mtm-eyebrow"} -->
			<p class="mtm-eyebrow">Factory context</p>
			<!-- /wp:paragraph -->

			<!-- wp:heading {"level":2} -->
			<h2 class="wp-block-heading">The material has to work on the line.</h2>
			<!-- /wp:heading -->

			<!-- wp:paragraph -->
			<p>Application fit starts with the real processing context. The factory and workshop imagery show where that context belongs, while product and document claims stay tied to the exact grade under review.</p>
			<!-- /wp:paragraph -->

			<!-- wp:group {"className":"mtm-home-about-tags","layout":{"type":"flex","flexWrap":"wrap"}} -->
			<div class="wp-block-group mtm-home-about-tags">
				<!-- wp:paragraph -->
				<p>Material context</p>
				<!-- /wp:paragraph -->
				<!-- wp:paragraph -->
				<p>Processing review</p>
				<!-- /wp:paragraph -->
				<!-- wp:paragraph -->
				<p>Packing &amp; shipment</p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:group -->

			<!-- wp:paragraph {"className":"mtm-home-about__link"} -->
			<p class="mtm-home-about__link"><a href="/about-quality/">About GE and Quality</a></p>
			<!-- /wp:paragraph -->
		</div>
		<!-- /wp:group -->
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
				<h2 class="wp-block-heading">Read before the RFQ.</h2>
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

				<!-- wp:column {"className":"mtm-home-card-column"} -->
				<div class="wp-block-column mtm-home-card-column">
					<!-- wp:group {"className":"mtm-home-resource-card","layout":{"type":"constrained"}} -->
					<div class="wp-block-group mtm-home-resource-card">
						<!-- wp:paragraph {"className":"mtm-home-resource-card__index"} -->
						<p class="mtm-home-resource-card__index">04</p>
						<!-- /wp:paragraph -->
						<!-- wp:heading {"level":3} -->
						<h3 class="wp-block-heading">TDS, SDS and COA</h3>
						<!-- /wp:heading -->
						<!-- wp:paragraph -->
						<p>What each technical document covers and what it cannot prove.</p>
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
				<h2 class="wp-block-heading">Send us the run.</h2>
				<!-- /wp:heading -->

				<!-- wp:paragraph -->
				<p>Send the resin, process, end product, target and current grade. Add the documents you need. We will review the product and document scope before replying.</p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:group -->

			<!-- wp:group {"className":"mtm-home-cta-specs","layout":{"type":"flex","flexWrap":"wrap"}} -->
			<div class="wp-block-group mtm-home-cta-specs">
				<!-- wp:paragraph {"className":"mtm-home-cta-spec"} -->
				<p class="mtm-home-cta-spec"><span>01</span><strong>Resin</strong></p>
				<!-- /wp:paragraph -->
				<!-- wp:paragraph {"className":"mtm-home-cta-spec"} -->
				<p class="mtm-home-cta-spec"><span>02</span><strong>Process</strong></p>
				<!-- /wp:paragraph -->
				<!-- wp:paragraph {"className":"mtm-home-cta-spec"} -->
				<p class="mtm-home-cta-spec"><span>03</span><strong>Target</strong></p>
				<!-- /wp:paragraph -->
				<!-- wp:paragraph {"className":"mtm-home-cta-spec"} -->
				<p class="mtm-home-cta-spec"><span>04</span><strong>Documents</strong></p>
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
