// ==UserScript==
// @name         Copy Title and URL as Markdown
// @description  Copia negli appunti "[Titolo](URL)" con scorciatoia da tastiera.
// @version      1.0
// @author       lacerbo
// @match        *://*/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  if (window.top !== window.self) return;

  function cleanUrl(rawUrl) {
    const u = new URL(rawUrl);
    const blocked = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "gclid",
      "fbclid",
      "mc_cid",
      "mc_eid",
    ];
    for (const key of blocked) u.searchParams.delete(key);
    return u.toString();
  }

  function showToast(text) {
    const el = document.createElement("div");
    el.textContent = text;
    el.style.cssText = [
      "position:fixed",
      "z-index:2147483647",
      "right:16px",
      "bottom:16px",
      "padding:10px 12px",
      "border-radius:10px",
      "font:12px -apple-system, BlinkMacSystemFont, sans-serif",
      "background:#111",
      "color:#fff",
      "box-shadow:0 6px 20px rgba(0,0,0,0.3)",
    ].join(";");
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1400);
  }

  async function copyMarkdown() {
    const title = (document.title || "Untitled").replace(/\s+/g, " ").trim();
    const url = cleanUrl(window.location.href);
    const markdown = `[${title}](${url})`;

    try {
      await navigator.clipboard.writeText(markdown);
      showToast("Copiato in Markdown");
      return;
    } catch (_err) {
      const area = document.createElement("textarea");
      area.value = markdown;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
      showToast("Copiato in Markdown");
    }
  }

  document.addEventListener("keydown", (event) => {
    const isMacCombo =
      event.metaKey && event.shiftKey && event.key.toLowerCase() === "c";
    const isAltCombo =
      event.altKey && event.shiftKey && event.key.toLowerCase() === "c";
    if (!isMacCombo && !isAltCombo) return;
    if (event.ctrlKey) return;

    event.preventDefault();
    copyMarkdown();
  });
})();
