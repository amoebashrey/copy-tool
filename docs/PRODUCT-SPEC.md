# Chitra — Product Spec & Architecture

*The divine scribe for product copy. One source of truth. Zero copy chaos.*

Status: living document. Last major revision synthesises the code-grounded inventory
of the current build, a competitive teardown of the category, and the activation +
brand-voice plan agreed with the team.

---

## 1. Overview & problem

Product copy — every button, label, error, empty state — lives scattered across
mockups, docs, spreadsheets, and tickets. Designers retype it, writers lose track of
what shipped, and developers copy-paste strings by hand. Nobody owns the words, so the
words drift.

**Chitra** puts every string in a Figma file into one panel: see it, edit it live,
track it through review, reuse approved copy, enforce a brand voice, and hand it to
engineering as clean structured data. It is a **headless source of truth for product
copy**, living where the copy is designed.

**Positioning.** Chitra is an original product with its own identity (the cosmic
archivist Chitragupta, who keeps a perfect record of every word). We never describe it
as a clone, alternative, or replica of any other tool, and we never name competitors in
any user-facing surface.

**What makes it different (our wedge):**
1. **Near-zero-setup indexing** — open it and every string is already listed; no naming
   discipline required.
2. **A "loose copy" linter** — surfaces untracked strings automatically.
3. **Stable dev keys + a real round-trip** — human-readable handoff, edits flow back in.
4. **Brand-voice enforcement inside Figma** — the copy is checked against *your* rules
   as it's written.
5. **Offline and private by default** — no account, no network; your words never leave
   the file.

---

## 2. Personas

| Persona | Cares about | Primary jobs in Chitra |
|---|---|---|
| **Designer** (first installer, often solo) | Not breaking the design; fast edits; not learning a heavy tool | Fix copy in place, see what's untracked, reuse shared strings |
| **UX writer / content designer** | Consistency, voice, review state | Own the words, enforce voice, move strings through review |
| **Product manager** | Shipping the right copy, visibility | Review, comment, approve, see status at a glance |
| **Developer** | Clean handoff, no manual copy-paste | Pull keyed strings as JSON; round-trip changes back |

Design for whoever installs **first** — usually a lone designer. The single-player loop
must deliver value before any teammate is invited. (The category's admitted weak spot is
a cross-functional cold start; a strong solo loop is our opening.)

---

## 3. User stories

### Epic A — Onboarding & activation
- As a **first-time designer**, when I open Chitra I want to immediately understand what
  it does and what to do next, so I don't bounce.
- As a **first-timer**, I want the panel to never be blank — it should show my file's copy
  and tell me the next move.
- As a **first-timer**, I want to reach a real, satisfying win in a few clicks, so I feel
  the value before investing.
- As a **cautious user**, I want a sample file to practice on, so I don't risk my real work.
- As **any user**, when the list changes because I selected a layer, I want to be told why,
  so I don't think it broke.

### Epic B — String management
- As a **designer**, I want to edit copy in the panel and have the canvas update
  font-safely, so I don't touch text tools.
- As a **writer**, I want to move a string through None → WIP → Review → Final, so status
  is visible.
- As a **developer/writer**, I want to give a string a stable, human-readable key, so
  handoff isn't node ids.
- As **any user**, I want to find untracked copy ("loose" — no key, no component), so
  nothing ships unmanaged.
- As a **writer**, I want to turn repeated copy into a component and edit it once, so every
  instance updates.

### Epic C — Brand voice
- As a **writer**, I want to import our existing style guide, so Chitra knows how we sound.
- As **any user**, I want copy that breaks our rules flagged with the *specific rule* it
  broke, so I trust and understand the suggestion.
- As a **designer**, I want a one-click fix for mechanical violations (banned word, casing,
  punctuation), so cleanup is instant.
- As a **team**, I want the voice profile to travel with the file, so collaborators see the
  same rules.
- As a **freelancer/agency**, I want to keep a separate voice profile per client, so Amber's
  voice and another client's voice don't mix.

### Epic D — Developer handoff
- As a **developer**, I want one-click JSON export keyed by stable ids, so I can wire copy
  into the build.
- As a **developer/writer**, I want to paste edits back (id/key → text) and apply them, so
  copy round-trips.

