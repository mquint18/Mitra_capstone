//Header.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

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
    navigate("/login");
  }

  return (
    <header className="header">
      <div className="header-inner">
        {/* Logo */}
        <Link to="/" className="header-logo">
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
        </Link>

        {/* Desktop nav */}
        <nav className="header-nav" aria-label="Main navigation">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/search" className="nav-link">
            Find a business
          </Link>
          <Link to="/ai-ask" className="nav-link">
            Ask Mitra
          </Link>
          <Link to="/about" className="nav-link">
            About
          </Link>
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

                    <Link
                      to={dashboardUrl}
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span className="dropdown-icon">⊞</span> Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span className="dropdown-icon">👤</span> My profile
                    </Link>
                    {!isBusiness && (
                      <Link
                        to="/search"
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <span className="dropdown-icon">◎</span> Find a business
                      </Link>
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
              <Link to="/login" className="btn-ghost">
                Sign in
              </Link>
              <Link to="/sign-up" className="btn-join">
                Join Free
              </Link>
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
          <Link
            to="/"
            className="mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/search"
            className="mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            Find a business
          </Link>
          <Link
            to="/ai-ask"
            className="mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            Ask Mitra
          </Link>
          <Link
            to="/about"
            className="mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>

          <div className="mobile-actions">
            {isLoggedIn ? (
              <>
                <Link
                  to={dashboardUrl}
                  className="btn-ghost-mobile"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button className="btn-primary-mobile" onClick={handleLogout}>
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn-ghost-mobile"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/sign-up"
                  className="btn-primary-mobile"
                  onClick={() => setMenuOpen(false)}
                >
                  Join free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
