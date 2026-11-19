const { expect, test } = require("@playwright/test");

const liveBaseUrl = process.env.MB_LIVE_BASE_URL;

test.skip(!liveBaseUrl, "Set MB_LIVE_BASE_URL to run live typography checks.");

async function openPage(page, url) {
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 60_000,
      });
      expect(response?.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      return;
    } catch (error) {
      lastError = error;
      if (attempt < 3) {
        await page.waitForTimeout(1500);
      }
    }
  }

  throw lastError;
}

test("serves and applies the self-hosted Archivo and Inter fonts", async ({
  page,
}) => {
  test.setTimeout(180_000);

  const archivo = await page.request.get(
    `${liveBaseUrl}/wp-content/themes/mtm-b2b-masterbatch/assets/fonts/archivo/archivo-latin-variable.woff2`,
  );
  const inter = await page.request.get(
    `${liveBaseUrl}/wp-content/themes/mtm-b2b-masterbatch/assets/fonts/inter/inter-latin-variable.woff2`,
  );

  expect(archivo.status()).toBe(200);
  expect(inter.status()).toBe(200);
  expect(Number(archivo.headers()["content-length"])).toBeGreaterThan(30_000);
  expect(Number(inter.headers()["content-length"])).toBeGreaterThan(45_000);

  for (const path of [
    "/",
    "/products/black-masterbatch/bk040/",
    "/resources/",
    "/blog/how-to-choose-carbon-black-content/",
    "/request-a-quote/",
  ]) {
    await openPage(page, `${liveBaseUrl}${path}`);

    const typography = await page.evaluate(() => {
      const read = (selector) => {
        const element = document.querySelector(selector);
        if (!element) return null;
        const style = getComputedStyle(element);
        return {
          family: style.fontFamily,
          weight: style.fontWeight,
        };
      };

      return {
        body: read("body"),
        heading: read("h1"),
        control: read("input, select, textarea, button"),
      };
    });

    expect(typography.body?.family, path).toContain("Inter");
    expect(typography.heading?.family, path).toContain("Archivo");
    expect(typography.heading?.weight, path).toBe("600");
  }
});
