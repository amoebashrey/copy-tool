/**
 * How it works — the four-move method (scan → track → reuse → hand off)
 * laid out as a stepped ledger: manuscript rules delimit each move, and
 * text/diagram sides alternate row to row — deliberately not a card grid.
 * Each diagram is a hand-built SVG of the panel doing that job, drawn to
 * the brand tokens: paper/ink carry the structure, jewels appear only in
 * their semantic roles (gold = key/token, emerald = final/linked,
 * saffron = loose/WIP, indigo = review).
 * Motion: one-shot draws and settles, fired once in view; opacity-only
 * under prefers-reduced-motion; nothing loops.
 */
import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

const MONO = 'var(--font-mono)'
const DISPLAY = 'var(--font-display)'

/* ————— diagrams ————— */

const SCAN_GROUPS: [string, [string, string][]][] = [
  [
    'page 01 › checkout',
    [
      ['checkout / title', 'Almost there'],
      ['checkout / cta', 'Place order'],
      ['checkout / note', 'You can cancel anytime'],
    ],
  ],
  [
    'page 01 › cart',
    [
      ['cart / empty', 'Nothing in here yet'],
      ['cart / cta', 'Keep shopping'],
    ],
  ],
]

function ScanFig() {
  let y = 26
  const groups = SCAN_GROUPS.map(([header, rows]) => {
    const headerY = y
    const rowYs = rows.map((_, i) => headerY + 30 + i * 32)
    y = rowYs[rowYs.length - 1] + 32
    return { header, rows, headerY, rowYs }
  })
  return (
    <figure
      className="border border-line bg-paper-raised p-4 sm:p-6"
      role="img"
      aria-label="The panel right after opening: every string in the file listed and grouped page then frame — the checkout's title, CTA and note, then the cart's empty state and CTA — under a small stamp reading found: 42, prep: 0."
    >
      <svg
        viewBox="0 0 440 236"
        className="mx-auto block h-auto w-full max-w-[520px]"
        aria-hidden="true"
        focusable="false"
      >
        {/* the found-stamp — set slightly crooked, like it was pressed by hand */}
        <g transform="rotate(2 364 19)">
          <rect
            x="300"
            y="8"
            width="128"
            height="22"
            fill="var(--gold-wash)"
            stroke="var(--gold)"
            strokeDasharray="3 3"
          />
          <text
            x="364"
            y="23"
            textAnchor="middle"
            fontFamily={MONO}
            fontSize="9.5"
            letterSpacing="0.05em"
            fill="var(--gold-ink)"
          >
            found: 42 · prep: 0
          </text>
        </g>

        {groups.map(({ header, rows, headerY, rowYs }) => (
          <g key={header}>
            <text
              x="16"
              y={headerY}
              fontFamily={MONO}
              fontSize="10"
              letterSpacing="0.05em"
              fill="var(--ink-faint)"
            >
              {header}
            </text>
            <line x1="16" y1={headerY + 8} x2="284" y2={headerY + 8} stroke="var(--line)" />
            {/* group spine — the ledger's binding edge */}
            <line
              x1="16"
              y1={headerY + 16}
              x2="16"
              y2={rowYs[rowYs.length - 1] + 4}
              stroke="var(--line)"
            />
            {rows.map(([path, text], i) => (
              <g key={path}>
                <text
                  x="28"
                  y={rowYs[i]}
                  fontFamily={MONO}
                  fontSize="10"
                  letterSpacing="0.05em"
                  fill="var(--ink-faint)"
                >
                  {path}
                </text>
                <text x="428" y={rowYs[i]} textAnchor="end" fontSize="12.5" fill="var(--ink)">
                  {text}
                </text>
                {i < rows.length - 1 && (
                  <line x1="28" y1={rowYs[i] + 12} x2="428" y2={rowYs[i] + 12} stroke="var(--line)" />
                )}
              </g>
            ))}
          </g>
        ))}
      </svg>
    </figure>
  )
}

