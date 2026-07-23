import { Reveal } from './Reveal'

const STEPS = [
  {
    no: '१',
    title: 'Build it once',
    body: (
      <>
        In the repo’s <code className="font-mono text-[12.5px]">plugin/</code> folder:
        <span className="mt-2 block overflow-x-auto border border-line bg-ink px-3 py-2 font-mono text-[12px] text-paper">
          npm install && npm run build
        </span>
      </>
    ),
  },
  {
    no: '२',
    title: 'Open the Figma desktop app',
    body: 'Development plugins don’t run in the browser.',
  },
  {
    no: '३',
    title: 'Import the manifest',
    body: (
      <>
        <span className="font-mono text-[12.5px]">
          Plugins → Development → Import plugin from manifest…
        </span>{' '}
        and pick <span className="font-mono text-[12.5px]">plugin/manifest.json</span>. You do this
        once.
      </>
    ),
  },
  {
    no: '४',
    title: 'Run it',
    body: (
      <>
        <span className="font-mono text-[12.5px]">Plugins → Development → Chitra</span>. The panel
        opens on the right. That’s it.
      </>
    ),
  },
]

export function Install() {
  return (
    <section id="start" className="border-t border-line bg-paper-sunk">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <Reveal className="mb-12 max-w-xl">
          <p className="eyebrow mb-4">
            {'// '}
            <span className="font-dev" aria-hidden="true">
              ०४
            </span>{' '}
            · install
          </p>
          <h2 className="font-display text-4xl leading-tight sm:text-5xl">
            Runs as a <em className="italic">development</em> plugin.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-ink-soft">
            No marketplace listing yet. Four steps, fully offline — the plugin requests no network
            access at all.
          </p>
        </Reveal>

        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.no} delay={i * 0.07} className={i % 2 === 1 ? 'lg:translate-y-6' : ''}>
              <li className="stamp-well h-full">
                <div className="stamp h-full p-6 pt-5">
                  <span className="font-dev text-4xl text-gold-ink" aria-hidden="true">
                    {step.no}
                  </span>
                  <h3 className="font-display mt-2 text-xl leading-snug">{step.title}</h3>
                  <div className="mt-2 text-[13px] leading-relaxed text-ink-soft">{step.body}</div>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={0.2}>
          <p className="eyebrow mt-12 leading-relaxed">
            select a frame → chitra lists every string → assign tokens, set statuses → export{' '}
            <span className="text-emerald">copy.json</span> for the build
          </p>
        </Reveal>
      </div>
    </section>
  )
}
