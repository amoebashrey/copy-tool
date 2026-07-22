# anti-slop.md — the fingerprint killlist

These are the specific tells that make work read as AI-generated. Sources: Anthropic's frontend cookbook (`prompting_for_frontend_aesthetics`) plus observed patterns. Kill on sight.

## Visual tells

| Tell | Why it reads as slop | Fix |
|---|---|---|
| Default teal/cyan accent, or purple→blue SaaS gradient | The model's factory color | Pull color from the product story; pick from a real palette (see aesthetics.md) |
| Blinking/pulsing status dot, top-right of nav or card | Universal "AI dashboard" tic | Delete it, or make status a real semantic token |
| Container nesting >2 deep (card in card in card) | Structure standing in for design | Flatten; let type and space do the hierarchy |
| Default serif headline with no intent (Tiempos-adjacent) | "Serif = premium" reflex | Serif only if the brand says serif; choose the specific face |
| Left-rule accent bar on every card | Copy-pasted emphasis | One accent device per page, used where it means something |
| Three equal-column feature-card grid in/near the hero | The single most common AI layout | Asymmetric composition; vary card sizes; or use no cards |
| Symmetric, characterless card grids everywhere | Grids as filler | Break the grid at least once per page with intent |
| Generic Lucide icons, unstyled | Default icon set, default weight | Phosphor / Heroicons / custom 1.5px-stroke, styled to tokens |
| AI-generated imagery ignoring the token palette | Images from a different universe | Generate/pick images that use the DESIGN.md palette; or no image |

## Copy tells

| Tell | Example |
|---|---|
| Gerund triads | "reading your files, linking your notes, keeping you in flow" |
| "Not just X — it's Y" | "not just a tool — it's a companion" |
| "Whether you're… or…" | "whether you're a founder or a Fortune 500" |
| Rhetorical question openers | "Ever wished your notes could think? Now they can." |
| Em-dash-balanced antithesis everywhere | "simple to start — powerful to scale" |
| Three-item parallel lists as default rhythm | "Fast. Simple. Yours." |
| Buzzwords | see voice.md banlist: seamless, effortless, unlock, elevate… |

Full copy system and rewrites: `voice.md`.

## Positive inversions (Anthropic)

- **Fonts chosen for the brand**, not defaults — the typeface is a decision with a reason.
- **Colors grounded in the product story** — Chitra's paper-and-ink palette exists because it's a scribe.
- **Animation used for real effect** — arrival, state change, focus. Never ambient decoration.
- **Context-specific character in every component** — a button on this site could not be pasted into another site unnoticed.

## Pre-ship checklist

Answer yes to all, or fix:

1. No teal/cyan default accent or purple-SaaS gradient anywhere?
2. No blinking status dot?
3. Container nesting ≤2 deep everywhere?
4. Every font a named brand choice with a reason?
5. Hero free of the three-equal-column card grid?
6. At least one deliberate grid break / asymmetry on the page?
7. Accent devices (rules, bars, dots) used once, with intent — not per-card?
8. Icons from Phosphor/Heroicons/custom, styled to tokens?
9. All imagery on-palette?
10. Copy free of gerund triads, "not just X", "whether you're…", buzzword banlist?
11. Motion tied to meaning, with `prefers-reduced-motion` respected?
12. Contrast passes WCAG AA; focus states visible?
13. Dark and light both checked?
14. Could a stranger name the brand from a single component? (If everything is swappable, it's slop.)
