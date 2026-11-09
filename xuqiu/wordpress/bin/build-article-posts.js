const fs = require("node:fs");
const path = require("node:path");

const wordpressRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(wordpressRoot, "../..");
const outputRoot = path.join(wordpressRoot, "content/posts");

const articles = [
  {
    source: path.join(
      repoRoot,
      "wenzhang/Masterbatch_for_Film_and_Blown_Film_Selection_Guide.md",
    ),
    output: "masterbatch-for-blown-film",
    title: "How to Choose Masterbatch for Blown Film",
    heroTitle: "How to choose masterbatch for blown film.",
    slug: "masterbatch-for-blown-film",
    seoTitle: "Masterbatch for Blown Film: Buyer Guide | GE CHEMICAL",
    description:
      "Choose masterbatch for blown film by resin, carrier, structure, thickness, let-down ratio, end use and trial conditions.",
    excerpt:
      "Use resin, carrier, film structure, thickness, let-down ratio and trial conditions to select masterbatch for blown film.",
    primaryKeyword: "masterbatch for blown film",
    category: "Masterbatch Guides",
    categorySlug: "masterbatch-guides",
    tags: ["blown film", "film masterbatch", "black masterbatch"],
    featuredImage: "images/masterbatch-film-guide.webp",
    featuredAlt:
      "Masterbatch production equipment in a manufacturing workshop",
  },
  {
    source: path.join(
      repoRoot,
      "wenzhang/Poor_Dispersion_and_Black_Specks_Diagnostic_Guide.md",
    ),
    output: "black-specks-in-masterbatch-film",
    title:
      "Poor Dispersion and Black Specks in Masterbatch Film: A Diagnostic Guide",
    heroTitle: "Poor dispersion and black specks in masterbatch film.",
    slug: "black-specks-in-masterbatch-film",
    seoTitle: "Black Specks in Masterbatch Film: Diagnostic Guide",
    description:
      "Trace black specks, streaks and poor dispersion in plastic film with a control sample, batch records and a controlled verification step.",
    excerpt:
      "Collect a control sample and production records, compare possible material and process directions, and verify the defect with a controlled trial.",
    primaryKeyword: "poor dispersion masterbatch",
    category: "Masterbatch Guides",
    categorySlug: "masterbatch-guides",
    tags: ["black specks", "poor dispersion", "film masterbatch"],
    featuredImage: "images/black-specks-diagnostic.webp",
    featuredAlt: "Black masterbatch pellets in a close product view",
  },
  {
    source: path.join(
      repoRoot,
      "wenzhang/How_to_Vet_a_Masterbatch_Supplier.md",
    ),
    output: "how-to-vet-a-masterbatch-supplier",
    title: "How to Vet a Masterbatch Supplier: A Practical Buyer Checklist",
    heroTitle: "How to vet a masterbatch supplier.",
    slug: "how-to-vet-a-masterbatch-supplier",
    seoTitle: "How to Vet a Masterbatch Supplier | GE CHEMICAL",
    description:
      "Check the supplier entity, product documents, sample trial, batch controls and quotation terms before buying masterbatch.",
    excerpt:
      "Use one supplier review to check the legal entity, technical documents, sample trial, batch controls, quotation basis and change process.",
    primaryKeyword: "how to choose a masterbatch supplier",
    category: "Masterbatch Guides",
    categorySlug: "masterbatch-guides",
    tags: [
      "masterbatch supplier",
      "supplier vetting",
      "buyer checklist",
    ],
    featuredImage: "images/masterbatch-supplier-vetting.webp",
    featuredAlt: "Masterbatch factory building and production site",
  },
  {
    source: path.join(
      repoRoot,
      "wenzhang/How_to_Choose_Carbon_Black_Content.md",
    ),
    output: "how-to-choose-carbon-black-content",
    title: "How to Choose Carbon Black Content in Black Masterbatch",
    heroTitle: "How to choose carbon black content in black masterbatch.",
    slug: "how-to-choose-carbon-black-content",
    seoTitle: "Carbon Black Content in Black Masterbatch Guide | GE CHEMICAL",
    description:
      "Compare 20%, 30%, 35% and 40% carbon black masterbatch grades by resin, filler, dispersion, use rate, trial results and cost per tonne.",
    excerpt:
      "Use resin, filler, dispersion, let-down ratio and a line trial to choose the right carbon black content for black masterbatch.",
    primaryKeyword: "carbon black content in black masterbatch",
    category: "Masterbatch Guides",
    categorySlug: "masterbatch-guides",
    tags: [
      "carbon black content",
      "black masterbatch selection",
      "masterbatch cost",
    ],
    featuredImage: "images/masterbatch-carbon-black-content.webp",
    featuredAlt: "Masterbatch product granules in a close product view",
  },
];

function inline(text) {
  let value = text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

  value = value.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  value = value.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_match, label, url) => {
      if (!/^(?:https?:\/\/|\/)/.test(url)) {
        throw new Error(`Unsupported link URL: ${url}`);
      }
      return `<a href="${url}">${label}</a>`;
    },
  );

  return value;
}

function heading(level, text, anchor) {
  const attributes = anchor
    ? ` {"level":${level},"anchor":"${anchor}"}`
    : ` {"level":${level}}`;
  return `<!-- wp:heading${attributes} -->\n<h${level}${
    anchor ? ` id="${anchor}"` : ""
  }>${inline(text)}</h${level}>\n<!-- /wp:heading -->`;
}

