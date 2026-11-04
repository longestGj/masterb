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

for (const phpPath of [importerPath, themeFunctionsPath]) {
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
