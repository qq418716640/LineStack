import { useState } from 'react'
import { getAssetUrl } from '../utils/assets'
import './Header.css'

interface Props {
  onTryClick: () => void
  onExamplesClick: () => void
  onMoreToolsClick: () => void
}

export function Header({ onTryClick, onExamplesClick, onMoreToolsClick }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleMenuClick = (callback: () => void) => {
    setMenuOpen(false)
    callback()
  }

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__brand">
          <div className="header__logo">
            <img src={getAssetUrl('logo.svg')} alt="LineStack" className="header__logo-icon" />
            <span className="header__logo-text">LineStack</span>
          </div>
          <span className="header__slogan">Vertical Movie Screenshot Stitcher</span>
        </div>

        {/* Desktop nav */}
        <nav className="header__nav header__nav--desktop">
          <button className="header__nav-link header__nav-link--primary" onClick={onTryClick}>
            Try It Free
          </button>
          <button className="header__nav-link" onClick={onExamplesClick}>
            Examples
          </button>
          <button className="header__nav-link" onClick={onMoreToolsClick}>
            More Tools
          </button>
        </nav>

        {/* Mobile nav */}
        <div className="header__mobile-nav">
          <button className="header__nav-link header__nav-link--primary" onClick={onTryClick}>
            Try It Free
          </button>
          <button
            className={`header__hamburger ${menuOpen ? 'header__hamburger--open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="header__dropdown">
            <button className="header__dropdown-link" onClick={() => handleMenuClick(onExamplesClick)}>
              Examples
            </button>
            <button className="header__dropdown-link" onClick={() => handleMenuClick(onMoreToolsClick)}>
              More Tools
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
