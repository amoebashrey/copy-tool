# Chitra — product strategy

*Synthesis of the code-grounded PM plan and the category teardown. The tool is
the product; the landing page is its demo.*

## Position

A fast, low-setup way to manage every string in a Figma file — index it, keep it
consistent, hand it to developers clean. For content designers and PMs, not a
localization department.

## The gap we're walking into

- **Ditto leads but taxes you for it.** Near-complete feature set, but hidden
  seat-based pricing, a UX users call "fiddly," and it makes you maintain a
  second system alongside Figma.
- **Localization suites treat Figma as a scraper.** Push-out → translate →
  pull-back. They don't help you manage copy day to day, and pseudo-loc /
  placeholder / mark-untranslatable support is inconsistent.
- **Native Figma string Variables are almost right, and file-locked.** No clean
  cross-file library, punishing at scale, no way to find layers missing a
  variable. A whole plugin (UX ContentHub) exists just to patch this.
- **The incumbents are drifting** toward AI "language systems" and codebase
  enforcement — vacating the core content-designer + handoff job.

## The wedge

1. **Near-zero-setup auto-indexing.** Scan a file → a deduped, keyed string index
   in seconds, with no layer-naming discipline required. Kills the #1 adoption
   barrier every competitor shares.
2. **A "missing key / unlinked layer" linter** — the exact native-Variables pain
   point, surfaced automatically.
3. **Stable dev keys that survive edits + a real round-trip** (flat / nested /
   ICU JSON, plus iOS/Android). Table-stakes to be credible; our import parser
   already exists, unwired.
4. **Ride native Variables** as an optional backing store rather than duplicating
   them — inherit Dev Mode + the REST API for free.
5. **Stay focused and honest on the core** while the incumbents chase AI.

## What to build (from the PM plan)

**P0 — usability & scale (do first)**
- Fix cross-page component propagation (today it silently misses other pages).
- Document-wide string index (today it only sees the current page).
- `dynamic-page` + async APIs + debounced, incremental scanning; virtualize the
  list. (The scale substrate. Risky — do it as an isolated, in-Figma-tested pass.)
- Bulk actions + find-and-replace.

**P1 — credibility**
- Wire up the already-built import (round-trip). Highest ROI.
- Stable human-readable keys in the export.
- Component lifecycle (rename / delete / unlink).
- Figma Variables integration.

**P2 — depth & the landing**
- Localization / variants (the big bet — scope after the core is solid).
- Copy lint (length, casing, banned terms).
- Keep the landing a demo of shipped reality.

## Honesty rule

The marketing site shows what's *built* as built and what's *planned* as planned.
No claiming localization, code-sync, or lint before they ship.
