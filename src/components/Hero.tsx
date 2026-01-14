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
          100% Free · No Sign-Up · Runs Locally · Instant Export
        </div>

        <h1 className="hero__title">
          <span className="hero__title-brand">LineStack</span>
          <span className="hero__title-desc">Free Vertical Movie Screenshot Stitcher</span>
        </h1>

        <p className="hero__subtitle">
          Combine movie and TV show screenshots into a continuous vertical image
          while <strong>preserving subtitles</strong> and <strong>cinematic sequence</strong>.
        </p>

        <p className="hero__value">
          Perfect for sharing film moments on X (Twitter), Reddit, Instagram, and TikTok
          — keep the story flowing, keep the subtitles readable.
        </p>

        <div className="hero__cta">
          <button className="hero__cta-primary" onClick={onTryClick}>
            Start Stitching — It's Free
            <span className="hero__cta-hint">No account · No upload · Works offline</span>
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
            <span>Subtitle Preservation — keep every line readable</span>
          </div>
          <div className="hero__trust-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Vertical Continuity — scroll-friendly story format</span>
          </div>
          <div className="hero__trust-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Local Processing — your screenshots never leave your device</span>
          </div>
        </div>

        <p className="hero__privacy">
          LineStack runs entirely in your browser. No server uploads, no data collection.
        </p>
      </div>
    </section>
  )
}