function TrackFig() {
  const reduced = useReducedMotion()
  return (
    <figure
      className="border border-line bg-paper-raised p-4 sm:p-6"
      role="img"
      aria-label="One string, Place order, holding the stable key checkout.cta and moving along the status rail — None, WIP, Review — to settle on Final. Below, the needs-attention filter flags loose strings that have no key or status yet."
    >
      <svg
        viewBox="0 0 440 236"
        className="mx-auto block h-auto w-full max-w-[520px]"
        aria-hidden="true"
        focusable="false"
      >
        {/* the tracked line, with its key */}
        <text x="16" y="40" fontFamily={DISPLAY} fontStyle="italic" fontSize="15" fill="var(--ink)">
          “Place order”
        </text>
        <rect
          x="140"
          y="24"
          width="112"
          height="22"
          fill="var(--gold-wash)"
          stroke="var(--gold)"
          strokeDasharray="3 3"
        />
        <text
          x="196"
          y="39"
          textAnchor="middle"
          fontFamily={MONO}
          fontSize="10"
          letterSpacing="0.05em"
          fill="var(--gold-ink)"
        >
          checkout.cta
        </text>
        <text x="268" y="39" fontFamily={MONO} fontSize="9.5" fill="var(--ink-faint)">
          ← its key, kept stable
        </text>
        <line x1="16" y1="62" x2="428" y2="62" stroke="var(--line)" />

        {/* the status rail */}
        <text x="16" y="99" fontFamily={MONO} fontSize="11" fill="var(--ink-faint)">
          None
        </text>
        <text x="54" y="99" fontFamily={MONO} fontSize="11" fill="var(--ink-faint)">
          →
        </text>
        <text x="76" y="99" fontFamily={MONO} fontSize="11" fill="var(--saffron-ink)">
          WIP
        </text>
        <text x="108" y="99" fontFamily={MONO} fontSize="11" fill="var(--ink-faint)">
          →
        </text>
        <text x="130" y="99" fontFamily={MONO} fontSize="11" fill="var(--indigo)">
          Review
        </text>
        <text x="182" y="99" fontFamily={MONO} fontSize="11" fill="var(--ink-faint)">
          →
        </text>
        {/* Final settles like an ink stamp — once, in view */}
        <motion.g
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.22, delay: 0.55, ease: 'easeOut' }}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        >
          <rect x="206" y="80" width="58" height="26" fill="var(--emerald-wash)" stroke="var(--emerald)" />
          <text
            x="235"
            y="98"
            textAnchor="middle"
            fontFamily={MONO}
            fontSize="11"
            fill="var(--emerald)"
          >
            Final
          </text>
        </motion.g>
        <text x="280" y="99" fontFamily={MONO} fontSize="9.5" fill="var(--ink-faint)">
          · ready to ship
        </text>
        <line x1="16" y1="128" x2="428" y2="128" stroke="var(--line)" />

        {/* the loose ones */}
        <rect
          x="16"
          y="146"
          width="142"
          height="20"
          fill="var(--saffron-wash)"
          stroke="var(--saffron)"
          strokeDasharray="3 3"
        />
        <text
          x="87"
          y="160"
          textAnchor="middle"
          fontFamily={MONO}
          fontSize="9.5"
          letterSpacing="0.05em"
          fill="var(--saffron-ink)"
        >
          needs attention · 2
        </text>
        <text x="16" y="194" fontSize="12.5" fill="var(--ink-soft)">
          Free shipping over ₹999
        </text>
        <text x="428" y="194" textAnchor="end" fontFamily={MONO} fontSize="9.5" fill="var(--saffron-ink)">
          no key yet
        </text>
        <text x="16" y="220" fontSize="12.5" fill="var(--ink-soft)">
          Ships in 2–3 days
        </text>
        <text x="428" y="220" textAnchor="end" fontFamily={MONO} fontSize="9.5" fill="var(--saffron-ink)">
          no status
        </text>
      </svg>
    </figure>
  )
}

const REUSE_ROWS: [string, string][] = [
  ['footer / legal', 'Free returns, 30 days'],
  ['pdp / badge', 'Free returns, 30 days'],
  ['faq / answer', 'Free returns, 30 days'],
]

const REUSE_LINKS = [
  'M214 52 C 244 52, 246 112, 268 112',
  'M214 120 C 240 120, 246 118, 268 118',
  'M214 188 C 244 188, 246 124, 268 124',
]

