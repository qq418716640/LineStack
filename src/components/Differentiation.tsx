import './Differentiation.css'

export function Differentiation() {
  return (
    <section className="differentiation">
      <div className="differentiation__container">
        <h2 className="differentiation__title">What Makes LineStack Different?</h2>

        <div className="differentiation__grid">
          <div className="differentiation__card differentiation__card--not">
            <h3 className="differentiation__card-title">
              <span className="differentiation__icon differentiation__icon--not">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </span>
              LineStack is NOT
            </h3>
            <ul className="differentiation__list">
              <li>A chat screenshot stitcher for messaging apps</li>
              <li>A meme generator with text overlays</li>
              <li>A generic photo collage or grid maker</li>
              <li>A social media post designer</li>
            </ul>
          </div>

          <div className="differentiation__card differentiation__card--is">
            <h3 className="differentiation__card-title">
              <span className="differentiation__icon differentiation__icon--is">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </span>
              LineStack IS
            </h3>
            <ul className="differentiation__list">
              <li>A vertical movie screenshot stitcher</li>
              <li>Built for cinematic linear storytelling</li>
              <li>Focused on subtitle preservation</li>
              <li>Designed for sequence continuity</li>
            </ul>
          </div>
        </div>

        <p className="differentiation__summary">
          If you're looking to create beautiful vertical compilations of movie or TV show moments
          with readable subtitles, LineStack is the specialized tool built exactly for that purpose.
        </p>
      </div>
    </section>
  )
}
