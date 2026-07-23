import { ArrowUpRight } from './Ornaments'

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <p className="flex items-baseline gap-2">
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
          </p>
          <p className="mt-3 text-sm text-ink-soft">
            Made in India, for the world. <span className="font-mono text-xs">© 2026</span>
          </p>
        </div>
        <div className="md:text-right">
          <p className="eyebrow">{'// a shrey.lab project'}</p>
          <a
            href="https://heyfelix.vercel.app"
            rel="author"
            className="cta-quiet mt-1 inline-flex items-center gap-1.5"
          >
            built by shreyas · shrey.lab <ArrowUpRight />
          </a>
        </div>
      </div>
    </footer>
  )
}
