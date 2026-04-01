// ==UserScript==
// @name         Perplexity Search
// @description  Reindirizza le ricerche dalla barra degli indirizzi a Perplexity AI
// @version      1.2
// @author       lacerbo
// @match        *://*.google.*/search*
// @match        *://*.bing.com/search*
// @match        *://*.duckduckgo.com/*
// @match        *://*.search.yahoo.com/search*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Evita esecuzione in iframe secondari.
  if (window.top !== window.self) return;

  // Safari reliability: multiple execution attempts
  let executed = false;
  
  function executeRedirect() {
    if (executed) return;
    executed = true;

    try {
      const url = new URL(window.location.href);
      const host = url.hostname.toLowerCase();
      const path = url.pathname;
      let query = null;

      const isGoogleHost = /(^|\.)google\.[a-z.]+$/i.test(host);
      const isBingHost = host === "bing.com" || host.endsWith(".bing.com");
      const isDuckDuckGoHost =
        host === "duckduckgo.com" || host.endsWith(".duckduckgo.com");
      const isYahooSearchHost =
        host === "search.yahoo.com" || host.endsWith(".search.yahoo.com");

      // Google (qualsiasi TLD, con o senza subdomain)
      if (isGoogleHost && path === "/search") {
        query = url.searchParams.get("q");
      }
      // Bing
      else if (isBingHost && path === "/search") {
        query = url.searchParams.get("q");
      }
      // DuckDuckGo
      else if (isDuckDuckGoHost && url.searchParams.has("q")) {
        query = url.searchParams.get("q");
      }
      // Yahoo
      else if (isYahooSearchHost && path.startsWith("/search")) {
        query = url.searchParams.get("p");
      }

      const normalizedQuery = query ? query.trim() : "";
      if (!normalizedQuery) return;
      if (normalizedQuery.endsWith("!")) return; // resta sul motore di default

      const target = normalizedQuery.endsWith("?")
        ? new URL("https://grok.com/")
        : new URL("https://www.perplexity.ai/search");

      const finalQuery = normalizedQuery.endsWith("?")
        ? normalizedQuery.slice(0, -1).trim()
        : normalizedQuery;

      if (!finalQuery) return;
      target.searchParams.set("q", finalQuery);
      window.location.replace(target.toString());
    } catch (e) {
      // Silent fallback for Safari compatibility
    }
  }

  // Safari timing fixes: multiple execution strategies
  executeRedirect();
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', executeRedirect);
  }
  
  // Fallback timing
  setTimeout(executeRedirect, 10);
  setTimeout(executeRedirect, 100);
})();
