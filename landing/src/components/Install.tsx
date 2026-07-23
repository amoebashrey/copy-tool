import { Reveal } from './Reveal'

const STEPS = [
  {
    no: '१',
    title: 'Download & unzip',
    body: (
      <>
        Grab the zip above and unzip it somewhere permanent.{' '}
        <span className="text-ink">Don’t move the folder after importing</span> — Figma reads the
        files by their location.
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
        and pick <span className="font-mono text-[12.5px]">manifest.json</span> from the folder. You
        do this once.
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
        <Reveal className="mb-10 max-w-xl">
          <p className="eyebrow mb-4">
            {'// '}
            <span className="font-dev" aria-hidden="true">
              ०५
            </span>{' '}
            · install
          </p>
          <h2 className="font-display text-4xl leading-tight sm:text-5xl">
            Download it. <em className="italic">Import</em> it. Done.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-ink-soft">
            No marketplace listing, no build step, no account. Chitra runs as a{' '}
            <em className="italic">development</em> plugin — fully offline, requesting no network
            access at all.
          </p>
        </Reveal>

        {/* download card — the one thing to click */}
        <Reveal delay={0.05} className="mb-14">
          <div className="stamp-well max-w-xl">
            <div className="stamp p-6 sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="eyebrow mb-1">the plugin · ready to import</p>
                  <p className="font-display text-2xl leading-snug">chitra-figma-plugin.zip</p>
                  <p className="mt-1 font-mono text-[12px] text-ink-faint">
                    prebuilt · offline · install notes inside
                  </p>
                </div>
                <a
                  href="/chitra-figma-plugin.zip"
                  download
                  className="cta-stamp shrink-0 self-start sm:self-auto"
                >
                  <span aria-hidden="true">↓</span> Download plugin
                </a>
              </div>
            </div>
          </div>
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

        {/* developer aside — building from source stays possible, just not the headline */}
        <Reveal delay={0.25}>
          <p className="mt-6 text-[13px] leading-relaxed text-ink-faint">
            Rather build from source? Clone the repo and run{' '}
            <span className="font-mono text-[12px] text-ink-soft">npm install &amp;&amp; npm run build</span>{' '}
            in <span className="font-mono text-[12px] text-ink-soft">plugin/</span>, then import{' '}
            <span className="font-mono text-[12px] text-ink-soft">plugin/manifest.json</span>.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
