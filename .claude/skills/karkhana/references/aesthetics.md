# aesthetics.md — families + the house style

## A. The nine aesthetic families

Anchor every project to one family, or remix two (e.g. Warm Editorial × Terminal-Core). Never build unanchored.

| Family | Exemplar | Character | Token hint |
|---|---|---|---|
| Editorial Minimalism | Linear | Precise, quiet, engineering-grade restraint | Near-black bg, one gray ramp, one accent, Inter-class sans, 4px grid |
| Terminal-Core | Ollama | Mono-first, CLI honesty, no chrome | Mono type everywhere, 1px borders, green/amber on dark |
| Warm Editorial | Claude / Anthropic | Bookish, humane, serif-led calm | `#f4f3ee` paper, `#c96442` clay accent, `#191817` ink; serif display |
| Data-Dense Pro | ClickHouse | Tables first, information wins | Tight leading, mono numerals, high-contrast rows, yellow/black accents |
| Cinematic Dark | Runway | Filmic, image-led, tools-as-studio | True black, footage as bg, thin sans, minimal UI over media |
| Playful Color | Figma | Primary hues, shapes, work-as-play | Saturated multi-color, rounded geometry, chunky type |
| Glass / Soft-Futurism | Arc | Translucent layers, gradient light, soft depth | Blur/glass panels, gradient meshes, large radii |
| Neon Brutalist | The Verge | Loud, collaged, editorial punk | Clashing neons, hard borders, oversized headlines, visible grid |
| Cult / Indie | Criterion, A24 | Curated, archival, taste-as-product | Serif + catalog numbers, restrained color, poster-like art direction |

## B. House style deep-dive: Warm Editorial × Indian Maximalism

The studio default. Core principle in one line: **the type, color, and visuals perform; the copy stays understated and confident.**

### Roots

Truck art, hand-painted shop signage, film hoardings, political murals. The shared trait: loud craft, terse words. A truck panel is a riot of ornament around three painted words ("Horn OK Please"). Borrow that ratio — maximal surface, minimal statement.

### Type: Devanagari-first

There is a live Indic type renaissance — foundries **Mota Italic** and **Ektype**; designers **Kimya Gandhi**, **November Studio (Shiva Nallaperumal & Juhi Vishnani)**. The move: design the Devanagari first, pair the Latin second, instead of retrofitting Devanagari onto a Latin family. For house work:

- Bilingual signposting: Latin + Devanagari as paired display elements (e.g. `Chitra / चित्र`), like a shop sign.
- The Devanagari is a designed element, not a translation gloss — give it real size and a real face (e.g. Tiro Devanagari), never a fallback font.

### Palette: jewels on warm paper

Warm paper and ink as ground; jewel tones as accents, never as floods.

| Role | Tone |
|---|---|
| Ground | Warm paper (`#F7F2E8`-class) / warm ink (`#201F1A`-class) |
| Jewels | Emerald, saffron, vermilion/ruby, indigo, brass/gold |

Assign each jewel a semantic job per project (see `brand/chitra.md`); don't scatter them decoratively.

### Techniques

- **Exaggerated hierarchy** — giant expressive display type against tiny mono labels. The gap between the largest and smallest text should feel almost wrong.
- **Layered, asymmetric composition** — overlap, offset, rotate a stamp a few degrees. No centered-stack-of-sections.
- **Ornament with intent** — mandala geometry, postage-stamp frames, kalam (reed pen) marks, manuscript rules. Each motif earns its place by meaning something in the product story.
- **Paper grain** — subtle texture on the ground plane; the page is a material, not a viewport.

### Restraint-in-density

Rich but organized, not busy. Maximalism here is depth of craft in few elements, not many elements. If removing an ornament changes nothing, it shouldn't have been there. The copy never shouts — that's the visuals' job (see `voice.md`).
