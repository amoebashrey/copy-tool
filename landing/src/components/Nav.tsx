import { useTheme } from '../lib/useTheme'
import { DiyaIcon, MoonIcon } from './Ornaments'

const links = [
  { href: '#work', label: 'what it does' },
  { href: '#how', label: 'how it works' },
  { href: '#name', label: 'the name' },
  { href: '#ledger', label: 'roadmap' },
  { href: '#start', label: 'install' },
]

export function Nav() {
  const { theme, toggle } = useTheme()
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-5 md:px-8">
        <a href="#top" className="flex items-baseline gap-2" aria-label="Chitra — top of page">
          <span
            aria-hidden="true"
            className="font-dev grid h-7 w-7 translate-y-0.5 place-items-center border border-dashed border-gold bg-ink text-[15px] leading-none text-paper"
          >
            च
          </span>
          <span className="font-display text-xl">Chitra</span>
          <span aria-hidden="true" className="font-dev text-sm text-ink-faint">
            · चित्र
          </span>
        </a>

        {/* five links no longer fit beside the lockup at md — show from lg up */}
        <nav aria-label="Sections" className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="cta-quiet border-b-transparent">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className="grid h-9 w-9 place-items-center border border-line text-ink-soft transition-colors hover:border-gold hover:text-ink"
          >
            {theme === 'dark' ? <DiyaIcon /> : <MoonIcon />}
          </button>
          <a href="#start" className="cta-stamp hidden sm:inline-flex">
            Add to Figma
          </a>
        </div>
      </div>
    </header>
  )
}
