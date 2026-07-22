# components.md — curated sourcing list

## Libraries — when to reach for each

| Library | Reach for it when | Notes |
|---|---|---|
| [Magic UI](https://magicui.design) | Marketing-page motion: micro-interactions, marquees, bento grids, number tickers, text effects | 150+ animated components, MIT, copy-paste, the most customizable of the set |
| [Aceternity UI](https://ui.aceternity.com) | One hero-grade statement effect: 3D cards, spotlights, background beams, magnetic buttons | Use sparingly — one statement per page |
| [Motion Primitives](https://github.com/itsjwill/motion-primitives-website) | Motion building blocks without paid deps | 110+, zero paid dependencies; Framer Motion / GSAP / Lenis / R3F coverage |
| [shadcn/ui](https://ui.shadcn.com) | Accessible base primitives: dialogs, forms, menus, tables | The foundation layer; everything else styles on top |
| [react-bits](https://reactbits.dev) | Extra copy-paste bits the above don't cover | Grab-bag; audit quality before pasting |

## Stack

React + Tailwind + Framer Motion. Vite for single pages, Next for sites. Everything self-hostable — no component CDN dependencies.

## Icons

Phosphor or Heroicons, or custom 1.5px-stroke SVGs. Not generic Lucide (the default-icon tell — see anti-slop.md). Whatever the set, restyle weight/size to the DESIGN.md tokens.

## Copy-paste philosophy

These libraries are sources, not dependencies. Paste the component into the repo, own the code, then restyle every token to the project DESIGN.md — colors, radii, easing, type. A pasted component that still looks like its demo page is a slop tell.

## Tools — extractors and skills

| Tool | Job |
|---|---|
| brandmd (`npx brandmd <url>`) | Bootstrap a DESIGN.md from a reference site |
| styleseed | Extract a token seed from existing visuals |
| design-distill | Distill a design system from screenshots/pages |
| taste-skill | Variance / motion / density dials for tuning output character |
| interface-design | `/design-review` audit workflow |
| superdesign | Iterative design canvas |
| [Anthropic `frontend-design` skill](https://github.com/anthropics/skills) | Official frontend aesthetics skill |
| [Anthropic cookbook `prompting_for_frontend_aesthetics`](https://github.com/anthropics/claude-cookbooks) | The source doc for the anti-slop inversions |
| [OneRedOak design-review](https://github.com/OneRedOak/claude-code-workflows) | Screenshot → violations → fix loop |

More: [awesome-claude-design](https://github.com/rohitg00/awesome-claude-design).
