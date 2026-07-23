/**
 * Per-word arrival for display headlines — adapted from the
 * Motion Primitives "TextEffect" pattern (motion-primitives, MIT),
 * restyled to Chitra's motion rules: headline words set in like type
 * being placed, 40ms stagger, once. Opacity-only under reduced motion.
 */
import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

type Segment = { text: string; italic?: boolean; className?: string }

export function TextStagger({
  segments,
  as: Tag = 'h1',
  className = '',
  delay = 0,
}: {
  segments: Segment[]
  as?: 'h1' | 'h2' | 'p'
  className?: string
  delay?: number
}) {
  const reduced = useReducedMotion()
  const MotionTag = motion[Tag]

  let wordIndex = 0
  const rendered: ReactNode[] = segments.map((seg, si) => {
    const words = seg.text.split(' ').filter(Boolean)
    return words.map((word, wi) => {
      const i = wordIndex++
      const inner = seg.italic ? <em className="italic">{word}</em> : word
      return (
        <motion.span
          key={`${si}-${wi}`}
          className={`inline-block ${seg.className ?? ''}`}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14, rotate: -1 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, rotate: 0 }}
          transition={{
            duration: reduced ? 0.2 : 0.5,
            delay: delay + i * 0.04,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {inner}
          {' '}
        </motion.span>
      )
    })
  })

  return <MotionTag className={className}>{rendered}</MotionTag>
}
