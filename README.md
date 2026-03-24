# Perplexity Search for Safari

Userscript that redirects address bar searches from your default search engine to [Perplexity AI](https://www.perplexity.ai).

## How it works

When you type a query in Safari's address bar, Safari navigates to your default search engine (Google, Bing, etc.). This script intercepts that navigation **before the page renders** and redirects to Perplexity AI with your query.

Supported search engines:
- Google (all major TLDs)
- Bing
- DuckDuckGo
- Yahoo

## Installation

### Requirements

- macOS with Safari
- [Userscripts](https://apps.apple.com/app/userscripts/id1463298887) (free Safari extension, ~5MB)

### Setup

1. Install **Userscripts** from the Mac App Store
2. Enable it in **Safari → Settings → Extensions**
3. Click the Userscripts icon in Safari's toolbar → **Set Userscripts Directory** → select the `Userscripts/` folder from this repo
4. Done — all address bar searches now go through Perplexity AI

### Disable temporarily

Click the Userscripts icon in Safari's toolbar and toggle the script off.

## Project structure

```
PerplexitySearch/
├── README.md
├── Userscripts/
│   └── Perplexity Search.user.js   # the userscript (only file needed)
├── manifest.json                    # Safari Web Extension manifest (for Xcode build)
├── background.js                    # extension background script
├── popup.html / .js / .css          # extension popup UI
├── icons/                           # generated PNG icons
└── generate_icons.py                # icon generator script
```

> The `manifest.json`, `background.js`, `popup.*`, and `icons/` files are for building a native Safari Web Extension via Xcode. If you have Xcode installed, you can convert this into a full extension using `xcrun safari-web-extension-converter`.

## License

MIT
