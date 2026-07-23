import { Reveal } from './Reveal'

const ITEMS = [
  {
    no: '०१',
    title: 'Localization & variants',
    body: 'One token, several locales. A/B variants hang off the same token instead of living in duplicate frames.',
  },
  {
    no: '०२',
    title: 'Two-way sync with code',
    body: 'Push tokens to the repo. Pull engineering’s edits back onto the canvas, so the file stops drifting from production.',
  },
  {
    no: '०३',
    title: 'Copy lint',
    body: 'Spelling, banned words, layers nobody linked. She reads the whole file and files a report.',
  },
]

export function Roadmap() {
  return (
    <section id="ledger" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <div className="grid gap-12 md:grid-cols-12">
        <Reveal className="md:col-span-4">
          <p className="eyebrow mb-4">
            {'// '}
            <span className="font-dev" aria-hidden="true">
              ०३
            </span>{' '}
            · roadmap
          </p>
          <h2 className="font-display text-4xl leading-tight sm:text-5xl">
            Not built. <em className="italic">Yet.</em>
          </h2>
          <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-ink-soft">
            Three things on the list. No dates promised — the ledger doesn’t record intentions as
            deeds.
          </p>
        </Reveal>

        <ul className="md:col-span-7 md:col-start-6">
          {ITEMS.map((item, i) => (
            <Reveal key={item.no} delay={i * 0.06}>
              <li className="grid gap-2 border-t border-line py-7 sm:grid-cols-[64px_1fr_auto] sm:gap-6 last:border-b">
                <span className="font-dev text-2xl text-ink-faint" aria-hidden="true">
                  {item.no}
                </span>
                <div>
                  <h3 className="font-display text-2xl leading-snug">{item.title}</h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">{item.body}</p>
                </div>
                <span
                  className="h-fit w-fit border border-dashed px-2 py-1 font-mono text-[11px] text-saffron-ink"
                  style={{ borderColor: 'var(--saffron)', backgroundColor: 'var(--saffron-wash)' }}
                >
                  planned
                </span>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
