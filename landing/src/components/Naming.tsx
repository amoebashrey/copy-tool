import { Reveal } from './Reveal'
import { Kalam } from './Ornaments'

export function Naming() {
  return (
    <section id="name" className="overflow-x-clip border-y border-line bg-paper-sunk">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-12 md:px-8 md:py-28">
        {/* the seal — offset, rotated, layered over a big Devanagari ghost */}
        <Reveal className="relative md:col-span-5 md:col-start-2">
          <span
            aria-hidden="true"
            className="font-dev pointer-events-none absolute -left-4 -top-14 select-none text-[7.5rem] leading-none text-ink opacity-[0.05] md:text-[10rem]"
          >
            चित्रगुप्त
          </span>
          <div className="stamp-well mx-auto w-56 rotate-2 sm:w-64">
            <div className="stamp flex flex-col items-center gap-3 px-8 py-10 text-center">
              <Kalam className="w-12" />
              <span className="font-dev text-5xl leading-none" aria-hidden="true">
                चित्र
              </span>
              <span className="eyebrow">the scribe · est. before time</span>
            </div>
          </div>
        </Reveal>

        <div className="md:col-span-5 md:col-start-8">
          <Reveal>
            <p className="eyebrow mb-4">
              {'// '}
              <span className="font-dev" aria-hidden="true">
                ०३
              </span>{' '}
              · the name
            </p>
            <h2 className="font-display text-4xl leading-tight sm:text-5xl">
              Named for <em className="italic">Chitragupta.</em>
            </h2>
            <p className="mt-6 text-[15px] leading-relaxed text-ink-soft">
              In Hindu myth, Chitragupta keeps the complete record of every word and deed. Nothing
              gets past the ledger. Chitra borrows the name and the job, at a smaller scale: the
              text layers in a Figma file. She remembers what each one is supposed to say, and when
              one changes on its own, she says so.
            </p>
            <p className="font-display mt-6 text-2xl italic">A ledger, kept properly.</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
