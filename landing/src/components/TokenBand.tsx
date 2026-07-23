/**
 * Bilingual ledger band — derived from the Magic UI "Marquee" pattern
 * (magicui.design, MIT), rebuilt scroll-linked instead of time-looped:
 * brand motion rule says nothing loops, so the strip moves only as the
 * reader scrolls. Static under prefers-reduced-motion.
 */
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { TokenSeal } from './Ornaments'

const ITEMS = [
  { text: 'cta_primary', mono: true },
  { text: 'चित्र', dev: true },
  { text: 'Final', mono: true, emerald: true },
  { text: 'one file' },
  { text: 'empty_state_body', mono: true },
  { text: 'चित्रगुप्त', dev: true },
  { text: 'copy.json', mono: true },
  { text: 'zero drift' },
  { text: 'nav_signin', mono: true },
]

function Run() {
  return (
    <>
      {ITEMS.map((item, i) => (
        <span key={i} className="inline-flex items-center gap-6 sm:gap-8">
          <span
            className={
              item.dev
                ? 'font-dev text-2xl text-ink-soft'
                : item.mono
                  ? `font-mono text-sm tracking-wide ${item.emerald ? 'text-emerald' : 'text-ink-soft'}`
                  : 'font-display text-2xl italic text-ink-soft'
            }
          >
            {item.text}
          </span>
          <TokenSeal className="shrink-0 text-gold" />
        </span>
      ))}
    </>
  )
}

export function TokenBand() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-22%'])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative overflow-hidden border-y border-line bg-paper-sunk py-4"
    >
      <motion.div
        className="flex w-max items-center gap-6 whitespace-nowrap pl-4 sm:gap-8"
        style={reduced ? undefined : { x }}
      >
        <Run />
        <Run />
        <Run />
      </motion.div>
    </div>
  )
}
