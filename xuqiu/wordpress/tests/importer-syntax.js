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

for (const phpPath of [
  importerPath,
  themeFunctionsPath,
  rfqPluginPath,
  rfqRuntimeSmokePath,
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
