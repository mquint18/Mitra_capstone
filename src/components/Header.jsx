import { useState } from "react";
import "./Header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Read user from localStorage — works for both resident and business
  const residentRaw = localStorage.getItem("resident");
  const businessRaw = localStorage.getItem("business");
  const token = localStorage.getItem("token");

  const user = token
    ? residentRaw
      ? JSON.parse(residentRaw)
      : businessRaw
        ? JSON.parse(businessRaw)
        : null
    : null;

  const isLoggedIn = !!user;
  const isBusiness = !!businessRaw && !!token;
  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : user?.businessName || "Account";
  const initials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] || ""}`.toUpperCase()
    : (user?.businessName?.[0] || "?").toUpperCase();
  const dashboardUrl = isBusiness ? "/dashboard" : "/resident-dashboard";

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("resident");
    localStorage.removeItem("business");
    window.location.href = "/login";
  }

  return (
    <header className="header">
      <div className="header-inner">
        {/* Logo */}
        <a href="/" className="header-logo">
          <svg width="40" height="40" viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="10" r="7" fill="#EF9F27" />
            <polygon points="2,16 16,3 30,16" fill="#3B6D11" />
            <rect x="22" y="5" width="4" height="8" rx="1" fill="#3B6D11" />
            <rect x="9" y="15" width="14" height="12" rx="2" fill="#639922" />
            <rect x="13" y="20" width="6" height="8" rx="1" fill="#3B6D11" />
            <rect x="10" y="17" width="3" height="3" rx="0.5" fill="#C0DD97" />
            <rect x="19" y="17" width="3" height="3" rx="0.5" fill="#C0DD97" />
            <rect x="9" y="26" width="14" height="3" rx="1" fill="#27500A" />
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

        {/* Auth area */}
        <div className="header-actions">
          {isLoggedIn ? (
            <div className="avatar-wrap">
              <button
                className="avatar-btn"
                onClick={() => setDropdownOpen((o) => !o)}
                aria-label="Account menu"
                aria-expanded={dropdownOpen}
              >
                <div className="avatar">{initials}</div>
                <span className="avatar-name">{displayName}</span>
                <svg
                  className={`avatar-caret ${dropdownOpen ? "open" : ""}`}
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  aria-hidden="true"
                >
                  <path
                    d="M2 4l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="dropdown-backdrop"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="dropdown">
                    <div className="dropdown-header">
                      <div className="dropdown-avatar">{initials}</div>
                      <div>
                        <p className="dropdown-name">{displayName}</p>
                        <p className="dropdown-email">{user?.email}</p>
                        <span className="dropdown-role">
                          {isBusiness ? "business" : "resident"}
                        </span>
                      </div>
                    </div>

                    <div className="dropdown-divider" />

                    <a
                      href={dashboardUrl}
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span className="dropdown-icon">⊞</span> Dashboard
                    </a>
                    <a
                      href="/profile"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span className="dropdown-icon">👤</span> My profile
                    </a>
                    {!isBusiness && (
                      <a
                        href="/search"
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <span className="dropdown-icon">◎</span> Find a business
                      </a>
                    )}

                    <div className="dropdown-divider" />

                    <button
                      className="dropdown-item dropdown-logout"
                      onClick={handleLogout}
                    >
                      <span className="dropdown-icon">🚪</span> Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <a href="/login" className="btn-ghost">
                Sign in
              </a>
              <a href="/sign-up" className="btn-join">
                Join Free
              </a>
            </>
          )}
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
            href="/ai-ask"
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
            {isLoggedIn ? (
              <>
                <a href={dashboardUrl} className="btn-ghost-mobile">
                  Dashboard
                </a>
                <button className="btn-primary-mobile" onClick={handleLogout}>
                  Sign out
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="btn-ghost-mobile">
                  Sign in
                </a>
                <a href="/sign-up" className="btn-primary-mobile">
                  Join free
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