function listBlock(items, ordered = false) {
  const tag = ordered ? "ol" : "ul";
  const body = items
    .map(
      (item) =>
        `<!-- wp:list-item -->\n<li>${inline(item)}</li>\n<!-- /wp:list-item -->`,
    )
    .join("\n");

  return `<!-- wp:list${ordered ? ' {"ordered":true}' : ""} -->\n<${tag} class="wp-block-list">\n${body}\n</${tag}>\n<!-- /wp:list -->`;
}

function tableBlock(lines) {
  const cells = (line) =>
    line
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((cell) => cell.trim());

  const headers = cells(lines[0]);
  const rows = lines.slice(2).map(cells);
  const head = headers.map((cell) => `<th>${inline(cell)}</th>`).join("");
  const body = rows
    .map(
      (row) =>
        `<tr>${row
          .map(
            (cell, index) =>
              `<td data-label="${headers[index]
                .replaceAll("&", "&amp;")
                .replaceAll('"', "&quot;")
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")}">${inline(cell)}</td>`,
          )
          .join("")}</tr>`,
    )
    .join("");

  return `<!-- wp:table -->\n<figure class="wp-block-table"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></figure>\n<!-- /wp:table -->`;
}

function quoteBlock(lines) {
  const groups = [[]];
  for (const line of lines) {
    const text = line.replace(/^>\s?/, "");
    if ("" === text.trim()) {
      if (groups.at(-1).length) {
        groups.push([]);
      }
      continue;
    }
    groups.at(-1).push(text.replace(/^-\s+/, "• "));
  }

  const paragraphs = groups
    .filter((group) => group.length)
    .map((group) => `<p>${group.map(inline).join("<br>")}</p>`)
    .join("");

  return `<!-- wp:quote -->\n<blockquote class="wp-block-quote">${paragraphs}</blockquote>\n<!-- /wp:quote -->`;
}

function markdownToBlocks(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if ("" === line.trim()) {
      index++;
      continue;
    }

    const headingMatch = line.match(/^(#{2,3})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      blocks.push(
        heading(level, text, "Buyer articles" === text ? "articles" : ""),
      );
      index++;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quoteLines = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quoteLines.push(lines[index]);
        index++;
      }
      blocks.push(quoteBlock(quoteLines));
      continue;
    }

    if (/^\-\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^\-\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\-\s+/, ""));
        index++;
      }
      blocks.push(listBlock(items));
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\d+\.\s+/, ""));
        index++;
      }
      blocks.push(listBlock(items, true));
      continue;
    }

    if (
      line.trim().startsWith("|")
      && lines[index + 1]
      && /^\|(?:\s*:?-{3,}:?\s*\|)+\s*$/.test(lines[index + 1].trim())
    ) {
      const tableLines = [];
      while (
        index < lines.length
        && "" !== lines[index].trim()
        && lines[index].trim().startsWith("|")
      ) {
        tableLines.push(lines[index]);
        index++;
      }
      blocks.push(tableBlock(tableLines));
      continue;
    }

    const paragraph = [];
    while (index < lines.length) {
      const current = lines[index];
      if (
        "" === current.trim()
        || /^#{2,3}\s+/.test(current)
        || /^>\s?/.test(current)
        || /^\-\s+/.test(current)
        || /^\d+\.\s+/.test(current)
        || current.trim().startsWith("|")
      ) {
        break;
      }
      paragraph.push(current.trim());
      index++;
    }

    blocks.push(
      `<!-- wp:paragraph -->\n<p>${inline(paragraph.join(" "))}</p>\n<!-- /wp:paragraph -->`,
    );
  }

  return blocks.join("\n\n");
}

function publicArticle(source) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  let index = 0;

  while (index < lines.length && "" === lines[index].trim()) {
    index++;
  }
  if (/^#\s+/.test(lines[index] || "")) {
    index++;
  }

  while (index < lines.length && "" === lines[index].trim()) {
    index++;
  }
  while (index < lines.length && /^>\s?/.test(lines[index])) {
    index++;
  }

  const body = lines.slice(index).join("\n");
  const notesIndex = body.indexOf("\n## Internal review notes");
  return (notesIndex === -1 ? body : body.slice(0, notesIndex)).trim();
}

function pageBody(source) {
  const match = source.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
  if (!match) {
    throw new Error("Page source has invalid Front Matter.");
  }
  return match[1].trim();
}

fs.mkdirSync(outputRoot, { recursive: true });
const manifest = [];

for (const article of articles) {
  const source = fs.readFileSync(article.source, "utf8");
  const blocks = markdownToBlocks(publicArticle(source));
  const outputPath = path.join(
    outputRoot,
    `${article.output}.wordpress.html`,
  );
  fs.writeFileSync(outputPath, `${blocks}\n`);

  manifest.push({
    title: article.title,
    heroTitle: article.heroTitle,
    slug: article.slug,
    seoTitle: article.seoTitle,
    description: article.description,
    excerpt: article.excerpt,
    primaryKeyword: article.primaryKeyword,
    category: article.category,
    categorySlug: article.categorySlug,
    tags: article.tags,
    featuredImage: article.featuredImage,
    featuredAlt: article.featuredAlt,
    contentFile: path.relative(wordpressRoot, outputPath),
  });
}

const resourcesSource = fs.readFileSync(
  path.join(wordpressRoot, "content/pages/resources.md"),
  "utf8",
);
fs.writeFileSync(
  path.join(outputRoot, "resources.wordpress.html"),
  `${markdownToBlocks(pageBody(resourcesSource))}\n`,
);
fs.writeFileSync(
  path.join(outputRoot, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

console.log(`Built ${articles.length} article packages and the resources index.`);
