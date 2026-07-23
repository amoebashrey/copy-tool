/**
 * The four shipped features, laid out as an offset 7/5 – 5/7 composition —
 * structure adapted from the Magic UI "Bento Grid" pattern (magicui.design,
 * MIT), then deliberately de-gridded: unequal spans, one card pushed down,
 * one rotated. Marketing copy is studio voice; the quoted line at the foot
 * of each card is the plugin's own in-product microcopy, verbatim.
 */
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Reveal } from './Reveal'
import { TokenSeal } from './Ornaments'

/* ————— mini-demos ————— */

const SCAN_ROWS = [
  ['Hero/H1', 'Split rent, not friendships'],
  ['Nav/CTA', 'Create account'],
  ['Empty/Body', 'Nothing here yet — invite a friend'],
  ['Toast/Success', 'You’re in.'],
]

function ScanDemo() {
  const reduced = useReducedMotion()
  return (
    <div
      className="border border-line bg-paper-sunk p-4"
      role="img"
      aria-label="The panel lists every string it found, each with its frame path: Hero/H1, Nav/CTA, Empty/Body, Toast/Success."
    >
      <ul aria-hidden="true" className="space-y-2">
        {SCAN_ROWS.map(([path, text], i) => (
          <motion.li
            key={path}
            className="flex items-baseline justify-between gap-4 border-b border-line pb-2 last:border-0 last:pb-0"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 2 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.15 + i * 0.12 }}
          >
            <span className="font-mono text-[11px] tracking-wide text-ink-faint">{path}</span>
            <span className="truncate text-[13px]">{text}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

const STATES = [
  { key: 'none', label: 'None', color: 'var(--ink-faint)' },
  { key: 'wip', label: 'WIP', color: 'var(--saffron-ink)' },
  { key: 'review', label: 'Review', color: 'var(--indigo)' },
  { key: 'final', label: 'Final', color: 'var(--emerald)' },
]

function StatusDemo() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [step, setStep] = useState(reduced ? 3 : 0)

  useEffect(() => {
    if (!inView || reduced || step >= 3) return
    const t = window.setTimeout(() => setStep((s) => s + 1), step === 0 ? 700 : 900)
    return () => window.clearTimeout(t)
  }, [inView, reduced, step])

  const active = STATES[step]
  return (
    <div
      ref={ref}
      className="border border-line bg-paper-sunk p-4"
      role="img"
      aria-label="A string moving through the review workflow — None, WIP, Review — and settling on Final."
    >
      <div aria-hidden="true">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="font-display text-base italic">“Split rent, not friendships”</span>
          <motion.span
            key={active.key}
            className="border px-2 py-1 font-mono text-[11px]"
            style={{ color: active.color, borderColor: active.color }}
            initial={reduced ? { opacity: 0.6 } : { scale: 1.04, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {active.label}
          </motion.span>
        </div>
        <ol className="flex items-center gap-2 font-mono text-[11px] text-ink-faint">
          {STATES.map((s, i) => (
            <li key={s.key} className="flex items-center gap-2">
              {i > 0 && <span className="text-line">·</span>}
              <span style={i <= step ? { color: s.color } : undefined}>{s.label}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

const LINKED = [
  ['Home/Hero', 'Sign Up'],
  ['Pricing/Card', 'Get started!'],
  ['Checkout_Modal', 'Join now'],
]

function TokenDemo() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [synced, setSynced] = useState(!!reduced)

  useEffect(() => {
    if (!inView || reduced) return
    const t = window.setTimeout(() => setSynced(true), 1100)
    return () => window.clearTimeout(t)
  }, [inView, reduced])

  return (
    <div
      ref={ref}
      className="border border-line bg-paper-sunk p-4"
      role="img"
      aria-label="One token, cta_primary, propagating its text — Create account — to three linked layers across Home, Pricing, and the checkout modal."
    >
      <div aria-hidden="true">
        <p
          className="inline-flex items-center gap-2 border border-emerald px-2.5 py-1.5 font-mono text-[11px] text-emerald"
          style={{ backgroundColor: 'var(--emerald-wash)' }}
        >
          <TokenSeal /> cta_primary · “Create account”
        </p>
        <ul className="mt-3 space-y-2">
          {LINKED.map(([path, before], i) => (
            <li key={path} className="flex items-baseline justify-between gap-4">
              <span className="font-mono text-[11px] tracking-wide text-ink-faint">{path}</span>
              <motion.span
                key={synced ? 'after' : 'before'}
                className="text-[13px]"
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: synced ? i * 0.08 : 0 }}
                style={synced ? undefined : { color: 'var(--saffron-ink)' }}
              >
                {synced ? 'Create account' : before}
              </motion.span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const JSON_LINES = [
  '{',
  '  "checkout_modal": {',
  '    "cta_primary": {',
  '      "text": "Create account",',
  '      "status": "final"',
  '    },',
  '    "cta_secondary": {',
  '      "text": "Maybe later",',
  '      "status": "review"',
  '    }',
  '  }',
  '}',
]

function JsonDemo() {
  const reduced = useReducedMotion()
  return (
    <div
      className="overflow-x-auto border border-line bg-ink p-4 text-paper"
      role="img"
      aria-label="The exported copy.json file: token names with their text and review status, nested by frame."
    >
      <pre aria-hidden="true" className="font-mono text-[11.5px] leading-relaxed">
        {JSON_LINES.map((line, i) => (
          <motion.span
            key={i}
            className="block"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2, delay: reduced ? 0 : 0.1 + i * 0.07 }}
          >
            {line || ' '}
          </motion.span>
        ))}
      </pre>
    </div>
  )
}

/* ————— cards ————— */

function Card({
  dev,
  title,
  children,
  demo,
  voice,
  className = '',
  delay = 0,
}: {
  dev: string
  title: string
  children: ReactNode
  demo: ReactNode
  voice: string
  className?: string
  delay?: number
}) {
  return (
    <Reveal className={className} delay={delay}>
      <article className="stamp-well h-full">
        <div className="stamp relative flex h-full flex-col gap-4 p-7 sm:p-8">
          <span
            aria-hidden="true"
            className="font-dev pointer-events-none absolute right-6 top-3 select-none text-6xl leading-none text-ink opacity-[0.07]"
          >
            {dev}
          </span>
          <h3 className="font-display max-w-[85%] text-2xl leading-tight sm:text-[1.7rem]">
            {title}
          </h3>
          <p className="max-w-prose text-sm leading-relaxed text-ink-soft">{children}</p>
          <div className="mt-auto">{demo}</div>
          <p className="font-display text-[15px] italic text-ink-soft">
            <span className="eyebrow mr-2 not-italic">she says</span>
            {voice}
          </p>
        </div>
      </article>
    </Reveal>
  )
}

export function Features() {
  return (
    <section id="work" className="relative mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <Reveal className="mb-14 max-w-2xl md:mb-16">
        <p className="eyebrow mb-4">
          {'// '}
          <span className="font-dev" aria-hidden="true">
            ०१
          </span>{' '}
          · what it does
        </p>
        <h2 className="font-display text-4xl leading-tight sm:text-5xl md:text-6xl">
          In the plugin, <em className="italic">today.</em>
        </h2>
        <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-ink-soft">
          The button says “Sign up” in the mockup, “Create account” in the doc, “Get started” in
          the build. Nobody decided that. Chitra does the hunting — four things, all shipped.
        </p>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-12">
        <Card
          dev="अ"
          title="Every string, one panel"
          demo={<ScanDemo />}
          voice="“Every string in this file answers to me now.”"
          className="md:col-span-7"
        >
          Every text layer on the page, in one list, grouped by frame. Edit a line in the panel
          and the canvas updates — fonts stay put. Search and filter as the file grows.
        </Card>

        <Card
          dev="आ"
          title="A status on every line"
          demo={<StatusDemo />}
          voice="“This one is Final. You may ship it.”"
          className="md:col-span-5 md:translate-y-10"
          delay={0.08}
        >
          Mark a string None → WIP → Review → Final. Open the file a week later and you can tell
          which words are settled and which are still moving.
        </Card>

        <Card
          dev="इ"
          title="Copy tokens"
          demo={<TokenDemo />}
          voice="“Change it once. I will inform the other three hundred.”"
          className="md:col-span-5 md:-rotate-1 md:origin-bottom-right"
          delay={0.05}
        >
          Turn a string into a token and link layers to it across frames. Edit the token once;
          every linked layer takes the change. The pricing page stops disagreeing with the
          checkout.
        </Card>

        <Card
          dev="ई"
          title="Handoff without retyping"
          demo={<JsonDemo />}
          voice="“Inscribing copy directly into your codebase…”"
          className="md:col-span-7 md:translate-y-10"
          delay={0.12}
        >
          Engineers get a read-only view of every string with its status, plus one-click export
          to <code className="font-mono text-[13px]">copy.json</code> — token names, text, state.
          Nobody retypes from a screenshot.
        </Card>
      </div>
    </section>
  )
}
