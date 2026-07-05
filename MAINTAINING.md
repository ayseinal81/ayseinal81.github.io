# Maintaining this site

A fully static portfolio — plain HTML/CSS/JS, no build step. Push to GitHub, enable
GitHub Pages (Settings → Pages → deploy from branch, root folder), and it's live.

## Adding a course (the common task)

1. **Publish your course** (Rise, Storyline, or any web export) and copy the output into a
   new subfolder of `courses/`, so the entry point sits at `courses/<slug>/index.html`.
2. **Add one object** to the array in [`js/courses-data.js`](js/courses-data.js) — the file
   starts with a comment documenting every field.

That's it. The showcase grid, the filter chips, and the home-page "Recent builds" strip all
update automatically from the data. You never need to touch HTML or CSS to add a course.

### Course hosted somewhere else?

Use an external source instead of a local path — nothing else changes:

```js
source: { type: 'external', url: 'https://your-host.com/course-name/' }
```

This is also the escape hatch if the repo grows too large: move a course export to external
hosting, flip its `source`, delete the local folder.

### Real thumbnails

By default each card shows a striped placeholder in the course's `accent` colour. To use a
real image, drop it in `assets/` and add to the course object:

```js
thumbnail: 'assets/thumbs/my-course.jpg',
thumbAlt: 'Screenshot of the course menu'
```

### Shareable links

Every course and filter has a URL you can share:

- `showcase.html?course=anti-bribery` — opens that course in the lightbox
- `showcase.html?by=tag&filter=Compliance` — pre-applies a filter

## Placeholders still to swap

- **Your photo** — in `about.html`, replace the `.photo-slot` div with the commented-out
  `<img>` just above it (drop a portrait crop at `assets/portrait.jpg`).
- **Formspree ID** — create a free form at [formspree.io](https://formspree.io), then replace
  `your-form-id` in the form `action` in `contact.html`.
- **LinkedIn URL** — replace `your-handle` in `about.html` and `contact.html`.
- **Email** — `hello@ayseinal.co.uk` appears in `about.html`, `contact.html`, and `js/main.js`
  (the form's error message); search-and-replace if it changes.
- **Demo courses** — each folder in `courses/` contains a placeholder; replace with real
  exports as described above.

## Files at a glance

| File | What it is |
| --- | --- |
| `index.html`, `about.html`, `showcase.html`, `contact.html` | The four pages |
| `css/styles.css` | All styling (palette variables at the top) |
| `js/courses-data.js` | **The course data — the only file to edit for new courses** |
| `js/showcase.js` | Showcase grid, filters, lightbox viewer |
| `js/main.js` | Shared helpers, home-page strip, contact form |
| `courses/` | One subfolder per locally-hosted course |
