// ==UserScript==
// @name         Search Query Shortcuts
// @description  Usa prefissi rapidi (yt, gh, so, npm, r, w) nei motori e reindirizza al sito target.
// @version      1.1
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

  if (window.top !== window.self) return;

  // Safari reliability: prevent multiple executions
  let executed = false;
  
  function executeShortcuts() {
    if (executed) return;
    executed = true;

    try {
      const url = new URL(window.location.href);
      const host = url.hostname.toLowerCase();
      const path = url.pathname;

      function getQueryParam() {
        if (/(^|\.)google\./i.test(host) && path === "/search")
          return url.searchParams.get("q");
        if (host === "bing.com" || host.endsWith(".bing.com"))
          return url.searchParams.get("q");
        if (host === "duckduckgo.com" || host.endsWith(".duckduckgo.com"))
          return url.searchParams.get("q");
        if (host === "search.yahoo.com" || host.endsWith(".search.yahoo.com"))
          return url.searchParams.get("p");
        return null;
      }

      const raw = (getQueryParam() || "").trim();
      if (!raw) return;

      // Mantiene compatibilita con il tuo altro script.
      if (raw.endsWith("!")) return;

      const space = raw.indexOf(" ");
      if (space <= 0) return;

      const prefix = raw.slice(0, space).toLowerCase();
      const payload = raw.slice(space + 1).trim();
      if (!payload) return;

      const routes = {
        yt: (q) =>
          `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`,
        gh: (q) => `https://github.com/search?q=${encodeURIComponent(q)}`,
        so: (q) => `https://stackoverflow.com/search?q=${encodeURIComponent(q)}`,
        npm: (q) => `https://www.npmjs.com/search?q=${encodeURIComponent(q)}`,
        r: (q) => `https://www.reddit.com/search/?q=${encodeURIComponent(q)}`,
        w: (q) =>
          `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(q)}`,
      };

      const builder = routes[prefix];
      if (!builder) return;

      window.location.replace(builder(payload));
    } catch (e) {
      // Silent fallback for Safari compatibility
    }
  }

  // Safari timing fixes: multiple execution strategies  
  executeShortcuts();
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', executeShortcuts);
  }
  
  // Fallback timing
  setTimeout(executeShortcuts, 10);
  setTimeout(executeShortcuts, 100);
})();