### Epic E — Multi-client / teams (future)
- As an **agency**, I want each client's copy and voice isolated, so nothing leaks across
  engagements.
- As a **team**, I want shared voice profiles and roles, so governance scales. *(needs
  backend — Phase 3+)*

---

## 4. Functional scope

### 4.1 Built today (ground truth)
All core logic is pure and unit-tested in `src/lib/`; the UI is Preact in `src/ui/`; the
Figma main thread is `src/code.ts`. Three tabs: **Strings**, **Components**, **Dev**.

- **Index every string**, grouped page → frame; scoped to selection when something is
  selected.
- **Live, font-safe editing** (loads all range fonts before writing; skips missing-font
  nodes).
- **Status workflow** None/WIP/Review/Final (stored in pluginData `chitra.status`).
- **Stable keys** with validation (`^[a-z0-9._-]+$`, document-wide uniqueness;
  `chitra.key`).
- **Reusable copy components** with **document-wide** propagation (registry in
  `figma.root` pluginData `chitra.components`).
- **JSON export** ("Copy JSON") and a **working import** (id/key,text; delimiter-agnostic).
- **Search**, **status filter**, and a **"Needs attention"** filter for loose strings.

Known gaps (all acknowledged in code): no onboarding/first-run, misleading empty-state
copy, invisible selection-scoping, key auto-suggest is an unbuilt TODO, no incremental
scan / list virtualization (full re-scan per change), and **no brand-voice / AI of any
kind** (confirmed; `networkAccess: none`).

### 4.2 Phase 1 — Activation & onboarding (offline, ship first)
Legible first-run + empty state; managed-vs-loose visual distinction; a **selection-scope
banner** with a "show whole file" toggle; **one-click key auto-suggest** (slugify);
**duplicate-text detection + one-click "Link all"** as the manufactured aha; a
**toast/result feedback channel** and a celebrated first win; a **sample file** pointer.

### 4.3 Phase 2 — Brand voice: import + offline linter
A **Voice tab**; **import a style guide** (paste/upload) → heuristic parser → **confirm
editor** → stored ruleset; a **lint pass** that flags each violation with the rule that
fired; **one-click fixes** for mechanical rules; **in-panel red-underline highlighting**
with a hover/click **suggestion modal** and a **jump-to-canvas** loop; **multi-client
voice profiles**.

### 4.4 Phase 3 — Optional AI voice (gated, later)
Optional network access to one allowlisted LLM endpoint; **bring-your-own-key**, off by
default; semantic tone rewriting seeded by the imported style guide, always showing which
rule/why. Plugin still works fully offline without it.

---

## 5. Activation strategy

The core principle, drawn from how the category leader fixed the identical "blank panel,
zero activation" problem: **value must be a byproduct of the user's first natural action,
never gated behind setup.**

1. **No setup wall.** Never show "connect / import / configure" before value. The managed
   object appears as a side effect of the first edit/status/key action.
2. **The panel is never blank.** On open, show the file's copy inventory with managed vs.
   loose clearly distinguished, so the empty state itself teaches the next move.
3. **Auto-surface the one aha.** Duplicate-text detection with one-click "Link all"
   demonstrates "edit once, changes everywhere" without waiting for discovery.
4. **A celebrated micro-win in ≤3 clicks** (first key set, or first Link-all) with an
   on-voice, deadpan success toast.
5. **Sample file + guided practice** on fake data, so cold users learn without risking
   real work and a solo installer can reach value before recruiting teammates.
6. **A strong single-player loop**, because the first installer is usually alone.

Success metric: a first-session user should set at least one key or link one duplicate
group (first "aha") within their first two minutes.

---

## 6. Data model & multi-client storage

**Answer to "how do we store each client's tone of voice," given no backend/accounts.**

Figma exposes three storage surfaces; we use each deliberately:

| Surface | Scope | We use it for |
|---|---|---|
| `node.setPluginData` | Per node, **in the file** | Per-string `chitra.status`, `chitra.key`, `chitra.componentId` (already live) |
| `figma.root.setPluginData` | Per file (document root) | Component registry `chitra.components`; **active voice profile** (new) |
| `figma.clientStorage` | **Per user, per device** (not in file) | Saved voice-profile library; user defaults; API key (Phase 3) |

