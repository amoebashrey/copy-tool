# DESIGN.md — Chitra / चित्र

Figma plugin. The divine scribe for product copy — named for Chitragupta, the cosmic archivist who records every deed. Micro-tagline: **"One source of truth. Zero copy chaos."**

This file is the worked example of a karkhana DESIGN.md. Copy its structure for new projects; don't copy its tokens.

## Brand story guardrails

- Present Chitra as ORIGINAL. Never frame it against competitors or as "like X but Y."
- **Persona voice stays in-product only.** "Chitra is reading your manuscript…", "Order is restored.", "Recorded." — loading states, empty states, confirmations. Marketing surfaces use the studio nonchalant voice (voice.md).
- Footer connects to the studio: `built by shreyas · shrey.lab`.
- **No lime-green dot.** No status dot of any kind (anti-slop.md).

## Color tokens

| Token | Light | Dark | Semantics |
|---|---|---|---|
| `--paper` | `#F7F2E8` | `#1A1915` (warm charcoal) | Ground |
| `--ink` | `#201F1A` | `#F7F2E8` | Text |
| `--emerald` | `#0E6B4A` | `#2FA47C` | Synced — the string matches the source |
| `--saffron` | `#E08A00` | `#F0A62E` | WIP / warning — draft or drifted |
| `--indigo` | `#3B3B98` | `#8B8BE0` | In review |
| `--gold` | `#B8860B` | `#D4A93C` | Active/selected token |
| `--ruby` | `#9B1B30` | `#D45A6E` | Rare: destructive, conflict |

Rules: paper/ink carry ~95% of every surface. Jewels appear only in their semantic role — a jewel with no meaning is decoration debt. Ruby is deliberately scarce so it reads as an event.

## Type

| Role | Face | Use |
|---|---|---|
| Display | Instrument Serif | Headlines, the italic-serif break word |
| Body/UI | Geist | Everything readable |
| Mono | Geist Mono | Eyebrows (`// tokens`), token keys, counts, code |
| Devanagari | Tiro Devanagari Hindi | चित्र wordmark and bilingual signposts |

Scale: display 64–96px landing / 20px in-plugin; body 15px; mono labels 11–12px, tracked +0.05em. Exaggerate the display-to-mono gap.

Note: these are Chitra's fonts, not house defaults. Every project chooses its own faces (karkhana step 3).

## Motifs

- **Postage stamp** — the copy-token as a perforated stamp frame; the signature card treatment. May rotate 1–2°.
- **Mandala geometry** — background ornament at low contrast on paper grain; one per page, anchored to the hero.
- **Kalam (reed pen)** — mark for editing/writing states.
- **Manuscript rules** — thin horizontal rules delimiting sections, like a ledger.
- **Bilingual signpost** — `Chitra / चित्र` paired lockup in nav and footer.

## Motion

- Sync confirmation: ink-stamp settle — scale 1.04→1.0 with a soft ease-out, ~180ms. The "recorded" feeling.
- String updates: crossfade + 2px rise, 150ms. No slides, no bounces.
- Page arrival (landing): headline words set in like type being placed, 40ms stagger, once.
- Nothing loops. Respect `prefers-reduced-motion`: swap all of the above for opacity-only.

## Per-project banlist

Beyond anti-slop.md: no lime-green anything, no gradient accents, no card grids in the hero, no "AI-powered" in any copy, persona voice never on marketing surfaces.
