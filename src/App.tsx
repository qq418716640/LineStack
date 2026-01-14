import { useRef } from 'react'
import { StoreProvider } from './store/StoreContext'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { ToolSection } from './components/ToolSection'
import { FAQ } from './components/FAQ'
import { Footer } from './components/Footer'
import './App.css'

function App() {
  const toolRef = useRef<HTMLElement>(null)
  const faqRef = useRef<HTMLElement>(null)

  const scrollToTool = () => {
    toolRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToExamples = () => {
    // For now, scroll to FAQ section as examples are not yet implemented
    faqRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <StoreProvider>
      <div className="app">
        <Header onTryClick={scrollToTool} onExamplesClick={scrollToExamples} />
        <main>
          <Hero onTryClick={scrollToTool} onExamplesClick={scrollToExamples} />
          <HowItWorks />
          <ToolSection ref={toolRef} />
          <section ref={faqRef}>
            <FAQ />
          </section>
        </main>
        <Footer />
      </div>
    </StoreProvider>
  )
}

export default App
