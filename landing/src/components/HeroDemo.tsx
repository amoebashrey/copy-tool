/**
 * The in-practice loop: a drifted string gets selected and corrected
 * into the approved token. In-product persona voice lives here (the
 * two-register rule) — nowhere else on the page.
 *
 * Motion per brand/chitra.md: crossfade + 2px rise for string updates,
 * ink-stamp settle (1.04 → 1.0, ~180ms) for the sync confirmation.
 * Under prefers-reduced-motion the demo holds its synced state.
 */
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { TokenSeal } from './Ornaments'

const TOKEN_TEXT = 'Create account'
const DRIFTS = ['Sign Up', 'Get started!', 'Join now']

type Phase = 'drift' | 'select' | 'stamp' | 'synced'

const PHASE_MS: Record<Phase, number> = {
  drift: 2400,
  select: 1700,
  stamp: 1400,
  synced: 3000,
}

const NEXT: Record<Phase, Phase> = {
  drift: 'select',
  select: 'stamp',
  stamp: 'synced',
  synced: 'drift',
}

const CAPTIONS: Record<Phase, string> = {
  drift: 'Unlinked copy detected in ‘Checkout_Modal’. Assign a token?',
  select: 'Chitra is reading your manuscript…',
  stamp: 'Recorded.',
  synced: 'Order is restored. Every string is in its place.',
}

export function HeroDemo() {
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState<Phase>(reduced ? 'synced' : 'drift')
  const [caseIndex, setCaseIndex] = useState(0)

  useEffect(() => {
    if (reduced) return
    const t = window.setTimeout(() => {
      if (phase === 'synced') setCaseIndex((i) => (i + 1) % DRIFTS.length)
      setPhase(NEXT[phase])
    }, PHASE_MS[phase])
    return () => window.clearTimeout(t)
  }, [phase, reduced])

  const corrected = phase === 'stamp' || phase === 'synced'
  const label = corrected ? TOKEN_TEXT : DRIFTS[caseIndex]
  const statusWord = corrected ? 'in sync' : phase === 'select' ? 'reading' : 'drifted'
  const statusColor = corrected
    ? 'text-emerald'
    : phase === 'select'
      ? 'text-gold-ink'
      : 'text-saffron-ink'

  return (
    <div
      role="img"
      aria-label="Looping demo of the plugin at work: a button in the Checkout_Modal frame says ‘Sign Up’ while the approved token cta_primary says ‘Create account’. Chitra flags the drifted string, corrects it to the token text, and reports the file back in sync."
    >
      <div aria-hidden="true" className="stamp p-6 pb-5 sm:p-7 sm:pb-6">
        {/* — the canvas — */}
        <div className="relative border border-line bg-paper-sunk px-5 pb-6 pt-4">
          <p className="eyebrow mb-4">Checkout_Modal</p>
          <div className="max-w-65 border border-line bg-paper-raised p-4 shadow-sm">
            <div className="mb-2 h-2 w-3/4 rounded-full bg-line" />
            <div className="mb-4 h-2 w-1/2 rounded-full bg-line" />
            <div className="relative inline-block">
              <span className="relative z-10 inline-block bg-ink px-4 py-2 font-mono text-xs text-paper">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={label}
                    className="inline-block"
                    initial={reduced ? { opacity: 0 } : { opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, y: -2 }}
                    transition={{ duration: 0.15 }}
                  >
                    {label}
                  </motion.span>
                </AnimatePresence>
              </span>
              {/* selection box */}
              <AnimatePresence>
                {(phase === 'select' || phase === 'stamp') && (
                  <motion.span
                    className="absolute -inset-1.5 z-20 border-2 border-gold"
                    initial={{ opacity: 0, scale: reduced ? 1 : 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                  >
                    <span className="absolute -left-1 -top-1 h-2 w-2 bg-gold" />
                    <span className="absolute -right-1 -top-1 h-2 w-2 bg-gold" />
                    <span className="absolute -bottom-1 -left-1 h-2 w-2 bg-gold" />
                    <span className="absolute -bottom-1 -right-1 h-2 w-2 bg-gold" />
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* — the plugin panel — */}
        <div className="mt-4 border border-line bg-paper-raised">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <p className="font-display text-base leading-none">
              Chitra <span className="font-dev text-sm text-ink-faint">चित्र</span>
            </p>
            <p className={`font-mono text-[11px] tracking-wider ${statusColor}`}>{statusWord}</p>
          </div>
          <div className="px-4 py-3">
            <p className="min-h-10 font-mono text-xs leading-relaxed text-ink-soft">
              {CAPTIONS[phase]}
            </p>
            <AnimatePresence mode="wait" initial={false}>
              {corrected ? (
                <motion.p
                  key="token"
                  className="mt-1 inline-flex items-center gap-2 border border-emerald bg-[image:none] px-2.5 py-1.5 font-mono text-[11px] text-emerald"
                  style={{ backgroundColor: 'var(--emerald-wash)' }}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                >
                  <TokenSeal /> cta_primary · “{TOKEN_TEXT}”
                </motion.p>
              ) : (
                <motion.p
                  key="drifted"
                  className="mt-1 inline-flex items-center gap-2 border border-dashed px-2.5 py-1.5 font-mono text-[11px] text-saffron-ink"
                  style={{ borderColor: 'var(--saffron)', backgroundColor: 'var(--saffron-wash)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  unlinked · “{DRIFTS[caseIndex]}”
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
