---
name: verify
description: Build/launch/drive recipe for verifying changes to this static portfolio site end-to-end in a browser.
---

# Verifying this site

Fully static — no build step, no dependencies. Serve the repo root and drive
pages in a browser.

## Launch

```bash
python3 -m http.server 8765 --bind 127.0.0.1   # from the repo root, backgrounded
```

## Drive (headless Chromium via playwright-core)

Chromium is pre-installed in remote sessions. Install `playwright-core` in a
scratch dir (not the repo — the site has no node_modules) and launch with:

```js
chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' })
// or the symlink /opt/pw-browsers/chromium for headed builds
```

## Flows worth driving

- **Showcase** (`showcase.html`): 6 cards render from `js/courses-data.js`;
  Tool/Category segmented control swaps chip sets (chips are derived from the
  data); a chip filters the grid and writes `?by=&filter=` to the URL.
- **Lightbox**: "Launch course" opens the dialog, the local placeholder course
  loads in the iframe (click its Next button through `frameLocator` to prove
  the embed is live), Esc / ✕ / backdrop close it, focus returns to the
  launcher, `?course=` param is added/removed.
- **Deep links**: `showcase.html?course=gdpr-refresher` opens the lightbox on
  load; `?by=tag&filter=Onboarding` pre-filters; garbage params must fall back
  to the unfiltered grid without errors.
- **Home** (`index.html`): marquee track gets 12 cards (courses ×2).
- **Contact** (`contact.html`): submitting exercises the fetch path; with the
  placeholder Formspree ID (or blocked network) it must show the inline error
  with the mailto fallback, not a navigation.
- **Mobile** (375px viewport): no horizontal scroll; lightbox usable.

## Gotchas

- The lightbox has a 0.2s fade-in — screenshot after ~500ms or the panel
  looks transparent.
- External hosts (Google Fonts, Formspree, learn.ayseinal.com) are blocked in
  the sandbox → `ERR_CERT_AUTHORITY_INVALID` console errors are environment
  noise; fonts fall back to system.
- Esc-to-close is attached to the iframe's contentDocument on load for local
  courses; cross-origin courses rely on the ✕ button/backdrop.
