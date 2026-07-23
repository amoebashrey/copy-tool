import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { TokenBand } from './components/TokenBand'
import { Features } from './components/Features'
import { Naming } from './components/Naming'
import { Roadmap } from './components/Roadmap'
import { Install } from './components/Install'
import { Closer } from './components/Closer'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <TokenBand />
        <Features />
        <Naming />
        <Roadmap />
        <Install />
        <Closer />
      </main>
      <Footer />
    </>
  )
}
