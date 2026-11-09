const { expect, test } = require("@playwright/test");

const liveBaseUrl = process.env.MB_LIVE_BASE_URL;

test.skip(!liveBaseUrl, "Set MB_LIVE_BASE_URL to run live chrome checks.");

async function openLivePage(page, url) {
  await page.goto(url, { waitUntil: "commit", timeout: 60_000 });
  await page.waitForFunction(
    () => {
      const header = document.querySelector(".site-chrome-header");
      return (
        document.readyState !== "loading" &&
        header &&
        window.getComputedStyle(header).position === "sticky"
      );
    },
    null,
    { timeout: 60_000 },
  );
}

test("shared Header and Footer fit the viewport", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(120_000);
  await openLivePage(page, liveBaseUrl);

  const layout = await page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;
    const header = document.querySelector(".site-chrome-header");
    const footer = document.querySelector(".site-chrome-footer");
    const content = document.querySelector(".wp-site-blocks > header + *");
    const overflowing = Array.from(document.querySelectorAll("body *"))
      .filter((element) => {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return (
          style.display !== "none" &&
          style.position !== "fixed" &&
          (rect.right > viewportWidth + 1 || rect.left < -1)
        );
      })
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName,
          className: String(element.className),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        };
      })
      .slice(0, 20);
    const chromeOverflowing = Array.from(
      document.querySelectorAll(
        ".site-chrome-header *, .site-chrome-footer *",
      ),
    )
      .filter((element) => {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return (
          style.display !== "none" &&
          style.position !== "fixed" &&
          (rect.right > viewportWidth + 1 || rect.left < -1)
        );
      })
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName,
          className: String(element.className),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        };
      });

    return {
      viewportWidth,
      documentWidth: document.documentElement.scrollWidth,
      headerHeight: header ? Math.round(header.getBoundingClientRect().height) : null,
      headerBottom: header ? Math.round(header.getBoundingClientRect().bottom) : null,
      contentTop: content ? Math.round(content.getBoundingClientRect().top) : null,
      footerWidth: footer ? Math.round(footer.getBoundingClientRect().width) : null,
      overflowing,
      chromeOverflowing,
    };
  });

  console.log(JSON.stringify(layout, null, 2));

  await expect(page.locator(".site-chrome-header")).toBeVisible();
  await expect(page.locator(".site-chrome-footer")).toBeVisible();
  await expect(page.locator(".site-chrome-footer")).toContainText(
    "GE CHEMICAL & POLYMER GROUP CO., LTD",
  );
  await expect(page.locator(".site-chrome-footer")).toContainText(
    "Scan to request a quote",
  );
  if (testInfo.project.name === "desktop") {
    await expect(
      page.locator('.site-chrome-nav [data-chrome-nav="resources"]'),
    ).toBeVisible();
  }

  await page.locator(".site-chrome-footer").scrollIntoViewIfNeeded();
  await page.waitForFunction(() =>
    Array.from(
      document.querySelectorAll(
        ".site-chrome-header img, .site-chrome-footer img",
      ),
    ).every((image) => image.complete && image.naturalWidth > 0),
  );

  const brokenChromeImages = await page
    .locator(".site-chrome-header img, .site-chrome-footer img")
    .evaluateAll((images) =>
      images
        .filter((image) => !image.complete || image.naturalWidth === 0)
        .map((image) => image.getAttribute("src")),
    );

  expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.chromeOverflowing).toEqual([]);
  expect(layout.headerBottom).toBe(layout.contentTop);
  expect(brokenChromeImages).toEqual([]);

  if (testInfo.project.name === "mobile") {
    const menuButton = page.locator("[data-site-chrome-menu-button]");
    const mobileMenu = page.locator("[data-site-chrome-menu]");

    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");
    await expect(mobileMenu).toBeVisible();
    await expect(
      mobileMenu.locator('[data-chrome-nav="resources"]'),
    ).toBeVisible();

    const menuBounds = await mobileMenu.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return {
        top: Math.round(rect.top),
        bottom: Math.round(rect.bottom),
        width: Math.round(rect.width),
        viewportWidth: document.documentElement.clientWidth,
        viewportHeight: window.innerHeight,
      };
    });

    expect(menuBounds.top).toBe(layout.headerHeight);
    expect(menuBounds.width).toBe(menuBounds.viewportWidth);
    expect(menuBounds.bottom).toBeLessThanOrEqual(menuBounds.viewportHeight);

    await page.screenshot({
      path: testInfo.outputPath("ashareai-chrome-mobile-menu.png"),
      fullPage: false,
    });

    await page.keyboard.press("Escape");
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
  }

  await page.evaluate(() => window.scrollTo(0, 0));

  await page.screenshot({
    path: testInfo.outputPath(`ashareai-chrome-${testInfo.project.name}.png`),
    fullPage: true,
  });
});

test("desktop navigation fits at 1024 and 981 pixels", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Desktop breakpoint check.");
  testInfo.setTimeout(120_000);
  await openLivePage(page, liveBaseUrl);

  for (const width of [1024, 981]) {
    await page.setViewportSize({ width, height: 900 });
    const dimensions = await page.evaluate(() => ({
      viewportWidth: document.documentElement.clientWidth,
      documentWidth: document.documentElement.scrollWidth,
    }));

    expect(dimensions.documentWidth, `${width}px`).toBeLessThanOrEqual(
      dimensions.viewportWidth + 1,
    );
  }
});

test("marks Resources as the current navigation item", async ({ page }) => {
  test.setTimeout(120_000);
  await openLivePage(page, `${liveBaseUrl}/resources/`);

  await expect(page.locator('[data-chrome-nav="resources"]').first()).toHaveAttribute(
    "aria-current",
    "page",
  );
});

test("Resources menu contains the four buyer resource routes", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(120_000);
  await openLivePage(page, liveBaseUrl);

  if (testInfo.project.name === "mobile") {
    await page.locator("[data-site-chrome-menu-button]").click();
    await page.locator("[data-site-chrome-mobile-resources-toggle]").click();
    const links = page.locator("#site-chrome-mobile-resources-menu a");
    await expect(links).toHaveCount(4);
    await expect(links).toContainText([
      "Buyer Guides",
      "Blog",
      "Buyer FAQ",
      "Technical Documents",
    ]);
  } else {
    await page.locator("[data-chrome-resources-toggle]").click();
    const links = page.locator("[data-chrome-resources-menu] > a");
    await expect(links).toHaveCount(4);
    await expect(links).toContainText([
      "Buyer Guides",
      "Blog",
      "Buyer FAQ",
      "Technical Documents",
    ]);
  }
});
