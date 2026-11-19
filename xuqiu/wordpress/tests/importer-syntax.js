const fs = require("node:fs");
const path = require("node:path");
const PhpParser = require("php-parser");

const importerPath = path.resolve(
  __dirname,
  "../mu-plugins/mb-content-importer.php",
);
const themeFunctionsPath = path.resolve(
  __dirname,
  "../themes/mtm-b2b-masterbatch/functions.php",
);
const rfqPluginPath = path.resolve(
  __dirname,
  "../mu-plugins/mb-rfq-submissions.php",
);
const rfqRuntimeSmokePath = path.resolve(__dirname, "rfq-runtime-smoke.php");
const importerTestPath = path.resolve(__dirname, "test-importer.php");
const seoSchemaPluginPath = path.resolve(
  __dirname,
  "../mu-plugins/mb-seo-schema.php",
);
const seoAuditMigrationPath = path.resolve(
  __dirname,
  "../bin/apply-seo-audit-fixes.php",
);
const cleanupUnusedContentPath = path.resolve(
  __dirname,
  "../bin/cleanup-unused-content.php",
);
const removeWhiteColorProductsPath = path.resolve(
  __dirname,
  "../bin/apply-remove-white-color-products.php",
);
const patchRemoveWhiteColorFunctionsPath = path.resolve(
  __dirname,
  "../bin/patch-remove-white-color-functions.php",
);

for (const phpPath of [
  importerPath,
  themeFunctionsPath,
  rfqPluginPath,
  rfqRuntimeSmokePath,
  importerTestPath,
  seoSchemaPluginPath,
  seoAuditMigrationPath,
  cleanupUnusedContentPath,
  removeWhiteColorProductsPath,
  patchRemoveWhiteColorFunctionsPath,
]) {
  const source = fs.readFileSync(phpPath, "utf8");
  const parser = new PhpParser({
    parser: {
      extractDoc: true,
      suppressErrors: false,
    },
    ast: {
      withPositions: true,
    },
  });

  parser.parseCode(source, phpPath);
  console.log(`OK: ${path.basename(phpPath)} parses as valid PHP.`);
}
