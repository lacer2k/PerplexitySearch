const api = typeof browser !== "undefined" ? browser : chrome;
const toggle = document.getElementById("toggle");
const status = document.getElementById("status");

const MESSAGES = {
  on: "Le ricerche verranno reindirizzate a Perplexity AI",
  off: "Redirect disattivato — ricerche normali",
};

// Carica stato corrente
api.storage.local.get("enabled", (result) => {
  const isEnabled = result.enabled !== undefined ? result.enabled : true;
  toggle.checked = isEnabled;
  status.textContent = isEnabled ? MESSAGES.on : MESSAGES.off;
});

// Gestisci toggle
toggle.addEventListener("change", () => {
  const isEnabled = toggle.checked;
  api.storage.local.set({ enabled: isEnabled });
  status.textContent = isEnabled ? MESSAGES.on : MESSAGES.off;
});
