// ==UserScript==
// @name         Perplexity Search
// @description  Reindirizza le ricerche dalla barra degli indirizzi a Perplexity AI
// @version      1.0
// @author       lacerbo
// @match        *://www.google.com/search*
// @match        *://www.google.it/search*
// @match        *://www.google.co.uk/search*
// @match        *://www.google.de/search*
// @match        *://www.google.fr/search*
// @match        *://www.google.es/search*
// @match        *://www.google.ca/search*
// @match        *://www.google.com.au/search*
// @match        *://www.google.co.jp/search*
// @match        *://www.google.com.br/search*
// @match        *://www.bing.com/search*
// @match        *://duckduckgo.com/*
// @match        *://search.yahoo.com/search*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const url = new URL(window.location.href);
  const host = url.hostname;
  const path = url.pathname;
  let query = null;

  // Google (qualsiasi TLD)
  if (/^www\.google\./.test(host) && path === "/search") {
    query = url.searchParams.get("q");
  }
  // Bing
  else if (host === "www.bing.com" && path === "/search") {
    query = url.searchParams.get("q");
  }
  // DuckDuckGo
  else if (host === "duckduckgo.com" && url.searchParams.has("q")) {
    query = url.searchParams.get("q");
  }
  // Yahoo
  else if (host === "search.yahoo.com" && path.startsWith("/search")) {
    query = url.searchParams.get("p");
  }

  if (query) {
    if (query.endsWith("!")) return; // resta sul motore di default
    let targetUrl;
    if (query.endsWith("?")) {
      targetUrl = "https://grok.com/?q=" + encodeURIComponent(query.slice(0, -1));
    } else {
      targetUrl = "https://www.perplexity.ai/search?q=" + encodeURIComponent(query);
    }
    window.location.replace(targetUrl);
  }
})();
