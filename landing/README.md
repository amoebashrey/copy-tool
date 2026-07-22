# Chitra — landing page

Landing page for **Chitra**, a Figma plugin that reads every text layer in your file, keeps them in one place, and flags the ones that drifted out of sync. A shrey.lab project.

Buildless static site: `index.html` + `styles.css` + `main.js`. No framework, no bundler, no npm dependencies. Google Fonts load via `<link>`; every other asset is inline SVG.

## Preview locally

```sh
npx serve landing
# or
python3 -m http.server 4321 --directory landing
```

Then open the printed URL (e.g. http://localhost:4321).

## Deploy

Any static host works. On **Vercel**: create a project from this repo and set the **Root Directory** to `landing` — no build command, no output directory needed.

## Notes

- Light ("warm paper") and dark ("warm charcoal") themes: follows `prefers-color-scheme`, with a manual toggle persisted in `localStorage` (`chitra-theme`).
- All animations are pure HTML/CSS/JS and respect `prefers-reduced-motion` — final states ship in the markup; JS only animates when motion is allowed.
