# Course exports live here

One subfolder per course, with the course's entry point at `courses/<slug>/index.html`
(this is what the showcase lightbox loads in its iframe).

The folders currently here are **placeholders** — replace each one with a real published
export (Articulate Rise, Storyline, or any web export). After copying an export in, make
sure the matching entry in `js/courses-data.js` points at it:

```js
source: { type: 'local', path: 'courses/<slug>/index.html' }
```

See `MAINTAINING.md` at the repo root for the full guide.
