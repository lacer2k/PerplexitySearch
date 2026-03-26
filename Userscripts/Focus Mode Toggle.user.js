// ==UserScript==
// @name         Focus Mode Toggle
// @description  Attiva/disattiva una modalita focus con Alt+Shift+F (o Cmd+Shift+F su macOS).
// @version      1.0
// @author       lacerbo
// @match        *://*/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  if (window.top !== window.self) return;

  const CLASS_NAME = "ps-focus-mode-active";
  const STYLE_ID = "ps-focus-mode-style";
  const KEY = "ps_focus_mode_enabled";

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      body.${CLASS_NAME} { overflow-x: hidden !important; }
      body.${CLASS_NAME} header,
      body.${CLASS_NAME} nav,
      body.${CLASS_NAME} aside,
      body.${CLASS_NAME} footer,
      body.${CLASS_NAME} [role="complementary"],
      body.${CLASS_NAME} [aria-label*="advert"],
      body.${CLASS_NAME} [class*="ad-"],
      body.${CLASS_NAME} [id*="ad-"] {
        display: none !important;
      }
      body.${CLASS_NAME} main,
      body.${CLASS_NAME} article,
      body.${CLASS_NAME} [role="main"] {
        max-width: 860px !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }
      body.${CLASS_NAME} #comments,
      body.${CLASS_NAME} #related,
      body.${CLASS_NAME} ytd-comments,
      body.${CLASS_NAME} ytd-watch-next-secondary-results-renderer,
      body.${CLASS_NAME} #secondary {
        display: none !important;
      }
      #ps-focus-badge {
        position: fixed;
        z-index: 2147483647;
        left: 16px;
        bottom: 16px;
        background: #0f172a;
        color: #e2e8f0;
        border: 1px solid #334155;
        border-radius: 999px;
        padding: 8px 12px;
        font: 12px -apple-system, BlinkMacSystemFont, sans-serif;
        box-shadow: 0 8px 18px rgba(0, 0, 0, 0.25);
      }
    `;
    document.documentElement.appendChild(style);
  }

  function setBadge(visible) {
    const current = document.getElementById("ps-focus-badge");
    if (!visible) {
      if (current) current.remove();
      return;
    }
    if (current) return;
    const badge = document.createElement("div");
    badge.id = "ps-focus-badge";
    badge.textContent = "Focus mode attivo";
    document.body.appendChild(badge);
  }

  function setFocus(enabled) {
    ensureStyle();
    document.body.classList.toggle(CLASS_NAME, enabled);
    localStorage.setItem(KEY, enabled ? "1" : "0");
    setBadge(enabled);
  }

  function toggleFocus() {
    const enabled = !document.body.classList.contains(CLASS_NAME);
    setFocus(enabled);
  }

  const autoEnabled = localStorage.getItem(KEY) === "1";
  if (autoEnabled) setFocus(true);

  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    const isMac = event.metaKey && event.shiftKey && key === "f";
    const isAlt = event.altKey && event.shiftKey && key === "f";
    if (!isMac && !isAlt) return;
    if (event.ctrlKey) return;
    event.preventDefault();
    toggleFocus();
  });
})();
