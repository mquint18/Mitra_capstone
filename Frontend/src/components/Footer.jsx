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
          <p className="footer-desc">
            Mitra helps residents find trusted local businesses and book
            services — all in one place.
          </p>
        </div>

        {/* Navigation */}
        <div className="footer-col">
          <p className="footer-col-title">Explore</p>
          <Link to="/" className="footer-link">
            Home
          </Link>
          <Link to="/about" className="footer-link">
            About
          </Link>
          <Link to="/search" className="footer-link">
            Find a business
          </Link>
          <Link to="/ai-ask" className="footer-link">
            AI advisor
          </Link>
        </div>

        {/* Account */}
        <div className="footer-col">
          <p className="footer-col-title">Account</p>
          <Link to="/sign-up" className="footer-link">
            Resident sign up
          </Link>
          <Link to="/login" className="footer-link">
            Resident sign in
          </Link>
          <Link to="/business-register" className="footer-link">
            Register a business
          </Link>
          <Link to="/business/login" className="footer-link">
            Business sign in
          </Link>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <p className="footer-col-title">Contact</p>
          <a href="mailto:hello@mitra.app" className="footer-link">
            hello@mitra.app
          </a>
          <a href="tel:+15550001234" className="footer-link">
            (555) 000-1234
          </a>
          <p className="footer-link">123 Maple St, Maplewood NJ</p>
          <div className="footer-social">
            <a
              href="https://github.com/mquint18"
              target="_blank"
              rel="noreferrer"
              className="footer-social-link"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com"
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
