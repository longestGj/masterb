const { expect, test } = require("@playwright/test");

const liveBaseUrl = process.env.MB_LIVE_BASE_URL;

test("keeps the carbon black article readable inside phone viewports", async ({
  page,
}, testInfo) => {
  test.skip(!liveBaseUrl, "Set MB_LIVE_BASE_URL to run live checks.");
  test.skip(testInfo.project.name !== "mobile", "Phone-only layout check.");
  test.setTimeout(120_000);

  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 720 });
    await page.goto(
      `${liveBaseUrl}/blog/how-to-choose-carbon-black-content/`,
      { waitUntil: "networkidle" },
    );

    const layout = await page.evaluate(() => {
      const rect = (selector) => {
        const element = document.querySelector(selector);
        if (!element) {
          return null;
        }
        const bounds = element.getBoundingClientRect();
        return {
          left: bounds.left,
          right: bounds.right,
          width: bounds.width,
          height: bounds.height,
        };
      };
      const content = document.querySelector(".article-content");
      const table = document.querySelector(".article-content .wp-block-table");

      return {
        viewport: document.documentElement.clientWidth,
        document: document.documentElement.scrollWidth,
        crumb: rect(".article-crumb"),
        hero: rect(".article-hero"),
        main: rect(".article-main"),
        firstParagraph: rect(".article-content > p:first-child"),
        contentFontSize: parseFloat(getComputedStyle(content).fontSize),
        table: table
          ? {
              clientWidth: table.clientWidth,
              scrollWidth: table.scrollWidth,
              rows: table.querySelectorAll("tbody tr").length,
              labelledCells: table.querySelectorAll("td[data-label]").length,
            }
          : null,
      };
    });

    expect(layout.document, `${width}px page width`).toBeLessThanOrEqual(
      layout.viewport + 1,
    );
    expect(layout.crumb.height, `${width}px breadcrumb`).toBeLessThanOrEqual(
      52,
    );
    expect(layout.hero.height, `${width}px hero`).toBeLessThanOrEqual(
      width === 390 ? 470 : 500,
    );
    expect(layout.main.left, `${width}px article left edge`).toBeGreaterThanOrEqual(
      15,
    );
    expect(
      layout.main.right,
      `${width}px article right edge`,
    ).toBeLessThanOrEqual(layout.viewport - 15);
    expect(
      layout.firstParagraph.left,
      `${width}px first paragraph left edge`,
    ).toBeGreaterThanOrEqual(15);
    expect(
      layout.firstParagraph.right,
      `${width}px first paragraph right edge`,
    ).toBeLessThanOrEqual(layout.viewport - 15);
    expect(layout.contentFontSize, `${width}px body text`).toBeGreaterThanOrEqual(
      16,
    );
    expect(layout.table, `${width}px grade table`).toEqual({
      clientWidth: expect.any(Number),
      scrollWidth: expect.any(Number),
      rows: 5,
      labelledCells: 20,
    });
    expect(layout.table.scrollWidth, `${width}px table width`).toBeLessThanOrEqual(
      layout.table.clientWidth + 1,
    );
  }
});
