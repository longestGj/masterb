const { expect, test } = require("@playwright/test");

const liveBaseUrl = process.env.MB_LIVE_BASE_URL;

test.skip(!liveBaseUrl, "Set MB_LIVE_BASE_URL to run live RFQ checks.");

test("renders the live RFQ form without submitting", async ({ page }) => {
  await page.goto(
    `${liveBaseUrl}/request-a-quote/?intent=black-masterbatch#request-form`,
    { waitUntil: "networkidle" },
  );

  const form = page.locator("form.mtm-rfq-form");
  await expect(form).toBeVisible();
  await expect(page.locator("h1")).toHaveText("Masterbatch inquiry.");
  await expect(page.locator("main > section")).toHaveCount(4);
  await expect(page.locator(".contact-form .contact-fieldset")).toHaveCount(2);
  await expect(page.locator(".contact-form details.contact-advanced")).toHaveCount(
    1,
  );
  await expect(
    page.locator(".contact-form details.contact-advanced"),
  ).not.toHaveAttribute("open", "");
  await expect(form.locator('input[name="product_grade"]')).toBeHidden();
  await expect(form.locator('input[name="quantity"]')).toBeHidden();
  await expect(form.locator('input[name="destination_port"]')).toBeHidden();
  await expect(form.locator('select[name="color_reference_type"]')).toBeHidden();
  await page.locator(".contact-form details.contact-advanced summary").click();
  await expect(form.locator('input[name="product_grade"]')).toBeVisible();
  await page.locator(".contact-form details.contact-advanced summary").click();
  await expect(form.locator('select[name="documents_requested"]')).toHaveCount(
    0,
  );
  await expect(form.locator('select[name="document_purpose"]')).toHaveCount(0);
  await expect(form).toHaveAttribute("method", "post");
  await expect(form).toHaveAttribute("action", /admin-post\.php$/);
  await expect(
    form.locator('input[name="action"][value="mb_submit_rfq"]'),
  ).toHaveCount(1);
  await expect(form.locator('input[name="mb_rfq_nonce"]')).toHaveCount(1);
  await expect(form.locator('input[name="website_url"]')).toHaveCount(1);
  await expect(form.locator('input[name="privacy_consent"]')).toHaveAttribute(
    "required",
    "",
  );
  await expect(form.locator('select[name="product_interest"]')).toHaveValue(
    "Black masterbatch",
  );
  await expect(
    form.locator('textarea[name="target_color_function"]'),
  ).toHaveAttribute("required", "");
  await expect(form.locator('button[type="submit"]')).toHaveText(
    "Submit inquiry",
  );
  await expect(form.locator('a[href="/privacy-policy/"]')).toBeVisible();

  await form.locator('input[name="full_name"]').fill("Layout Check");
  await form.locator('input[name="company"]').fill("Example Company");
  await form.locator('input[name="email"]').fill("layout@example.com");
  await form.locator('input[name="country"]').fill("Example Country");
  await form
    .locator('input[name="application"]')
    .fill("Browser layout check");
  await form
    .locator('textarea[name="target_color_function"]')
    .fill("Current issue layout check");
  await form.locator('input[name="privacy_consent"]').check();

  const layout = await page.evaluate(() => {
    const root = document.documentElement;
    const formElement = document.querySelector("form.mtm-rfq-form");
    const rect = formElement.getBoundingClientRect();

    return {
      documentWidth: root.scrollWidth,
      viewportWidth: root.clientWidth,
      formLeft: rect.left,
      formRight: rect.right,
    };
  });

  expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.formLeft).toBeGreaterThanOrEqual(0);
  expect(layout.formRight).toBeLessThanOrEqual(layout.viewportWidth + 1);
});

test("shows live success and error states without submitting", async ({
  page,
}) => {
  await page.goto(
    `${liveBaseUrl}/request-a-quote/?rfq_status=success#request-form`,
    { waitUntil: "networkidle" },
  );
  await expect(
    page.getByText(
      "Your request has been received. Our team will review the product grade, application and document scope, then reply by email.",
    ),
  ).toBeVisible();

  await page.goto(
    `${liveBaseUrl}/request-a-quote/?rfq_status=error#request-form`,
    { waitUntil: "networkidle" },
  );
  await expect(
    page.getByText(
      "We could not submit your request. Check the required fields and try again.",
    ),
  ).toBeVisible();
});

test("publishes handling details in the live privacy policy", async ({
  page,
}) => {
  await page.goto(`${liveBaseUrl}/privacy-policy/`, {
    waitUntil: "networkidle",
  });

  await expect(
    page.getByRole("heading", { name: "Privacy Policy", level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "stored in a private WordPress inquiry record",
      { exact: false },
    ),
  ).toBeVisible();
});
