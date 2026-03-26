// ==UserScript==
// @name         Search Results Cleaner
// @description  Ripulisce risultati su Google/Bing/DDG/Yahoo nascondendo moduli rumorosi e sponsored.
// @version      1.0
// @author       lacerbo
// @match        *://*.google.*/search*
// @match        *://*.bing.com/search*
// @match        *://*.duckduckgo.com/*
// @match        *://*.search.yahoo.com/search*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  if (window.top !== window.self) return;

  const style = document.createElement("style");
  style.textContent = `
    .ps-cleaner-hide { display: none !important; }
  `;
  document.documentElement.appendChild(style);

  const host = window.location.hostname.toLowerCase();

  function hideBySelectors(selectors) {
    for (const selector of selectors) {
      const nodes = document.querySelectorAll(selector);
      for (const node of nodes) node.classList.add("ps-cleaner-hide");
    }
  }

  function cleanGoogle() {
    hideBySelectors([
      "#taw",
      "#rhs",
      "div[aria-label='Sponsored']",
      "div[data-text-ad]",
      "div[data-sokoban-grid]",
      ".commercial-unit-desktop-top",
    ]);
  }

  function cleanBing() {
    hideBySelectors([
      "#b_context",
      "#b_pole",
      ".b_ad",
      ".ads",
      "[data-la='ADS']",
    ]);
  }

  function cleanDuckDuckGo() {
    hideBySelectors([
      "[data-testid='sidebar']",
      ".badge--ad",
      "[data-layout='ad']",
      ".module--carousel",
    ]);
  }

  function cleanYahoo() {
    hideBySelectors([
      "#right",
      ".ad",
      ".dd .layoutMiddle",
      "[data-test-locator='ad']",
    ]);
  }

  function run() {
    if (/(^|\.)google\./i.test(host)) {
      cleanGoogle();
      return;
    }
    if (host === "bing.com" || host.endsWith(".bing.com")) {
      cleanBing();
      return;
    }
    if (host === "duckduckgo.com" || host.endsWith(".duckduckgo.com")) {
      cleanDuckDuckGo();
      return;
    }
    if (host === "search.yahoo.com" || host.endsWith(".search.yahoo.com")) {
      cleanYahoo();
    }
  }

  run();

  const observer = new MutationObserver(() => run());
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
