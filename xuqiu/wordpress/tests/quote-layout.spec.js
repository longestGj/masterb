const { expect, test } = require("@playwright/test");

const liveBaseUrl = process.env.MB_LIVE_BASE_URL;

function quoteLayout(page) {
  return page.evaluate(() => {
    const heading = document.querySelector(".contact-hero h1");
    const form = document.querySelector(".contact-form");
    const label = document.querySelector('label[for="mb-rfq-full_name"]');
    const marker = label?.querySelector(".mtm-rfq-form__req");
    const headingRect = heading.getBoundingClientRect();
    const formRect = form.getBoundingClientRect();
    const labelRect = label.getBoundingClientRect();
    const markerRect = marker.getBoundingClientRect();

    return {
      viewport: document.documentElement.clientWidth,
      documentWidth: document.documentElement.scrollWidth,
      headingClientWidth: heading.clientWidth,
      headingScrollWidth: heading.scrollWidth,
      headingRight: headingRect.right,
      formLeft: formRect.left,
      labelDisplay: getComputedStyle(label).display,
      markerSameLine: Math.abs(markerRect.y - labelRect.y) < 5,
    };
  });
}

test("keeps the quote heading out of the form and the required marker inline", async ({
  page,
}) => {
  test.skip(!liveBaseUrl, "Set MB_LIVE_BASE_URL to run live quote layout checks.");
  test.setTimeout(120_000);

  await page.setViewportSize({ width: 1405, height: 900 });
  await page.goto(`${liveBaseUrl}/request-a-quote/`, {
    waitUntil: "domcontentloaded",
  });
  await page.waitForSelector(".contact-form");
  const desktop = await quoteLayout(page);

  expect(desktop.headingScrollWidth).toBeLessThanOrEqual(
    desktop.headingClientWidth + 1,
  );
  expect(desktop.headingRight).toBeLessThanOrEqual(desktop.formLeft - 24);
  expect(desktop.labelDisplay).toBe("block");
  expect(desktop.markerSameLine).toBe(true);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${liveBaseUrl}/request-a-quote/`, {
    waitUntil: "domcontentloaded",
  });
  await page.waitForSelector(".contact-form");
  const mobile = await quoteLayout(page);

  expect(mobile.documentWidth).toBeLessThanOrEqual(mobile.viewport + 1);
  expect(mobile.headingScrollWidth).toBeLessThanOrEqual(
    mobile.headingClientWidth + 1,
  );
  expect(mobile.labelDisplay).toBe("block");
  expect(mobile.markerSameLine).toBe(true);
});
