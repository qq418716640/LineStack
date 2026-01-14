import './HowItWorks.css'

export function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Upload dialogue screenshots',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      ),
    },
    {
      number: '2',
      title: 'Mark keyframes & adjust subtitle keep bar',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <path d="M9 21V9" />
        </svg>
      ),
    },
    {
      number: '3',
      title: 'Export JPG instantly (720 or 1080)',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      ),
    },
  ]

  return (
    <section className="how-it-works">
      <div className="how-it-works__container">
        <h2 className="how-it-works__title">How It Works</h2>
        <div className="how-it-works__steps">
          {steps.map((step) => (
            <div key={step.number} className="how-it-works__step">
              <div className="how-it-works__step-icon">{step.icon}</div>
              <div className="how-it-works__step-number">{step.number}</div>
              <p className="how-it-works__step-title">{step.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
