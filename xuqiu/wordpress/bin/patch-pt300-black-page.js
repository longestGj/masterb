const fs = require("node:fs");

const [templateInput, templateOutput, cssInput, cssOutput] =
  process.argv.slice(2);
if (!templateInput || !templateOutput || !cssInput || !cssOutput) {
  throw new Error(
    "Usage: node patch-pt300-black-page.js <template-in> <template-out> <css-in> <css-out>",
  );
}

let template = fs
  .readFileSync(templateInput, "utf8")
  .replace(/\r\n/g, "\n");
let css = fs
  .readFileSync(cssInput, "utf8")
  .replace(/\r\n/g, "\n");

if (!template.includes('class="bm-pt300-callout"')) {
  const anchor = "</table>\n      </div>";
  const count = template.split(anchor).length - 1;
  if (count !== 1) {
    throw new Error(`Expected one grade-table anchor, found ${count}.`);
  }
  const callout = `${anchor}
      <aside class="bm-pt300-callout" aria-labelledby="pt300-range-title">
        <div>
          <span>PT filled series</span>
          <h3 id="pt300-range-title">PT-300 · 25% carbon black</h3>
          <p>A filled 25% option with a 21% LLDPE + LDPE carrier and 41.8% CaCO₃ filler for film blowing, injection molding and re-granulating.</p>
        </div>
        <a class="bm-text-link" href="/products/black-masterbatch/pt-300/">Review PT-300</a>
      </aside>`;
  template = template.replace(anchor, callout);
}

if (!template.includes('class="bm-pt450p-callout"')) {
  const anchor = `        <a class="bm-text-link" href="/products/black-masterbatch/pt-300/">Review PT-300</a>
      </aside>`;
  const count = template.split(anchor).length - 1;
  if (count !== 1) {
    throw new Error(`Expected one PT-300 callout anchor, found ${count}.`);
  }
  const callout = `${anchor}
      <aside class="bm-pt450p-callout" aria-labelledby="pt450p-range-title">
        <div>
          <span>PT no-filler series</span>
          <h3 id="pt450p-range-title">PT-450P · 42% P-type carbon black</h3>
          <p>A high-loading grade with a 57.8% virgin LLDPE carrier and no filler for film blowing and injection molding. The current TDS lists Food Grade: Yes.</p>
        </div>
        <a class="bm-text-link" href="/products/black-masterbatch/pt-450p/">Review PT-450P</a>
      </aside>`;
  template = template.replace(anchor, callout);
}

if (!css.includes(".bm-pt300-callout")) {
  css += `

/* PT-300 filled grade range entry. */
.bm-pt300-callout {
  display: flex;
  margin-top: var(--ge-space-md);
  padding: var(--ge-space-md) var(--ge-card-padding);
  justify-content: space-between;
  gap: var(--ge-space-lg);
  align-items: center;
  background: var(--ge-color-surface-soft);
  border: 1px solid var(--ge-color-border);
}

.bm-pt300-callout span {
  color: var(--ge-color-primary);
  font-family: var(--ge-font-mono);
  font-size: 0.62rem;
  font-weight: 750;
  text-transform: uppercase;
}

.bm-pt300-callout h3 {
  margin-top: var(--ge-space-xs);
  font-size: 1.45rem;
}

.bm-pt300-callout p {
  max-width: 720px;
  margin-top: var(--ge-space-xs);
  color: var(--ge-color-text-muted);
  font-size: 0.78rem;
}

.bm-pt300-callout .bm-text-link {
  flex: 0 0 auto;
}

@media (max-width: 760px) {
  .bm-pt300-callout {
    align-items: flex-start;
    flex-direction: column;
  }

  .bm-pt300-callout .bm-text-link {
    min-height: var(--ge-control-height);
  }
}
`;
}

if (!css.includes(".bm-pt450p-callout")) {
  css += `

/* PT-450P no-filler grade range entry. */
.bm-pt450p-callout {
  display: flex;
  margin-top: var(--ge-space-md);
  padding: var(--ge-space-md) var(--ge-card-padding);
  justify-content: space-between;
  gap: var(--ge-space-lg);
  align-items: center;
  background: var(--ge-color-surface-soft);
  border: 1px solid var(--ge-color-border);
}

.bm-pt450p-callout span {
  color: var(--ge-color-primary);
  font-family: var(--ge-font-mono);
  font-size: 0.62rem;
  font-weight: 750;
  text-transform: uppercase;
}

.bm-pt450p-callout h3 {
  margin-top: var(--ge-space-xs);
  font-size: 1.45rem;
}

.bm-pt450p-callout p {
  max-width: 720px;
  margin-top: var(--ge-space-xs);
  color: var(--ge-color-text-muted);
  font-size: 0.78rem;
}

.bm-pt450p-callout .bm-text-link {
  flex: 0 0 auto;
}

@media (max-width: 760px) {
  .bm-pt450p-callout {
    align-items: flex-start;
    flex-direction: column;
  }

  .bm-pt450p-callout .bm-text-link {
    min-height: var(--ge-control-height);
  }
}
`;
}

fs.writeFileSync(templateOutput, template);
fs.writeFileSync(cssOutput, css);
console.log(`Wrote ${templateOutput} and ${cssOutput}`);
