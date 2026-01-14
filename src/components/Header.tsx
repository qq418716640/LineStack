import './Header.css'

interface Props {
  onTryClick: () => void
  onExamplesClick: () => void
  onGoProClick: () => void
}

export function Header({ onTryClick, onExamplesClick, onGoProClick }: Props) {
  return (
    <header className="header">
      <div className="header__container">
        <div className="header__brand">
          <div className="header__logo">
            <span className="header__logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="3" y1="15" x2="21" y2="15" />
              </svg>
            </span>
            <span className="header__logo-text">LineStack</span>
          </div>
          <span className="header__slogan">Vertical Movie Screenshot Stitcher</span>
        </div>
        <nav className="header__nav">
          <button className="header__nav-link header__nav-link--primary" onClick={onTryClick}>
            Try It Free
          </button>
          <button className="header__nav-link" onClick={onExamplesClick}>
            Examples
          </button>
          <button className="header__nav-link" onClick={onGoProClick}>
            Go Pro
          </button>
        </nav>
      </div>
    </header>
  )
}
