import './Footer.css'

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__brand">
          <span className="footer__logo">LineStack</span>
          <span className="footer__tagline">
            Stack dialogue screenshots into a clean vertical story.
          </span>
        </div>

        <div className="footer__trust">
          Free · No Sign-Up · Runs Locally
        </div>

        <div className="footer__links">
          <a href="#" className="footer__link">Privacy</a>
          <a href="#" className="footer__link">Terms</a>
          <a href="#" className="footer__link">Contact</a>
        </div>

        <div className="footer__copyright">
          &copy; {new Date().getFullYear()} LineStack. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
