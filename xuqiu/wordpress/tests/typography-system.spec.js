const { expect, test } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");

const WORDPRESS_ROOT = path.resolve(__dirname, "..");
const THEME_ROOT = path.join(
  WORDPRESS_ROOT,
  "themes",
  "mtm-b2b-masterbatch",
);

function readThemeFile(relativePath) {
  return fs.readFileSync(path.join(THEME_ROOT, relativePath), "utf8");
}

function readFontData(relativePath) {
  return fs
    .readFileSync(path.join(THEME_ROOT, relativePath))
    .toString("base64");
}

test("uses the shared self-hosted Archivo and Inter type system", async ({
  page,
}) => {
  const designTokens = readThemeFile("assets/css/design-tokens.css");
  const baseStyles = readThemeFile("style.css");
  const archivo = readFontData(
    "assets/fonts/archivo/archivo-latin-variable.woff2",
  );
  const inter = readFontData(
    "assets/fonts/inter/inter-latin-variable.woff2",
  );

  expect(designTokens).toContain(
    '--ge-font-display: Archivo, "Helvetica Neue", Arial, sans-serif;',
  );
  expect(designTokens).toContain(
    '--ge-font-sans: Inter, "Helvetica Neue", Arial, sans-serif;',
  );
  expect(baseStyles).toContain("font-weight: 600;");
  expect(designTokens).not.toContain("fonts.googleapis.com");
  expect(archivo.length).toBeGreaterThan(40_000);
  expect(inter.length).toBeGreaterThan(55_000);

  await page.setContent(`
    <!doctype html>
    <html lang="en">
      <head>
        <style>
          @font-face {
            font-family: "Archivo";
            src: url(data:font/woff2;base64,${archivo}) format("woff2");
            font-style: normal;
            font-weight: 400 700;
          }
          @font-face {
            font-family: "Inter";
            src: url(data:font/woff2;base64,${inter}) format("woff2");
            font-style: normal;
            font-weight: 400 700;
          }
          :root {
            --ge-font-display: Archivo, sans-serif;
            --ge-font-sans: Inter, sans-serif;
          }
          html, body, button, input, select, textarea {
            font-family: var(--ge-font-sans);
          }
          h1, h2, h3, .wp-block-post-title {
            font-family: var(--ge-font-display);
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <h1>Masterbatch for production</h1>
        <p>Material review follows the resin and process.</p>
        <button>Get a quote</button>
        <input aria-label="Application">
      </body>
    </html>
  `);
  await page.evaluate(() => document.fonts.ready);

  const typography = await page.evaluate(() => {
    const read = (selector) => {
      const style = getComputedStyle(document.querySelector(selector));
      return { family: style.fontFamily, weight: style.fontWeight };
    };

    return {
      body: read("body"),
      heading: read("h1"),
      button: read("button"),
      input: read("input"),
    };
  });

  expect(typography.body.family).toContain("Inter");
  expect(typography.heading.family).toContain("Archivo");
  expect(typography.heading.weight).toBe("600");
  expect(typography.button.family).toContain("Inter");
  expect(typography.input.family).toContain("Inter");
});
