const { expect, test } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");

const WORDPRESS_ROOT = path.resolve(__dirname, "..");
const THEME_ROOT = path.join(
  WORDPRESS_ROOT,
  "themes",
  "mtm-b2b-masterbatch",
);

function read(pathname) {
  return fs.readFileSync(pathname, "utf8");
}

test("ships the Contact template, dedicated style and page condition", () => {
  const template = read(
    path.join(THEME_ROOT, "templates", "page-request-a-quote.html"),
  );
  const functions = read(path.join(THEME_ROOT, "functions.php"));
  const style = read(path.join(THEME_ROOT, "assets", "css", "contact-v1.css"));

  expect(template).toContain("<h1 class=\"wp-block-heading\">Masterbatch inquiry.</h1>");
  expect(template).toContain("[mb_rfq_form context=\"rfq\"]");
  expect(template).toContain("After you send it.");
  expect(template).toContain("Review scope.");
  expect(template).toContain("Product routes.");
  expect(template).toContain("contact-routes__index");
  expect(template).not.toContain("wp:post-content");
  expect(template).not.toContain("mtm-quote-media");

  expect(functions).toContain("mb_is_contact_page");
  expect(functions).toContain("'mtm-b2b-contact-v1'");
  expect(functions).toContain("'mtm-contact-v1'");
  expect(functions).toContain("Material and application");
  expect(functions).toContain("Add technical details");
  expect(functions).toContain("Request technical documents separately");

  expect(style).toContain("body.mtm-contact-v1");
  expect(style).toContain("var(--ge-color-primary)");
  expect(style).toContain("var(--ge-container)");
  expect(style).toContain("var(--ge-font-display)");
  expect(style).toContain(
    "details.contact-advanced:not([open]) .contact-form__grid",
  );
});

test("keeps the simplified RFQ and full document validation separate", () => {
  const plugin = read(
    path.join(WORDPRESS_ROOT, "mu-plugins", "mb-rfq-submissions.php"),
  );

  expect(plugin).toContain("'rfq' === $data['form_context']");
  expect(plugin).toContain("'' === $data['target_color_function']");
  expect(plugin).toContain("'documents' === $data['form_context']");
  expect(plugin).toContain("'' === $data['documents_requested']");
  expect(plugin).toContain("'' === $data['document_purpose']");
});
