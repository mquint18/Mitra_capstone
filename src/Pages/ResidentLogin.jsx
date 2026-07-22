// ResidentLogin.jsx
import { useState } from "react";
import "./ResidentLogin.css";

function ResidentLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function set(field) {
    return (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
    };
  }

  function validate() {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ server: data.message || "Invalid email or password" });
        return;
      }

      // Persist token + resident profile
      localStorage.setItem("token", data.token);
      localStorage.setItem("resident", JSON.stringify(data.user));

      // After successful login, redirect to:
      window.location.href = "/resident-dashboard";
    } catch (err) {
      setErrors({ server: "Unable to connect to the server." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rl-wrap">
      <div className="rl-card">
        {/* Logo */}
        <a href="/" className="rl-logo">
          <svg width="36" height="36" viewBox="0 0 32 32" aria-hidden="true">
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
          <span className="rl-logo-text">mitra</span>
        </a>

        {/* Badge */}
        <div className="rl-badge">Resident portal</div>
        <h2 className="rl-title">Welcome back</h2>
        <p className="rl-sub">
          Sign in to find local businesses and book services.
        </p>

        {/* Server error */}
        {errors.server && (
          <div className="rl-error-banner" role="alert">
            {errors.server}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="rl-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="jane@example.com"
              value={form.email}
              onChange={set("email")}
              className={errors.email ? "rl-input-error" : ""}
              autoComplete="email"
              autoFocus
            />
            {errors.email && (
              <span className="rl-field-error" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          <div className="rl-field">
            <div className="rl-password-row">
              <label htmlFor="password">Password</label>
              <a href="/forgot-password" className="rl-forgot">
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={set("password")}
              className={errors.password ? "rl-input-error" : ""}
              autoComplete="current-password"
            />
            {errors.password && (
              <span className="rl-field-error" role="alert">
                {errors.password}
              </span>
            )}
          </div>

          <button type="submit" className="rl-btn" disabled={loading}>
            {loading ? (
              <span className="rl-btn-loading">
                <span className="rl-spinner" />
                Signing in…
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="rl-divider">
          <span>or</span>
        </div>

        <a href="/signup" className="rl-signup-btn">
          Create a resident account
        </a>

        <p className="rl-business-link">
          Are you a business? <a href="/business/login">Business sign in →</a>
        </p>
      </div>
    </div>
  );
}

export default ResidentLogin;
