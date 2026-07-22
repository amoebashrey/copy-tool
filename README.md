# Idem

One source of truth for your product's words — starting in Figma.

Idem is Latin for *"the same as already stated."* That's the promise: say it
once, and it stays the same everywhere it appears.

## This repo

| Path | What it is |
|------|------------|
| [`plugin/`](./plugin) | The **Idem Figma plugin** — list, edit, status, componentize, and hand off every string in a file. TypeScript + Preact, built with esbuild. |
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
