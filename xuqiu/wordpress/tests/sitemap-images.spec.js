const { expect, test } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");

const WORDPRESS_ROOT = path.resolve(__dirname, "..");
const SEO_PLUGIN = path.join(
  WORDPRESS_ROOT,
  "mu-plugins",
  "mb-seo-schema.php",
);
const liveBaseUrl = process.env.MB_LIVE_BASE_URL;

function sitemapImages(xml) {
  const entries = new Map();

  for (const match of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const block = match[1];
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
    if (!loc) {
      continue;
    }
    entries.set(
      loc,
      [...block.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map(
        (image) => image[1],
      ),
    );
  }

  return entries;
}

test("ships explicit template-image mappings for Rank Math", () => {
  const source = fs.readFileSync(SEO_PLUGIN, "utf8");

  expect(source).toContain("Version: 1.1.2");
  expect(source).toContain("function mb_seo_sitemap_image_map()");
  expect(source).toContain("'rank_math/sitemap/entry'");
  expect(source).toContain("'home-factory-building.webp'");
  expect(source).toContain("'guide-black-granules.webp'");
  expect(source).toContain("'bk040-product-hero.webp'");
  expect(source).toContain("'dm2476g-product-hero.webp'");
  expect(source).toContain("'pipe-profile-hero.webp'");
  expect(source).toContain("'home-masterbatch-packaging.webp'");
  expect(source).toContain("set_url_scheme(");
  expect(source).toContain("'https'");
});

test("publishes mapped images in the live page sitemap", async ({
  request,
}, testInfo) => {
  test.skip(!liveBaseUrl, "Set MB_LIVE_BASE_URL to run live sitemap checks.");
  test.skip(
    testInfo.project.name !== "desktop",
    "Sitemap XML is viewport-independent.",
  );
  test.setTimeout(120_000);

  const response = await request.get(
    `${liveBaseUrl}/page-sitemap.xml?verify=images`,
  );
  expect(response.status()).toBe(200);
  const entries = sitemapImages(await response.text());

  const expected = new Map([
    [`${liveBaseUrl}/`, 3],
    [`${liveBaseUrl}/products/black-masterbatch/`, 3],
    [`${liveBaseUrl}/products/desiccant-masterbatch/`, 3],
    [`${liveBaseUrl}/products/black-masterbatch/bk040/`, 2],
    [`${liveBaseUrl}/products/desiccant-masterbatch/dm2476g/`, 2],
    [`${liveBaseUrl}/products/black-masterbatch/pipe-profile/`, 1],
    [`${liveBaseUrl}/about-quality/`, 3],
    [`${liveBaseUrl}/technical-documents/`, 1],
  ]);
  const imageUrls = new Set();

  for (const [url, count] of expected) {
    const images = entries.get(url);
    expect(images, url).toBeDefined();
    expect(images.length, url).toBe(count);

    for (const image of images) {
      expect(image.startsWith("https://"), image).toBe(true);
      imageUrls.add(image);
    }
  }

  const assetResponses = await Promise.all(
    [...imageUrls].map(async (image) => ({
      image,
      response: await request.head(image),
    })),
  );

  for (const { image, response } of assetResponses) {
    expect(response.status(), image).toBe(200);
    expect(response.headers()["content-type"], image).toContain("image/webp");
  }
});
