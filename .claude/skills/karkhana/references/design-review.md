# design-review.md — the review loop

Run this on a built, running page before shipping. It's how slop and a11y
failures get caught. Two passes minimum.

## The loop

1. **Run the page.** Real dev server, not a description of it.
2. **Capture the evidence.** Screenshot at three widths (≈390 / 834 / 1440) in
   both light and dark. Cap at ~4 screenshots per pass (token budget).
3. **Score it against `anti-slop.md`.** Walk the 14-item pre-ship checklist.
   Write down each violation with its location — don't fix from memory.
4. **Check accessibility.** Contrast ≥ WCAG AA; visible focus states; full
   keyboard nav; `prefers-reduced-motion` honoured; correct heading order; alt
   text / aria on non-text content.
5. **Fix, then re-capture.** Only re-screenshot the sections you changed.
6. **Repeat until the checklist is all-yes.** Stop when a stranger could name
   the brand from any single component.

## For the hero, once: the three-voice debate

Critique the hero from three angles and synthesise:
- **The skeptic** — "what here is a default I didn't decide?"
- **The typographer** — "is the hierarchy exaggerated enough to carry it?"
- **The copywriter** — "does this read nonchalant, or is it selling?"

## Tooling

- Automate screenshots with the Playwright MCP, or a headless shot script.
- [OneRedOak design-review workflow](https://github.com/OneRedOak/claude-code-workflows)
  runs this as subagents with a11y validation baked in.
- The `interface-design` skill exposes it as a `/design-review` command.
