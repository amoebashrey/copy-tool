---
name: karkhana
description: Use when designing or building any user-facing surface (landing page, marketing site, app UI, brand moment) for a shrey.lab tool, or when a design "looks AI-generated" and needs to be leveled up. Enforces an anti-slop killlist, an aesthetic-family system, a curated component-library sourcing list, the studio's Indian-maximalist house style, and a nonchalant copy voice. Loads the references as needed.
---

# karkhana

A karkhana is a workshop. This one is the system that makes every shrey.lab build come out crafted instead of generated. It exists because default model output converges on the same look — teal gradients, three-column feature grids, "seamless" copy. The workshop replaces defaults with decisions.

Files in this skill:

| File | Load when |
|---|---|
| `references/anti-slop.md` | Auditing a design, pre-ship review, "looks AI-generated" |
| `references/aesthetics.md` | Picking a direction, writing a DESIGN.md, applying house style |
| `references/components.md` | Sourcing components, setting the stack, picking icons/tools |
| `references/voice.md` | Writing any user-facing copy |
| `brand/chitra.md` | Working on Chitra, or as the worked example of a DESIGN.md |

## The method — a repeatable loop

**1. Anchor an aesthetic family.** Pick one of the nine families in `references/aesthetics.md`, or remix two. Never start unanchored — that's how slop happens. Default house style: **Warm Editorial × Indian Maximalism**.

**2. Write a DESIGN.md first.** Before any build code: tokens (color, space, radius), type scale, motion rules, voice notes, and a per-project anti-slop banlist. Bootstrap from a reference site with `npx brandmd <url>` if one exists. `brand/chitra.md` is the worked example — copy its structure.

**3. Choose brand fonts and source components.** Fonts are a brand decision, never defaults (no Inter-because-it's-there). Source components from the curated libraries in `references/components.md` — copy-paste, then restyle to the DESIGN.md tokens. Stack for anything ambitious: React + Tailwind + Framer Motion.

**4. Build to the DESIGN.md.** Exaggerated typographic hierarchy (giant display vs tiny mono). Layered, asymmetric composition — not stacked centered sections. Ornament with intent. Motion that means something (state change, arrival, focus), not decoration.

**5. Run the design-review loop.** Audit the build against `references/anti-slop.md` plus accessibility (contrast, focus states, reduced-motion). Use the [OneRedOak design-review workflow](https://github.com/OneRedOak/claude-code-workflows) or an `/audit-live-site` prompt against the running page: screenshot → list violations → fix → re-screenshot. Two passes minimum.

**6. Verify and ship.** Real devices/widths, dark and light, keyboard nav, then ship.

## When NOT to use / keep it lean

Internal tools, prototypes, throwaway demos: skip steps 1–2, use shadcn defaults, ship. Ornament on a debug panel is waste. The full loop is for surfaces people will judge.

**Token budget:** scaffold the page structure once, don't regenerate it. Cap reference screenshots at ~4 per review pass. Iterate with inline `// TODO(design):` comments instead of re-describing the whole page.

## Canonical resources

- [Anthropic skills — frontend-design](https://github.com/anthropics/skills)
- [Anthropic cookbook — prompting_for_frontend_aesthetics](https://github.com/anthropics/claude-cookbooks)
- [awesome-claude-design](https://github.com/rohitg00/awesome-claude-design)
- [Magic UI](https://magicui.design) · [Aceternity UI](https://ui.aceternity.com) · [Motion Primitives](https://github.com/itsjwill/motion-primitives-website) · [shadcn/ui](https://ui.shadcn.com)
- brandmd (`npx brandmd <url>`) · styleseed · taste-skill · interface-design (`/design-review`) · superdesign
- [OneRedOak design-review workflow](https://github.com/OneRedOak/claude-code-workflows)
