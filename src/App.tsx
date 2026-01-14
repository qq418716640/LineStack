import { useRef } from 'react'
import { StoreProvider } from './store/StoreContext'
import { UmamiScript } from './components/UmamiScript'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { ToolSection } from './components/ToolSection'
import { Examples } from './components/Examples'
import { AITools } from './components/AITools'
import { FAQ } from './components/FAQ'
import { GoPro } from './components/GoPro'
import { Footer } from './components/Footer'
import { trackNavClick } from './utils/umami'
import './App.css'

function App() {
  const toolRef = useRef<HTMLElement>(null)
  const examplesRef = useRef<HTMLElement>(null)
  const goProRef = useRef<HTMLElement>(null)

  const scrollToTool = () => {
    trackNavClick('try_linestack')
    toolRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToExamples = () => {
    trackNavClick('examples')
    examplesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToGoPro = () => {
    trackNavClick('go_pro')
    goProRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <StoreProvider>
      <UmamiScript />
      <div className="app">
        <Header
          onTryClick={scrollToTool}
          onExamplesClick={scrollToExamples}
          onGoProClick={scrollToGoPro}
        />
        <main>
          <Hero onTryClick={scrollToTool} onExamplesClick={scrollToExamples} />
          <HowItWorks />
          <ToolSection ref={toolRef} />
          <Examples ref={examplesRef} />
          <AITools />
          <FAQ />
          <GoPro ref={goProRef} />
        </main>
        <Footer />
      </div>
    </StoreProvider>
  )
}

export default App
