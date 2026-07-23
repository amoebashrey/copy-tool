import { motion, useReducedMotion } from 'framer-motion'
import { HeroDemo } from './HeroDemo'
import { Mandala } from './Ornaments'
import { TextStagger } from './TextStagger'

export function Hero() {
  const reduced = useReducedMotion()
  return (
    <section id="top" className="relative overflow-x-clip">
      {/* one mandala per page, anchored to the hero */}
      <Mandala className="pointer-events-none absolute -right-28 -top-24 w-105 text-line md:-right-16 md:w-130" />
      {/* ghosted Devanagari — the shop-sign layer */}
      <span
        aria-hidden="true"
        className="font-dev pointer-events-none absolute -left-6 bottom-2 select-none text-[9rem] leading-none text-ink opacity-[0.045] md:text-[16rem]"
      >
        चित्र
      </span>

      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 pb-20 pt-14 md:grid-cols-12 md:gap-6 md:px-8 md:pb-28 md:pt-20">
        <div className="md:col-span-7 md:pr-8">
          <motion.p
            className="eyebrow mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {'// a figma plugin · '}
            <span className="font-dev text-xs" aria-hidden="true">
              चित्र
            </span>
          </motion.p>

          <TextStagger
            as="h1"
            className="font-display text-[3.4rem] leading-[0.98] sm:text-7xl md:text-[5.6rem]"
            segments={[
              { text: 'Every string,' },
              { text: 'accounted', italic: true },
              { text: 'for.' },
            ]}
          />

          <motion.p
            className="mt-7 max-w-md text-base leading-relaxed text-ink-soft"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            Chitra reads every text layer in your Figma file into one panel, keeps each string on
            the record, and flags the ones that drift. Named for the scribe of the gods, who never
            lost a note.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <a href="#start" className="cta-stamp">
              Add to Figma
            </a>
            <a href="#work" className="cta-quiet">
              see it work ↓
            </a>
          </motion.div>

          <motion.p
            className="eyebrow mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.65 }}
          >
            one source of truth · zero copy chaos
          </motion.p>
        </div>

        {/* the demo — rotated a couple of degrees, like a stamp set by hand */}
        <div className="relative md:col-span-5 md:mt-4">
          <motion.div
            className="stamp-well md:-rotate-[1.5deg] md:origin-top-left"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <HeroDemo />
          </motion.div>
          <p className="eyebrow mt-5 text-right" aria-hidden="true">
            ↻ the demo loops. she doesn&rsquo;t mind.
          </p>
        </div>
      </div>
    </section>
  )
}
