// test.js — test della logica di routing (Node.js, nessuna dipendenza)

const PERPLEXITY_BASE = "https://www.perplexity.ai/search?q=";
const GROK_BASE = "https://grok.com/?q=";

// ── Replica di extractSearchQuery ────────────────────────────────────────────
function extractSearchQuery(urlString) {
  try {
    const url = new URL(urlString);
    const host = url.hostname;
    const path = url.pathname;

    if (/^www\.google\./.test(host) && path === "/search") return url.searchParams.get("q");
    if (host === "www.bing.com" && path === "/search")     return url.searchParams.get("q");
    if (host === "duckduckgo.com" && url.searchParams.has("q")) return url.searchParams.get("q");
    if (host === "search.yahoo.com" && path.startsWith("/search")) return url.searchParams.get("p");

    return null;
  } catch (e) {
    return null;
  }
}

// ── Replica della logica di routing ──────────────────────────────────────────
function resolveTarget(query) {
  if (!query) return null;
  if (query.endsWith("!")) return "PASSTHROUGH"; // resta sul motore di default
  if (query.endsWith("?")) return GROK_BASE + encodeURIComponent(query.slice(0, -1));
  return PERPLEXITY_BASE + encodeURIComponent(query);
}

// ── Mini test runner ──────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;

function expect(description, actual, expected) {
  if (actual === expected) {
    console.log(`  ✓  ${description}`);
    passed++;
  } else {
    console.error(`  ✗  ${description}`);
    console.error(`       atteso : ${expected}`);
    console.error(`       ricevuto: ${actual}`);
    failed++;
  }
}

// ── Test: extractSearchQuery ──────────────────────────────────────────────────
console.log("\n[extractSearchQuery]");

expect(
  "Google .com",
  extractSearchQuery("https://www.google.com/search?q=hello+world"),
  "hello world"
);
expect(
  "Google .it",
  extractSearchQuery("https://www.google.it/search?q=ciao"),
  "ciao"
);
expect(
  "Google .co.uk",
  extractSearchQuery("https://www.google.co.uk/search?q=test"),
  "test"
);
expect(
  "Bing",
  extractSearchQuery("https://www.bing.com/search?q=bing+query"),
  "bing query"
);
expect(
  "DuckDuckGo",
  extractSearchQuery("https://duckduckgo.com/?q=duck+test"),
  "duck test"
);
expect(
  "Yahoo",
  extractSearchQuery("https://search.yahoo.com/search?p=yahoo+query"),
  "yahoo query"
);
expect(
  "URL non corrispondente → null",
  extractSearchQuery("https://www.example.com/search?q=foo"),
  null
);
expect(
  "URL malformato → null",
  extractSearchQuery("not-a-url"),
  null
);

// ── Test: routing ─────────────────────────────────────────────────────────────
console.log("\n[routing]");

expect(
  "Query normale → Perplexity",
  resolveTarget("hello world"),
  PERPLEXITY_BASE + encodeURIComponent("hello world")
);
expect(
  "Query con ? finale → Grok (senza ?)",
  resolveTarget("chi ha inventato internet?"),
  GROK_BASE + encodeURIComponent("chi ha inventato internet")
);
expect(
  "Query con ! finale → PASSTHROUGH",
  resolveTarget("cerca qui!"),
  "PASSTHROUGH"
);
expect(
  "Query vuota → null",
  resolveTarget(""),
  null
);
expect(
  "Solo ? → Grok con query vuota",
  resolveTarget("?"),
  GROK_BASE + encodeURIComponent("")
);
expect(
  "Solo ! → PASSTHROUGH",
  resolveTarget("!"),
  "PASSTHROUGH"
);
expect(
  "Query con ? nel mezzo → Perplexity (invariata)",
  resolveTarget("what is 2+2? really"),
  PERPLEXITY_BASE + encodeURIComponent("what is 2+2? really")
);
expect(
  "Query con ! nel mezzo → Perplexity (invariata)",
  resolveTarget("hello! world"),
  PERPLEXITY_BASE + encodeURIComponent("hello! world")
);
expect(
  "Caratteri speciali encodati correttamente",
  resolveTarget("café & résumé"),
  PERPLEXITY_BASE + encodeURIComponent("café & résumé")
);

// ── Riepilogo ─────────────────────────────────────────────────────────────────
console.log(`\n────────────────────────────────`);
console.log(`  Passati: ${passed}  Falliti: ${failed}`);
console.log(`────────────────────────────────\n`);
process.exit(failed > 0 ? 1 : 0);
