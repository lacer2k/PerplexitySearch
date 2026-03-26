// ==UserScript==
// @name         Strip Tracking Parameters
// @description  Rimuove parametri di tracking dall'URL corrente e dai link della pagina.
// @version      1.0
// @author       lacerbo
// @match        *://*/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  if (window.top !== window.self) return;

  const TRACKING_KEYS = [
    "gclid",
    "fbclid",
    "dclid",
    "msclkid",
    "mc_cid",
    "mc_eid",
    "ref",
    "ref_src",
    "igshid",
    "si",
  ];

  function isTrackingKey(key) {
    const k = key.toLowerCase();
    if (k.startsWith("utm_")) return true;
    if (k.startsWith("pk_")) return true;
    if (k.startsWith("vero_")) return true;
    return TRACKING_KEYS.includes(k);
  }

  function cleanHref(rawHref) {
    if (!rawHref) return rawHref;
    let parsed;
    try {
      parsed = new URL(rawHref, window.location.href);
    } catch (_err) {
      return rawHref;
    }

    const keys = Array.from(parsed.searchParams.keys());
    for (const key of keys) {
      if (isTrackingKey(key)) parsed.searchParams.delete(key);
    }
    return parsed.toString();
  }

  function cleanLocation() {
    const before = window.location.href;
    const after = cleanHref(before);
    if (!after || after === before) return;
    history.replaceState(history.state, document.title, after);
  }

  function cleanAllAnchors() {
    const anchors = document.querySelectorAll("a[href]");
    for (const a of anchors) {
      const cleaned = cleanHref(a.getAttribute("href"));
      if (cleaned && cleaned !== a.href) a.href = cleaned;
    }
  }

  cleanLocation();

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!anchor) return;
      const cleaned = cleanHref(anchor.getAttribute("href"));
      if (cleaned) anchor.href = cleaned;
    },
    true,
  );

  const observer = new MutationObserver(() => cleanAllAnchors());
  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", cleanAllAnchors, {
      once: true,
    });
  } else {
    cleanAllAnchors();
  }
})();
