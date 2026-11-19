const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "../../..");
const { chromium } = require(
  path.join(repoRoot, "xuqiu/wordpress/node_modules/playwright"),
);
const themeRoot = path.join(
  repoRoot,
  "xuqiu/wordpress/themes/mtm-b2b-masterbatch",
);
const outputDir = path.join(__dirname, "output");
const baseUrl =
  process.env.MB_LIVE_BASE_URL || "https://www.gemasterbatch.com";

fs.mkdirSync(outputDir, { recursive: true });

function fontDataUrl(relativePath) {
  const bytes = fs.readFileSync(path.join(themeRoot, relativePath));
  return `data:font/woff2;base64,${bytes.toString("base64")}`;
}

const proposedFontCss = `
@font-face {
  font-family: "Archivo";
  src: url("${fontDataUrl("assets/fonts/archivo/archivo-latin-variable.woff2")}") format("woff2");
  font-style: normal;
  font-weight: 400 700;
  font-stretch: 100%;
  font-display: swap;
}
@font-face {
  font-family: "Inter";
  src: url("${fontDataUrl("assets/fonts/inter/inter-latin-variable.woff2")}") format("woff2");
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
}
:root {
  --ge-font-display: Archivo, "Helvetica Neue", Arial, sans-serif;
  --ge-font-sans: Inter, "Helvetica Neue", Arial, sans-serif;
}
html, body, button, input, select, textarea {
  font-family: var(--ge-font-sans);
}
h1, h2, h3, h4, h5, h6, .wp-block-post-title {
  font-family: var(--ge-font-display);
  font-weight: 600 !important;
}
`;

async function settlePage(page, pagePath) {
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      await page.goto(`${baseUrl}${pagePath}`, {
        waitUntil: "domcontentloaded",
        timeout: 60_000,
      });
      await page.waitForLoadState("networkidle", { timeout: 30_000 });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(500);
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

async function applyProposedFonts(page) {
  await page.addStyleTag({ content: proposedFontCss });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
}

async function capturePage(page, name, pagePath, fullPage = true) {
  await settlePage(page, pagePath);
  await page.screenshot({ path: path.join(outputDir, `${name}-current.png`), fullPage });
  await applyProposedFonts(page);
  await page.screenshot({ path: path.join(outputDir, `${name}-proposed.png`), fullPage });
}

async function readTypography(page, label) {
  return page.evaluate((pageLabel) => {
    const pick = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const style = window.getComputedStyle(element);
      return {
        selector,
        family: style.fontFamily,
        size: style.fontSize,
        weight: style.fontWeight,
        lineHeight: style.lineHeight,
      };
    };

    return {
      page: pageLabel,
      body: pick("body"),
      h1: pick("h1"),
      h2: pick("h2"),
      nav: pick(".site-chrome-nav a"),
      button: pick("button, .wp-block-button__link, .sketch-button"),
      input: pick("input, select, textarea"),
    };
  }, label);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const desktop = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });
  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });

  await capturePage(desktop, "home-desktop-1440", "/");
  await capturePage(mobile, "home-mobile-390", "/");
  await capturePage(desktop, "guides-desktop-1440", "/resources/");
  await capturePage(desktop, "article-desktop-1440", "/blog/how-to-choose-carbon-black-content/");
  await capturePage(mobile, "article-mobile-390", "/blog/how-to-choose-carbon-black-content/");
  await capturePage(desktop, "contact-desktop-1440", "/request-a-quote/");
  await capturePage(mobile, "contact-mobile-390", "/request-a-quote/");

  const typography = [];
  for (const [page, label, pagePath] of [
    [desktop, "home", "/"],
    [desktop, "guides", "/resources/"],
    [desktop, "product", "/products/black-masterbatch/bk040/"],
    [desktop, "article", "/blog/how-to-choose-carbon-black-content/"],
    [desktop, "contact", "/request-a-quote/"],
  ]) {
    await settlePage(page, pagePath);
    await applyProposedFonts(page);
    typography.push(await readTypography(page, label));
  }

  fs.writeFileSync(
    path.join(outputDir, "computed-typography.json"),
    `${JSON.stringify(typography, null, 2)}\n`,
  );

  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
