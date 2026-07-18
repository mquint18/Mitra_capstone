import { useState } from "react";
import "./BusinessLogin.css";

function BusinessLogin() {
  const [form, setForm]     = useState({ email: "", password: "" });
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
    if (!form.email.trim())               e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password)                   e.password = "Password is required";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/api/business/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ server: data.message || "Invalid email or password" });
        return;
      }

      // Persist token + business profile
      localStorage.setItem("token",    data.token);
      localStorage.setItem("business", JSON.stringify(data.business));

      // Go to dashboard
      window.location.href = "/dashboard";

    } catch (err) {
      setErrors({ server: "Unable to connect to the server." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bl-wrap">
      <div className="bl-card">

        {/* Logo */}
        <a href="/" className="bl-logo">
          <svg width="36" height="36" viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="10" r="7" fill="#EF9F27"/>
            <polygon points="2,16 16,3 30,16" fill="#3B6D11"/>
            <rect x="22" y="5"  width="4"  height="8"  rx="1" fill="#3B6D11"/>
            <rect x="9"  y="15" width="14" height="12" rx="2" fill="#639922"/>
            <rect x="13" y="20" width="6"  height="8"  rx="1" fill="#3B6D11"/>
            <rect x="10" y="17" width="3"  height="3"  rx="0.5" fill="#C0DD97"/>
            <rect x="19" y="17" width="3"  height="3"  rx="0.5" fill="#C0DD97"/>
            <rect x="9"  y="26" width="14" height="3"  rx="1" fill="#27500A"/>
            <ellipse cx="16" cy="30" rx="4" ry="1.5" fill="#97C459"/>
          </svg>
          <span className="bl-logo-text">mitra</span>
        </a>

        {/* Heading */}
        <div className="bl-badge">Business portal</div>
        <h2 className="bl-title">Sign in to your dashboard</h2>
        <p className="bl-sub">Manage your listing, availability, and bookings.</p>

        {/* Server error */}
        {errors.server && (
          <div className="bl-error-banner" role="alert">{errors.server}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          <div className="bl-field">
            <label htmlFor="email">Business email</label>
            <input
              id="email"
              type="email"
              placeholder="hello@yourbusiness.com"
              value={form.email}
              onChange={set("email")}
              className={errors.email ? "bl-input-error" : ""}
              autoComplete="email"
              autoFocus
            />
            {errors.email && (
              <span className="bl-field-error" role="alert">{errors.email}</span>
            )}
          </div>

          <div className="bl-field">
            <div className="bl-password-row">
              <label htmlFor="password">Password</label>
              <a href="/forgot-password" className="bl-forgot">Forgot password?</a>
            </div>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={set("password")}
              className={errors.password ? "bl-input-error" : ""}
              autoComplete="current-password"
            />
            {errors.password && (
              <span className="bl-field-error" role="alert">{errors.password}</span>
            )}
          </div>

          <button type="submit" className="bl-btn" disabled={loading}>
            {loading ? (
              <span className="bl-btn-loading">
                <span className="bl-spinner"/>
                Signing in…
              </span>
            ) : "Sign in to dashboard"}
          </button>

        </form>

        <div className="bl-divider"><span>or</span></div>

        <a href="/business/register" className="bl-register-btn">
          Register a new business
        </a>

        <p className="bl-resident-link">
          Not a business? <a href="/login">Resident sign in →</a>
        </p>

      </div>
    </div>
  );
}

export default BusinessLogin;
