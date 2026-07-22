# Idem — the Figma plugin

One source of truth for your product's words, right inside Figma. Idem surfaces
every string in a file, lets you edit copy live, track it through a review
workflow, reuse approved copy as components, and hand it off clean to
developers.

## Features

- **Every string, one panel.** Lists all text on the current page (or your
  selection), grouped by frame. Edit copy in the panel and it updates on the
  canvas — font-safe.
- **A status for every word.** Move each string through `None → WIP → Review →
  Final`, color-coded. Search and filter as the file grows.
- **Reusable copy components.** Turn a string into a component, link others to
  it, and propagate an edit to every linked layer at once.
- **Developer handoff.** A read-only view of every string with its status, plus
  one-click JSON export.

Runs fully offline (`networkAccess: none`).

## Develop

```sh
npm install
npm run typecheck   # tsc --noEmit (strict)
npm test            # node:test via tsx
npm run build       # → dist/code.js + self-contained dist/ui.html
npm run watch       # rebuild on change
```

## Load it in Figma

1. Run `npm install && npm run build`.
2. Open the **Figma desktop app**.
3. Menu → **Plugins → Development → Import plugin from manifest…**
4. Select this folder's `manifest.json`.
5. Run it: **Plugins → Development → Idem**.

## How it's built

- **Two sandboxes.** A thin main thread (`src/code.ts`, Figma Plugin API) scans
  and edits text and stores metadata in `pluginData`; a Preact UI iframe
  (`src/ui/*`) renders the panel. They talk over `postMessage`.
- **Pure core.** All logic — filtering, grouping, component propagation, export
  and import parsing — lives in framework-free functions under `src/lib/*` and is
  unit-tested there.
- **Lean by design.** Preact, esbuild (one `build.mjs`), and Node's built-in test
  runner. No web framework, no bundler config, no test framework.
