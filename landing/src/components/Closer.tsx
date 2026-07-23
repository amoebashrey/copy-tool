import { Reveal } from './Reveal'

export function Closer() {
  return (
    <section aria-label="Closing" className="relative overflow-x-clip">
      <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
        <Reveal className="relative">
          <span
            aria-hidden="true"
            className="font-dev pointer-events-none absolute -right-8 -top-16 select-none text-[8rem] leading-none text-ink opacity-[0.045] md:text-[13rem]"
          >
            च
          </span>
          <p className="eyebrow mb-5">{'// the idea'}</p>
          <p className="font-display max-w-4xl text-4xl leading-[1.08] sm:text-6xl md:text-7xl">
            Decide the words once.
            <br />
            <em className="italic">She keeps them that way.</em>
          </p>
          <a href="#start" className="cta-stamp mt-10 inline-flex">
            Add to Figma
          </a>
        </Reveal>
      </div>
    </section>
  )
}
