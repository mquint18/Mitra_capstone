// Footer.jsx
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">
            <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
              <circle cx="16" cy="10" r="7" fill="#EF9F27" />
              <polygon points="2,16 16,3 30,16" fill="#3B6D11" />
              <rect x="9" y="15" width="14" height="12" rx="2" fill="#639922" />
              <rect x="13" y="20" width="6" height="8" rx="1" fill="#3B6D11" />
              <rect x="9" y="26" width="14" height="3" rx="1" fill="#27500A" />
              <ellipse cx="16" cy="30" rx="4" ry="1.5" fill="#97C459" />
            </svg>
            <span className="footer-logo-text">mitra</span>
          </div>
          <p className="footer-tagline">Your neighborhood, connected.</p>
        </div>

        {/* Navigation */}
        <div className="footer-col">
          <p className="footer-col-title">Explore</p>

          <Link to="/about" className="footer-link">
            About
          </Link>

          <Link to="/ai-ask" className="footer-link">
            Ask Mitra
          </Link>
        </div>

        {/* Account */}
        <div className="footer-col">
          <p className="footer-col-title">Account</p>
          <Link to="/sign-up" className="footer-link">
            Create account
          </Link>

          <Link to="/business-register" className="footer-link">
            Register a business
          </Link>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <p className="footer-col-title">Contact</p>
          <a href="mailto:hello@mitra.app" className="footer-link">
            hello@mitra.app
          </a>

          <div className="footer-social">
            <a
              href="https://github.com/mquint18/Mitra_capstone.git"
              target="_blank"
              rel="noreferrer"
              className="footer-social-link"
            >
              GitHub
            </a>
            <a
              href="www.linkedin.com/in/michael-quint-516119415"
              target="_blank"
              rel="noreferrer"
              className="footer-social-link"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p>© 2026 Michael Quint · Mitra</p>
        <div className="footer-bottom-links">
          <Link to="/privacy" className="footer-bottom-link">
            Privacy
          </Link>
          <Link to="/terms" className="footer-bottom-link">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
