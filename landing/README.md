# Idem — landing page

Marketing landing page for **Idem**, the Figma plugin that keeps your product's
copy in one place: every string in one panel, a status for every word, reusable
copy components, and clean developer handoff.

Buildless static site: plain HTML, CSS, and vanilla JS. No framework, no
bundler, no npm dependencies. Fonts load from Google Fonts via a `<link>` tag.

## Files

- `index.html` — the page
- `styles.css` — all styles (light + dark themes)
- `main.js` — theme toggle and scroll reveal

## Preview

Either open `index.html` directly in a browser, or serve the folder:

```sh
npx serve landing
# or
python3 -m http.server 8123 --directory landing
```

## Deploy

Deploys anywhere that serves static files. On Vercel: create a project from
this repo and set the **Root Directory** to `landing` — no build command, no
output directory needed.
