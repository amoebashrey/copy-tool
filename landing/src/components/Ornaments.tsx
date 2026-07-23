/**
 * SVG ornaments from brand/chitra.md motifs:
 * mandala geometry (one per page, anchored to the hero) and the
 * kalam (reed pen), the mark for editing/writing states.
 */

export function Mandala({ className = '' }: { className?: string }) {
  const petals = Array.from({ length: 12 }, (_, i) => i * 30)
  const dots = Array.from({ length: 8 }, (_, i) => i * 45)
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.1">
        <circle cx="100" cy="100" r="97" />
        <circle cx="100" cy="100" r="80" />
        <circle cx="100" cy="100" r="46" />
        <circle cx="100" cy="100" r="30" />
        <circle cx="100" cy="100" r="10" />
        {petals.map((deg) => (
          <path
            key={deg}
            d="M100 6 C 113 32 113 56 100 78 C 87 56 87 32 100 6 Z"
            transform={`rotate(${deg} 100 100)`}
          />
        ))}
      </g>
      <g fill="currentColor">
        {dots.map((deg) => (
          <circle key={deg} cx="100" cy="62" r="2.4" transform={`rotate(${deg} 100 100)`} />
        ))}
      </g>
    </svg>
  )
}

export function Kalam({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <path d="M46 4 q8 -6 12 -2 q4 4 -2 12 L22 48 L12 38 Z" fill="var(--indigo)" />
      <path d="M12 38 L22 48 L6 58 Z" fill="var(--gold)" />
      <path d="M6 58 L15 46" stroke="var(--ink)" strokeWidth="1.6" fill="none" />
    </svg>
  )
}

/** Diya (oil lamp) — light theme icon for the toggle. Custom 1.5px stroke. */
export function DiyaIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path d="M12 3 q3 3.5 0 7 q-3 -3.5 0 -7 Z" fill="currentColor" />
      <path
        d="M4 13 h16 q-1 6 -8 6 q-7 0 -8 -6 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        d="M20 14.5 A8.5 8.5 0 1 1 9.5 4 A7 7 0 0 0 20 14.5 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Token glyph — the four-pointed seal that marks a copy token. */
export function TokenSeal({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" width="11" height="11" className={className} aria-hidden="true" focusable="false">
      <path d="M8 0 L10.2 5.8 L16 8 L10.2 10.2 L8 16 L5.8 10.2 L0 8 L5.8 5.8 Z" fill="currentColor" />
    </svg>
  )
}

export function ArrowUpRight() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" focusable="false">
      <path d="M4 12 L12 4 M6 4 h6 v6" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}
