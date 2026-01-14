import { useRef } from 'react'
import { StoreProvider } from './store/StoreContext'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { ToolSection } from './components/ToolSection'
import { Examples } from './components/Examples'
import { AITools } from './components/AITools'
import { FAQ } from './components/FAQ'
import { GoPro } from './components/GoPro'
import { Footer } from './components/Footer'
import './App.css'

function App() {
  const toolRef = useRef<HTMLElement>(null)
  const examplesRef = useRef<HTMLElement>(null)
  const goProRef = useRef<HTMLElement>(null)

  const scrollToTool = () => {
    toolRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToExamples = () => {
    examplesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToGoPro = () => {
    goProRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <StoreProvider>
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
