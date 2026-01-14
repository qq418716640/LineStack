import './Footer.css'

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__brand">
          <span className="footer__logo">LineStack</span>
          <span className="footer__slogan">Vertical Movie Screenshot Stitcher</span>
        </div>

        <p className="footer__summary">
          LineStack helps you stitch movie and TV show screenshots into vertical story images
          with preserved subtitles — free, private, and built for cinematic storytelling.
        </p>

        <div className="footer__trust">
          Free Forever · No Sign-Up · Local Processing · Subtitle Preservation
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
