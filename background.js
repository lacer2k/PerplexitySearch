// Perplexity Search - Background Script (MV3)
// Intercetta le ricerche dai motori di ricerca e le reindirizza a Perplexity AI

const api = typeof browser !== "undefined" ? browser : chrome;
const PERPLEXITY_BASE = "https://www.perplexity.ai/search?q=";
const GROK_BASE = "https://grok.com/?q=";

let enabled = true;

// Carica lo stato salvato
api.storage.local.get("enabled", (result) => {
  enabled = result.enabled !== undefined ? result.enabled : true;
});

// Ascolta cambiamenti allo stato
api.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    enabled = changes.enabled.newValue;
  }
});

/**
 * Estrae il parametro di ricerca dall'URL di un motore di ricerca.
 * Restituisce null se l'URL non corrisponde a nessun pattern noto.
 */
function extractSearchQuery(urlString) {
  try {
    const url = new URL(urlString);
    const host = url.hostname;
    const path = url.pathname;

    // Google (tutti i TLD)
    if (/^www\.google\./.test(host) && path === "/search") {
      return url.searchParams.get("q");
    }

    // Bing
    if (host === "www.bing.com" && path === "/search") {
      return url.searchParams.get("q");
    }

    // DuckDuckGo
    if (host === "duckduckgo.com" && url.searchParams.has("q")) {
      return url.searchParams.get("q");
    }

    // Yahoo
    if (host === "search.yahoo.com" && path.startsWith("/search")) {
      return url.searchParams.get("p");
    }

    return null;
  } catch (e) {
    return null;
  }
}

// Intercetta la navigazione prima che avvenga
api.webNavigation.onBeforeNavigate.addListener((details) => {
  // Solo frame principale, ignora iframe
  if (!enabled || details.frameId !== 0) return;

  const query = extractSearchQuery(details.url);

  if (query) {
    if (query.endsWith("!")) return; // resta sul motore di default
    let targetUrl;
    if (query.endsWith("?")) {
      targetUrl = GROK_BASE + encodeURIComponent(query.slice(0, -1));
    } else {
      targetUrl = PERPLEXITY_BASE + encodeURIComponent(query);
    }
    api.tabs.update(details.tabId, { url: targetUrl });
  }
});
