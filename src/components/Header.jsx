import { useState } from "react";
import "./Header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-inner">
        {/* Logo */}
        <a href="/" className="header-logo">
          <svg width="40" height="40" viewBox="0 0 32 32" aria-hidden="true">
            {/* Sun */}
            <circle cx="16" cy="10" r="7" fill="#EF9F27" />
            {/* Roof */}
            <polygon points="2,16 16,3 30,16" fill="#3B6D11" />
            {/* Chimney */}
            <rect x="22" y="5" width="4" height="8" rx="1" fill="#3B6D11" />
            {/* House body */}
            <rect x="9" y="15" width="14" height="12" rx="2" fill="#639922" />
            {/* Door */}
            <rect x="13" y="20" width="6" height="8" rx="1" fill="#3B6D11" />
            {/* Windows */}
            <rect x="10" y="17" width="3" height="3" rx="0.5" fill="#C0DD97" />
            <rect x="19" y="17" width="3" height="3" rx="0.5" fill="#C0DD97" />
            {/* Doorstep */}
            <rect x="9" y="26" width="14" height="3" rx="1" fill="#27500A" />
            {/* Path stones */}
            <ellipse cx="16" cy="30" rx="4" ry="1.5" fill="#97C459" />
          </svg>
          <span className="header-logo-text">mitra</span>
        </a>

        {/* Desktop nav */}
        <nav className="header-nav" aria-label="Main navigation">
          <a href="/" className="nav-link">
            Home
          </a>
          <a href="/search" className="nav-link">
            Find a business
          </a>
          <a href="/ai-ask" className="nav-link">
            AI Advisor
          </a>
          <a href="/about" className="nav-link">
            About
          </a>
        </nav>

        {/* Auth buttons */}
        <div className="header-actions">
          <a href="/login" className="btn-ghost">
            Sign in
          </a>
          <a href="/sign-up" className="btn-join">
            Join Free
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className={`ham-line ${menuOpen ? "open" : ""}`} />
          <span className={`ham-line ${menuOpen ? "open" : ""}`} />
          <span className={`ham-line ${menuOpen ? "open" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <a
            href="/"
            className="mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </a>
          <a
            href="/search"
            className="mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            Find a business
          </a>
          <a
            href="/ai"
            className="mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            AI advisor
          </a>
          <a
            href="/about"
            className="mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            About
          </a>
          <div className="mobile-actions">
            <a href="/login" className="btn-ghost-mobile">
              Sign in
            </a>
            <a href="/signup" className="btn-primary-mobile">
              Join free
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
