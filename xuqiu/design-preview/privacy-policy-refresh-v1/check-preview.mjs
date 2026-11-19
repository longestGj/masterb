import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "../../wordpress/node_modules/playwright/index.mjs";

const previewDir = path.dirname(fileURLToPath(import.meta.url));
const previewUrl = "http://127.0.0.1:8766/xuqiu/design-preview/privacy-policy-refresh-v1/";
const policyPath = path.resolve(previewDir, "../../wordpress/content/pages/privacy-policy.md");

const normalize = (value) => value.replace(/\s+/g, " ").trim();
const policySource = await fs.readFile(policyPath, "utf8");
const policyBody = policySource.replace(/^---[\s\S]*?---\s*/u, "");
const policyText = normalize(
  policyBody
    .replace(/^##\s+/gmu, "")
    .split(/\n{2,}/u)
    .join(" ")
);

const browser = await chromium.launch({ headless: true });
const failures = [];

for (const width of [1440, 1024, 768, 390, 320]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  await page.goto(previewUrl, { waitUntil: "networkidle" });
  await page.waitForSelector(".site-chrome-header");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(150);
  await page.evaluate(() => window.scrollTo(0, 0));

  const result = await page.evaluate(() => {
    const body = document.body;
    const documentElement = document.documentElement;
    const article = document.querySelector(".privacy-document");
    const tocLinks = [...document.querySelectorAll(".privacy-toc a")];
    const mobileTocLinks = [...document.querySelectorAll(".privacy-mobile-index a")];
    const hero = document.querySelector(".privacy-hero");
    const header = document.querySelector(".site-chrome-header");
    const images = [...document.images];

    return {
      clientWidth: documentElement.clientWidth,
      scrollWidth: Math.max(body.scrollWidth, documentElement.scrollWidth),
      articleText: article?.innerText ?? "",
      h1Texts: [...document.querySelectorAll("h1")].map((heading) => heading.textContent.trim()),
      tocTargets: tocLinks
        .map((link) => link.getAttribute("href"))
        .filter((href) => !href || !document.querySelector(href)),
      mobileTocTargets: mobileTocLinks
        .map((link) => link.getAttribute("href"))
        .filter((href) => !href || !document.querySelector(href)),
      imageFailures: images
        .filter((image) => !image.complete || image.naturalWidth === 0)
        .map((image) => image.currentSrc || image.src),
      robots: document.querySelector('meta[name="robots"]')?.content ?? "",
      headerBottom: Math.round(header?.getBoundingClientRect().bottom ?? -1),
      heroTop: Math.round(hero?.getBoundingClientRect().top ?? -1),
      fontFamily: getComputedStyle(article?.querySelector("h2") ?? body).fontFamily
    };
  });

  if (result.scrollWidth > result.clientWidth) {
    failures.push(`${width}px: horizontal overflow ${result.scrollWidth}/${result.clientWidth}`);
  }
  if (result.h1Texts.length !== 1 || result.h1Texts[0] !== "Privacy Policy") {
    failures.push(`${width}px: unexpected H1 set ${JSON.stringify(result.h1Texts)}`);
  }
  if (result.tocTargets.length || result.mobileTocTargets.length) {
    failures.push(`${width}px: broken table-of-contents targets`);
  }
  if (result.imageFailures.length) {
    failures.push(`${width}px: failed images ${JSON.stringify(result.imageFailures)}`);
  }
  if (!/noindex/u.test(result.robots) || !/nofollow/u.test(result.robots)) {
    failures.push(`${width}px: robots directives changed`);
  }
  if (result.headerBottom !== result.heroTop) {
    failures.push(`${width}px: header/hero gap ${result.headerBottom}/${result.heroTop}`);
  }
  if (!result.fontFamily.includes("Archivo")) {
    failures.push(`${width}px: display font did not load Archivo`);
  }
  if (normalize(result.articleText) !== policyText) {
    failures.push(`${width}px: article text differs from privacy-policy.md`);
  }
  if (consoleErrors.length) {
    failures.push(`${width}px: console errors ${JSON.stringify(consoleErrors)}`);
  }

  console.log(
    `${width}px: width ${result.clientWidth}/${result.scrollWidth}, `
      + `H1 ${result.h1Texts.length}, images ${result.imageFailures.length} failed, `
      + `chrome edge ${result.headerBottom}/${result.heroTop}`
  );
  await page.close();
}

await browser.close();

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Privacy preview checks passed.");
}