**Voice profile = portable JSON**, the single interchange unit:
```jsonc
{
  "id": "amber",
  "name": "Amber",
  "version": 3,
  "rules": [ /* structured, machine-checkable — see §7 */ ],
  "referenceNotes": "freeform tone guidance, reserved for the AI layer"
}
```

- **Per-file binding.** The active profile is written to `figma.root` pluginData, so it
  **travels with the file** — every collaborator who opens it sees the same rules
  ("Amber's file already knows Amber's voice"). Same pattern the component registry uses.
- **Personal profile library.** The set of profiles a user has saved lives in
  `figma.clientStorage` (local, per-user), so someone working across clients (Amber +
  freelance) picks and applies a saved profile to any new file in one click.
- **Sharing.** Profiles export/import as `.json` — the offline substitute for a shared
  workspace (send via Slack/Drive). Importing a profile adds it to the personal library
  and can bind it to the current file.
- **Multi-tenancy today** = per-file binding + per-user library + portable JSON. No
  client's data touches another's, and nothing leaves the machine.
- **Backend-ready seam.** When accounts/hosting arrive, profiles move to a server-side
  workspace synced across a client's files with roles; the JSON stays the interchange
  format, so migration is clean. API keys stay in `clientStorage`, never in the file.

---

## 7. High-level architecture

Chitra runs entirely inside Figma's plugin sandbox — two isolated contexts that talk only
by message-passing:

```
┌─────────────────────────── Figma plugin sandbox ───────────────────────────┐
│                                                                             │
│   MAIN THREAD  (src/code.ts)              UI IFRAME  (src/ui/*, Preact)      │
│   • Figma scene-graph access              • Renders Strings / Components /   │
│   • Reads/writes pluginData                 Dev (+ Voice, new) tabs          │
│   • Font-safe setCharacters               • No Figma API access             │
│   • Scans text nodes, builds index        • Sends UiToMain, renders MainToUi │
│        │            ▲                          │            ▲               │
│        │ MainToUi   │ UiToMain                 │ postMessage │               │
│        └────────────┴──────────  message bus  ─┴────────────┘               │
│                                                                             │
│   STORAGE:  node pluginData · figma.root pluginData · figma.clientStorage    │
└─────────────────────────────────────────────────────────────────────────────┘
                    (Phase 3, optional)  ──▶  BYO-key LLM endpoint (allowlisted)
```

**Pure core (`src/lib/`, unit-tested, no Figma dependency):**
- `strings.ts` — grouping, key validation, "loose" detection, (new) key auto-suggest.
- `components.ts` — registry parse, propagation targets.
- `export.ts` — export shaping, import parse/match.
- `types.ts` — the single source of truth for shared shapes and the message unions.
- **New:** `duplicates.ts` (group identical strings), `voice.ts` (style-guide parse +
  lint, pure and testable).

