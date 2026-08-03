// Footer.jsx
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Logo + tagline */}
        <div className="footer-brand">
          <svg width="20" height="20" viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="10" r="7" fill="#EF9F27" />
            <polygon points="2,16 16,3 30,16" fill="#3B6D11" />
            <rect x="9" y="15" width="14" height="12" rx="2" fill="#639922" />
            <rect x="13" y="20" width="6" height="8" rx="1" fill="#3B6D11" />
            <rect x="9" y="26" width="14" height="3" rx="1" fill="#27500A" />
            <ellipse cx="16" cy="30" rx="4" ry="1.5" fill="#97C459" />
          </svg>
          <span className="footer-logo-text">mitra</span>
          <span className="footer-tagline">Your neighborhood, connected.</span>
        </div>

        {/* Contact */}
        <div className="footer-contact">
          <a href="mailto:hello@mitra.app" className="footer-link">
            hello@mitra.app
          </a>
          <a
            href="https://github.com/mquint18/Mitra_capstone.git"
            target="_blank"
            rel="noreferrer"
            className="footer-link"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/michael-quint-516119415"
            target="_blank"
            rel="noreferrer"
            className="footer-link"
          >
            LinkedIn
          </a>
        </div>

        {/* Copyright + legal */}
        <div className="footer-legal">
          <span>© 2026 Michael Quint</span>
          <Link to="/privacy" className="footer-link">
            Privacy
          </Link>
          <Link to="/terms" className="footer-link">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