function ReuseFig() {
  const reduced = useReducedMotion()
  return (
    <figure
      className="border border-line bg-paper-raised p-4 sm:p-6"
      role="img"
      aria-label="Three layers carrying the same line — Free returns, 30 days — in the footer, product page, and FAQ, linking into one token named returns.promise. Edit the token once and the three layers follow."
    >
      <svg
        viewBox="0 0 440 236"
        className="mx-auto block h-auto w-full max-w-[520px]"
        aria-hidden="true"
        focusable="false"
      >
        {REUSE_ROWS.map(([path, text], i) => {
          const yL = 36 + i * 68
          return (
            <g key={path}>
              <text
                x="16"
                y={yL}
                fontFamily={MONO}
                fontSize="9.5"
                letterSpacing="0.05em"
                fill="var(--ink-faint)"
              >
                {path}
              </text>
              <text x="16" y={yL + 20} fontSize="12" fill="var(--ink)">
                {text}
              </text>
              <line x1="16" y1={yL + 30} x2="208" y2={yL + 30} stroke="var(--line)" />
            </g>
          )
        })}

        {/* links draw in once — the act of linking, not decoration */}
        {REUSE_LINKS.map((d, i) => (
          <motion.path
            key={d}
            d={d}
            fill="none"
            stroke="var(--emerald)"
            strokeWidth="1.2"
            initial={reduced ? { opacity: 0 } : { pathLength: 0 }}
            whileInView={reduced ? { opacity: 1 } : { pathLength: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: 0.3 + i * 0.12, ease: 'easeOut' }}
          />
        ))}

        {/* the token — one seal for three layers */}
        <rect x="268" y="100" width="156" height="36" fill="var(--emerald-wash)" stroke="var(--emerald)" />
        <path
          d="M8 0 L10.2 5.8 L16 8 L10.2 10.2 L8 16 L5.8 10.2 L0 8 L5.8 5.8 Z"
          transform="translate(282 110)"
          fill="var(--emerald)"
        />
        <text
          x="306"
          y="122"
          fontFamily={MONO}
          fontSize="10.5"
          letterSpacing="0.05em"
          fill="var(--emerald)"
        >
          returns.promise
        </text>
        <text x="424" y="158" textAnchor="end" fontFamily={MONO} fontSize="9.5" fill="var(--ink-faint)">
          edit once · three layers follow
        </text>
      </svg>
    </figure>
  )
}

const JSON_LINES = [
  '{',
  '  "checkout.cta": {',
  '    "text": "Place order",',
  '    "status": "final"',
  '  },',
  '  "returns.promise": {',
  '    "text": "Free returns…",',
  '    "status": "review"',
  '  }',
  '}',
]

function HandoffFig() {
  return (
    <figure
      className="border border-line bg-paper-raised p-4 sm:p-6"
      role="img"
      aria-label="Two keyed strings exporting to a JSON block — checkout.cta, Place order, final; returns.promise, Free returns, review — with a dashed return arrow underneath labeled edits paste back."
    >
      <svg
        viewBox="0 0 440 236"
        className="mx-auto block h-auto w-full max-w-[520px]"
        aria-hidden="true"
        focusable="false"
      >
        {/* the keyed strings */}
        <rect
          x="16"
          y="24"
          width="112"
          height="20"
          fill="var(--gold-wash)"
          stroke="var(--gold)"
          strokeDasharray="3 3"
        />
        <text
          x="72"
          y="38"
          textAnchor="middle"
          fontFamily={MONO}
          fontSize="9.5"
          letterSpacing="0.05em"
          fill="var(--gold-ink)"
        >
          checkout.cta
        </text>
        <text x="140" y="38" fontFamily={MONO} fontSize="9.5" fill="var(--emerald)">
          final
        </text>
        <text x="16" y="66" fontSize="12" fill="var(--ink)">
          Place order
        </text>

        <rect
          x="16"
          y="92"
          width="128"
          height="20"
          fill="var(--gold-wash)"
          stroke="var(--gold)"
          strokeDasharray="3 3"
        />
        <text
          x="80"
          y="106"
          textAnchor="middle"
          fontFamily={MONO}
          fontSize="9.5"
          letterSpacing="0.05em"
          fill="var(--gold-ink)"
        >
          returns.promise
        </text>
        <text x="156" y="106" fontFamily={MONO} fontSize="9.5" fill="var(--indigo)">
          review
        </text>
        <text x="16" y="134" fontSize="12" fill="var(--ink)">
          Free returns, 30 days
        </text>

        {/* export arrow */}
        <text x="218" y="66" textAnchor="middle" fontFamily={MONO} fontSize="8.5" fill="var(--ink-faint)">
          copy json
        </text>
        <line x1="204" y1="78" x2="232" y2="78" stroke="var(--ink-faint)" />
        <path d="M240 78 l-8 -4.5 v9 Z" fill="var(--ink-faint)" />

        {/* the export itself — ink block, paper type */}
        <rect x="244" y="14" width="180" height="180" fill="var(--ink)" />
        {JSON_LINES.map((line, i) => (
          <text
            key={i}
            x="256"
            y={34 + i * 16}
            fontFamily={MONO}
            fontSize="9"
            fill="var(--paper)"
            style={{ whiteSpace: 'pre' }}
          >
            {line}
          </text>
        ))}

        {/* the round trip */}
        <path
          d="M334 194 V210 Q334 222 322 222 H72 Q60 222 60 210 V162"
          fill="none"
          stroke="var(--ink-faint)"
          strokeDasharray="4 3"
        />
        <path d="M60 154 L55.5 163 H64.5 Z" fill="var(--ink-faint)" />
        <text x="197" y="216" textAnchor="middle" fontFamily={MONO} fontSize="9" fill="var(--ink-faint)">
          edits paste back
        </text>
      </svg>
    </figure>
  )
}

