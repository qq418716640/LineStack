import { useRef } from 'react'
import { StoreProvider } from './store/StoreContext'
import { UmamiScript } from './components/UmamiScript'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { WhatIs } from './components/WhatIs'
import { HowItWorks } from './components/HowItWorks'
import { ToolSection } from './components/ToolSection'
import { Differentiation } from './components/Differentiation'
import { UseCases } from './components/UseCases'
import { Examples } from './components/Examples'
import { AITools } from './components/AITools'
import { FAQ } from './components/FAQ'
import { Footer } from './components/Footer'
import { trackNavClick } from './utils/umami'
import './App.css'

function App() {
  const toolRef = useRef<HTMLElement>(null)
  const examplesRef = useRef<HTMLElement>(null)
  const moreToolsRef = useRef<HTMLElement>(null)

  const scrollToTool = () => {
    trackNavClick('try_linestack')
    toolRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToExamples = () => {
    trackNavClick('examples')
    examplesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToMoreTools = () => {
    trackNavClick('more_tools')
    moreToolsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <StoreProvider>
      <UmamiScript />
      <div className="app">
        <Header
          onTryClick={scrollToTool}
          onExamplesClick={scrollToExamples}
          onMoreToolsClick={scrollToMoreTools}
        />
        <main>
          <Hero onTryClick={scrollToTool} onExamplesClick={scrollToExamples} />
          <WhatIs />
          <HowItWorks />
          <ToolSection ref={toolRef} />
          <Differentiation />
          <UseCases />
          <Examples ref={examplesRef} />
          <AITools ref={moreToolsRef} />
          <FAQ />
        </main>
        <Footer />
      </div>
    </StoreProvider>
  )
}

export default App
