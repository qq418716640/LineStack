import './Hero.css'

interface Props {
  onTryClick: () => void
  onExamplesClick: () => void
}

export function Hero({ onTryClick, onExamplesClick }: Props) {
  return (
    <section className="hero">
      <div className="hero__container">
        <div className="hero__badge">
          100% Free · No Sign-Up Required · Instant Export · Runs Locally
        </div>

        <h1 className="hero__title">
          LineStack — Free Dialogue Screenshot Stitcher
        </h1>

        <p className="hero__subtitle">
          Turn TV & movie dialogue screenshots into a clean vertical story image
          — perfect for X (Twitter), Reddit, Instagram, and TikTok.
        </p>

        <p className="hero__slogan">
          Stack dialogue screenshots into a clean vertical story.
        </p>

        <div className="hero__cta">
          <button className="hero__cta-primary" onClick={onTryClick}>
            Try LineStack
            <span className="hero__cta-hint">No account · No upload · Start instantly</span>
          </button>
          <button className="hero__cta-secondary" onClick={onExamplesClick}>
            See Examples
          </button>
        </div>

        <div className="hero__trust">
          <div className="hero__trust-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Completely Free — no hidden limits, no watermark traps</span>
          </div>
          <div className="hero__trust-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>No Sign-Up Needed — open and use immediately</span>
          </div>
          <div className="hero__trust-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Local Processing — your screenshots stay on your device</span>
          </div>
        </div>

        <p className="hero__privacy">
          LineStack works entirely in your browser. Your images are never uploaded to any server.
        </p>
      </div>
    </section>
  )
}
