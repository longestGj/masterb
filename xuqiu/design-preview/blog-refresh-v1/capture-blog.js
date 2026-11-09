const { chromium } = require("../../wordpress/node_modules/playwright");
const fs = require("node:fs/promises");
const path = require("node:path");

const previewUrl =
  process.env.PREVIEW_URL ||
  "http://127.0.0.1:8766/xuqiu/design-preview/blog-refresh-v1/";
const currentUrl =
  process.env.CURRENT_URL || "https://www.ashareai.com/resources/#articles";
const outputDirectory = path.join(__dirname, "output");

async function loadImages(page) {
  await page.evaluate(async () => {
    document.querySelectorAll("img[loading='lazy']").forEach((image) => {
      image.loading = "eager";
    });
    const step = Math.max(window.innerHeight * 0.8, 500);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 30));
    }
    window.scrollTo(0, 0);
  });
}

async function capture(browser, target, prefix, name, viewport, mobile) {
  const page = await browser.newPage({
    viewport,
    isMobile: mobile,
    hasTouch: mobile,
  });
  await page.goto(target, { waitUntil: "networkidle", timeout: 60000 });
  await loadImages(page);

  const audit = await page.evaluate(() => {
    const lineCount = (element) => {
      const range = document.createRange();
      range.selectNodeContents(element);
      return new Set(
        Array.from(range.getClientRects()).map((rect) =>
          Math.round(rect.top * 2) / 2,
        ),
      ).size;
    };

    return {
      title: document.title,
      viewportWidth: document.documentElement.clientWidth,
      documentWidth: document.documentElement.scrollWidth,
      documentHeight: document.documentElement.scrollHeight,
      h1Count: document.querySelectorAll("h1").length,
      h1: document.querySelector("h1")?.textContent.trim() || "",
      headings: Array.from(
        document.querySelectorAll(".blog-page h1, .blog-page h2"),
      ).map((element) => ({
        level: Number(element.tagName.slice(1)),
        text: element.textContent.trim(),
        lines: lineCount(element),
      })),
      sections: Array.from(
        document.querySelectorAll(".blog-page > section"),
      ).map((element) => ({
        className: String(element.className),
        height: Math.round(element.getBoundingClientRect().height),
      })),
      articleCards: document.querySelectorAll(
        ".blog-feature, .blog-secondary-card",
      ).length,
      shortLinks: Array.from(document.querySelectorAll(".blog-page a"))
        .map((link) => ({
          text: link.textContent.trim().replace(/\s+/g, " "),
          height: Math.round(link.getBoundingClientRect().height),
        }))
        .filter((link) => link.height > 0 && link.height < 44),
      brokenImages: Array.from(document.images)
        .filter((image) => !image.complete || image.naturalWidth === 0)
        .map((image) => image.getAttribute("src")),
    };
  });

  await page.screenshot({
    path: path.join(outputDirectory, `${prefix}-${name}.png`),
    fullPage: true,
  });
  await page.close();
  return { variant: prefix, name, ...audit };
}

(async () => {
  await fs.mkdir(outputDirectory, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const viewports = [
    ["desktop-1440", { width: 1440, height: 1000 }, false],
    ["tablet-768", { width: 768, height: 1024 }, true],
    ["mobile-390", { width: 390, height: 844 }, true],
    ["mobile-320", { width: 320, height: 720 }, true],
  ];
  const results = [];

  for (const [name, viewport, mobile] of viewports) {
    results.push(
      await capture(browser, currentUrl, "current", name, viewport, mobile),
    );
    results.push(
      await capture(browser, previewUrl, "proposal", name, viewport, mobile),
    );
  }

  await fs.writeFile(
    path.join(outputDirectory, "audit.json"),
    JSON.stringify(results, null, 2),
  );

  const comparison = await browser.newPage({
    viewport: { width: 1800, height: 1200 },
  });
  await comparison.goto(
    "http://127.0.0.1:8766/xuqiu/design-preview/blog-refresh-v1/compare.html",
    { waitUntil: "networkidle" },
  );
  await comparison.screenshot({
    path: path.join(outputDirectory, "current-vs-proposal.png"),
    fullPage: true,
  });
  await comparison.close();
  await browser.close();

  for (const result of results) {
    if (
      result.documentWidth > result.viewportWidth + 1
      || result.h1Count !== 1
      || result.brokenImages.length
    ) {
      throw new Error(`${result.variant}-${result.name} failed the audit.`);
    }
  }
})();