/* ————— the ledger ————— */

const STEPS: {
  no: string
  verb: string
  title: string
  body: ReactNode
  fig: ReactNode
  textCls: string
  figCls: string
}[] = [
  {
    no: '१',
    verb: 'scan',
    title: 'The list is already there.',
    body: 'Open Chitra and every string in the file shows up, grouped page → frame. Nothing to configure first, no renaming layers so a plugin can find them.',
    fig: <ScanFig />,
    textCls: 'md:col-span-4',
    figCls: 'md:col-span-7 md:col-start-6',
  },
  {
    no: '२',
    verb: 'track',
    title: 'Every line goes on the record.',
    body: (
      <>
        Give a string a stable key, then walk it None → WIP → Review → Final. The{' '}
        <em className="italic">needs attention</em> filter rounds up whatever&rsquo;s still loose.
      </>
    ),
    fig: <TrackFig />,
    textCls: 'md:order-2 md:col-span-4 md:col-start-9',
    figCls: 'md:order-1 md:col-span-7 md:col-start-1',
  },
  {
    no: '३',
    verb: 'reuse',
    title: 'Say it once.',
    body: 'A line that repeats across frames becomes one token. Edit it in one place and every linked layer in the document follows — the whole document, not the current page.',
    fig: <ReuseFig />,
    textCls: 'md:col-span-4 md:col-start-2',
    figCls: 'md:col-span-6 md:col-start-7 md:-rotate-[0.75deg]',
  },
  {
    no: '४',
    verb: 'hand off',
    title: 'Hand over a file, not a screenshot.',
    body: 'Export JSON keyed by your stable ids. Edits made outside paste straight back in, so the canvas and the build stop drifting apart.',
    fig: <HandoffFig />,
    textCls: 'md:order-2 md:col-span-4 md:col-start-9',
    figCls: 'md:order-1 md:col-span-6 md:col-start-2',
  },
]

const FIRST_STEPS = [
  {
    no: '१',
    title: 'Open the panel',
    body: 'Plugins → Development → Chitra. Your copy is already listed — nothing to prepare.',
  },
  {
    no: '२',
    title: 'Give one loose string a key',
    body: 'Pick anything the needs-attention filter flags. If the line repeats, make it a token instead.',
  },
  {
    no: '३',
    title: 'Done, actually',
    body: 'That string is on the record. Every export from here on is keyed by it.',
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <Reveal className="max-w-2xl">
          <p className="eyebrow mb-4">
            {'// '}
            <span className="font-dev" aria-hidden="true">
              ०२
            </span>{' '}
            · how it works
          </p>
          <h2 className="font-display text-4xl leading-tight sm:text-5xl">
            How the ledger gets <em className="italic">kept.</em>
          </h2>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-ink-soft">
            Four moves, in order. The first one is opening the panel — Chitra does the reading.
          </p>
        </Reveal>

        {STEPS.map((step) => (
          <div key={step.no}>
            <div className="manuscript-rule mb-10 mt-16 md:mt-20">
              <span className="font-dev text-2xl leading-none text-gold-ink" aria-hidden="true">
                {step.no}
              </span>
              <span className="eyebrow">{step.verb}</span>
            </div>
            <Reveal className="grid items-center gap-8 md:grid-cols-12 md:gap-6">
              <div className={step.textCls}>
                <h3 className="font-display text-2xl leading-snug sm:text-[1.7rem]">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-soft">{step.body}</p>
              </div>
              <div className={step.figCls}>{step.fig}</div>
            </Reveal>
          </div>
        ))}

        {/* the first two minutes — the tutorial, kept honest */}
        <Reveal delay={0.05} className="mt-20 md:mt-24">
          <div className="stamp-well max-w-2xl md:ml-auto md:rotate-[0.5deg]">
            <div className="stamp p-6 sm:p-8">
              <p className="eyebrow mb-1">the first two minutes</p>
              <p className="font-display text-2xl leading-snug sm:text-[1.7rem]">
                Your first entry, start to finish.
              </p>
              <ol className="mt-6">
                {FIRST_STEPS.map((s) => (
                  <li
                    key={s.no}
                    className="grid grid-cols-[36px_1fr] gap-4 border-t border-line py-4 first:border-t-0"
                  >
                    <span className="font-dev text-2xl leading-none text-gold-ink" aria-hidden="true">
                      {s.no}
                    </span>
                    <div>
                      <h4 className="font-display text-lg leading-snug">{s.title}</h4>
                      <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="eyebrow mt-4">that&rsquo;s a source of truth. the ledger stays open.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
