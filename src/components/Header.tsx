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
            <img src="/logo.svg" alt="LineStack" className="header__logo-icon" />
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