**Message API (extend, don't rewrite — `src/lib/types.ts`):**
- Today `UiToMain`: `edit-text`, `set-status`, `set-key`, `create-component`,
  `link-component`, `edit-component`, `import`, `refresh`.
- Today `MainToUi`: `strings`, `components`.
- **Phase 1 adds** `UiToMain: set-onboarded`, `link-all-duplicates`; `MainToUi: toast`
  (the missing feedback channel — today the main thread calls `figma.notify` directly).
- **Phase 2 adds** `UiToMain: import-styleguide`, `save-voice-profile`, `apply-fix`,
  `focus-node`; `MainToUi: voice-profile`, `lint-results`. Every mutating handler already
  ends by re-broadcasting the full index, so new features slot into that cycle.

**Architectural principles to preserve:** keep all logic in pure `lib/` functions with
tests; the UI never touches the Figma API; storage keys stay namespaced `chitra.*`; the
plugin stays offline unless the user explicitly opts into Phase 3.

---

## 8. Inline highlighting — feasibility (the "Grammarly" idea)

**A true on-canvas red squiggle under live text is not possible in a Figma plugin.** The
sandbox gives no overlay on the canvas and no keystroke-level hook into Figma's text
editing. We deliver the **equivalent value** through surfaces we control:

- **In-panel highlighting.** In Chitra's own rendering of each string, the offending
  word/phrase gets a red underline. Hover or click opens a **suggestion modal**
  (`"utilize" → "use"` · rule: *prefer plain verbs*) with **Apply** (font-safe edit) and
  **Dismiss**.
- **Jump-to-canvas loop.** Clicking a violation selects the node and zooms the Figma
  viewport to it (`figma.viewport.scrollAndZoomIntoView`, `figma.currentPage.selection`),
  so the loop feels like "find the problem → fix it" without an overlay.
- **Near-live.** We re-lint on `documentchange` / `selectionchange` (existing 150 ms
  debounce), so the panel stays current as copy changes — panel-live, not canvas-squiggle.

This is stated plainly so expectations are set: Chitra is a **panel-based** voice checker
with a fast jump-to-fix loop, not a canvas overlay.

**Voice rule shape (machine-checkable unit):**
```jsonc
{
  "name": "Use 'sign in' not 'login'",   // an instruction, not an adjective
  "kind": "term",                         // term | casing | punctuation | length | pattern
  "match": "login",
  "replacement": "sign in",
  "example": "Sign in to continue",
  "why": "Two words, verb form, matches product nav",
  "scope": null                            // optional tag filter
}
```
Concrete behavioural rules ("don't say please") lint far more reliably than vague ones
("use an assertive tone"); the parser and editor nudge toward the concrete form, and the
vague/tonal guidance is kept as reference notes for the Phase-3 AI layer.

---

## 9. Landing page — text + infographic tutorial (no video)

The category teaches with YouTube; we do the same job in **text + infographics**, which
also fits the buildless/fast landing and the Indian-maximalist aesthetic.

- A **How it works** section (between Features and Install): the 4-step spine
  **Scan → Track → Reuse → Hand off**, each with a purpose-built infographic (annotated
  panel diagrams, not raw screenshots) and short, on-voice captions.
- A **"first two minutes"** mini-tutorial mirroring the exact in-plugin onboarding.
- An optional **looping in-practice animation** (string selected → corrected →
  propagated) to show the aha visually.
- Honest built-vs-roadmap; no competitor references; designed and anti-slop-checked via
  the `karkhana` skill.

---

## 10. Roadmap & sequencing

0. **This document** — reviewed before heavy implementation.
1. **Phase 1 — activation + landing tutorial.** Unblocks the lost designer; zero infra;
   fully offline.
2. **Phase 2 — voice import + offline linter + in-panel highlighting + multi-client
   profiles.**
3. **Phase 3 — optional BYO-key AI voice.** Only when we choose to add network + key.

Cross-cutting hardening (any phase, as files grow): incremental/async scan
(`documentAccess: dynamic-page`), list virtualization, bulk status/key actions.

---

## 11. Ideas to make it better (backlog)

- **Bulk actions** — set status/keys for a whole frame or selection at once.
- **Key conventions** — project-level key prefixes/namespaces (`checkout.*`) and a lint
  for inconsistent keys.
- **Developer round-trip** — a CLI/JSON contract so keyed copy pulls into a codebase and
  changes sync back; i18n-friendly export shapes (nested / ICU).
- **Variants** — one key, multiple values (length/locale/A-B), exported together.
- **Change history & notes** — who changed a string, when, and *why* (institutional
  memory) — a repeatedly-praised feature in the category.
- **Review flow** — reviewer role, comments, approve/reject on the way to Final.
- **Native Figma Variables** — optionally back strings with string Variables to inherit
  Dev Mode / REST export instead of duplicating them.
- **Voice profile marketplace** — starter profiles (plain-language, e-commerce, fintech)
  users can adopt and tune.
- **PR / codegen enforcement** (long-term) — enforce the voice profile where copy is
  generated, not only in design.
- **Activation instrumentation** — measure time-to-first-key and first-aha to know the
  onboarding actually works.

---

*Guardrails: original product, never named against competitors; offline/no-account is a
first-class feature, not an accident; built-vs-roadmap stays honest everywhere; all UI
copy is written in Chitra's voice (sharp, observant, royal-deadpan).*
