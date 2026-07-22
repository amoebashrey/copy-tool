# Chitra

One source of truth for your product's words — starting in Figma.

Named for **Chitragupta**, the cosmic archivist who keeps a flawless record of
every word ever written — Chitra is the divine scribe for your product's copy.
Say it once, and she keeps it the same everywhere it appears. *One source of
truth. Zero copy chaos.*

## This repo

| Path | What it is |
|------|------------|
| [`plugin/`](./plugin) | The **Chitra Figma plugin** — list, edit, status, componentize, and hand off every string in a file. TypeScript + Preact, built with esbuild. |
| [`landing/`](./landing) | The **marketing site** — value prop and getting-started guide. Buildless static site. |

## Quick start

**Plugin**
```sh
cd plugin
npm install && npm run build
# Figma desktop → Plugins → Development → Import plugin from manifest → plugin/manifest.json
```

**Landing**
```sh
npx serve landing      # or open landing/index.html
```

See each folder's README for detail.
