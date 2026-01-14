import './UseCases.css'

const useCases = [
  {
    role: 'Film Reviewers',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
        <line x1="7" y1="2" x2="7" y2="22" />
        <line x1="17" y1="2" x2="17" y2="22" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <line x1="2" y1="7" x2="7" y2="7" />
        <line x1="2" y1="17" x2="7" y2="17" />
        <line x1="17" y1="17" x2="22" y2="17" />
        <line x1="17" y1="7" x2="22" y2="7" />
      </svg>
    ),
    whyVertical: 'Capture key dialogue moments in sequence to illustrate story beats',
    whySubtitles: 'Quote exact lines when analyzing screenplay and character development',
  },
  {
    role: 'Movie Lovers',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    whyVertical: 'Share favorite scenes as scrollable story posts',
    whySubtitles: 'Preserve memorable quotes that made you laugh or cry',
  },
  {
    role: 'Social Media Creators',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
      </svg>
    ),
    whyVertical: 'Create thumb-stopping content optimized for mobile feeds',
    whySubtitles: 'Drive engagement with relatable dialogue that resonates',
  },
  {
    role: 'Language Learners',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    whyVertical: 'Document conversation flow for study reference',
    whySubtitles: 'Keep original language text visible for vocabulary practice',
  },
]

export function UseCases() {
  return (
    <section className="use-cases">
      <div className="use-cases__container">
        <h2 className="use-cases__title">Who Uses LineStack?</h2>
        <p className="use-cases__subtitle">
          A vertical movie screenshot stitcher serves anyone who wants to share cinematic moments
          while preserving the story flow and readable subtitles.
        </p>

        <div className="use-cases__grid">
          {useCases.map((useCase) => (
            <div key={useCase.role} className="use-case-card">
              <div className="use-case-card__icon">{useCase.icon}</div>
              <h3 className="use-case-card__role">{useCase.role}</h3>
              <div className="use-case-card__reasons">
                <div className="use-case-card__reason">
                  <span className="use-case-card__reason-label">Why vertical:</span>
                  <span className="use-case-card__reason-text">{useCase.whyVertical}</span>
                </div>
                <div className="use-case-card__reason">
                  <span className="use-case-card__reason-label">Why subtitles:</span>
                  <span className="use-case-card__reason-text">{useCase.whySubtitles}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
