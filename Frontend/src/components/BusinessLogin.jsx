//BusinessLogin.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./BusinessLogin.css";
import MitraLogo from "./MitraLogo";
import { API } from "../utils/api";

function BusinessLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      const res = await fetch(`${API}/api/business/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ server: data.message || "Invalid email or password" });
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("business", JSON.stringify(data.business));
      navigate("/dashboard");
    } catch (_) {
      setErrors({ server: "Unable to connect to the server." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bl-wrap">
      <div className="bl-card">
        <Link to="/" className="bl-logo">
          <MitraLogo size={36} />
          <span className="bl-logo-text">mitra</span>
        </Link>

        <div className="bl-badge">Business portal</div>
        <h2 className="bl-title">Sign in to your dashboard</h2>
        <p className="bl-sub">
          Manage your listing, availability, and bookings.
        </p>

        {errors.server && (
          <div className="bl-error-banner" role="alert">
            {errors.server}
          </div>
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
              <span className="bl-field-error" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          <div className="bl-field">
            <div className="bl-password-row">
              <label htmlFor="password">Password</label>
              <Link to="/forgot-password" className="bl-forgot">
                Forgot password?
              </Link>
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
              <span className="bl-field-error" role="alert">
                {errors.password}
              </span>
            )}
          </div>

          <button type="submit" className="bl-btn" disabled={loading}>
            {loading ? (
              <span className="bl-btn-loading">
                <span className="bl-spinner" />
                Signing in…
              </span>
            ) : (
              "Sign in to dashboard"
            )}
          </button>
        </form>

        <div className="bl-divider">
          <span>or</span>
        </div>
        <Link to="/business-register" className="bl-register-btn">
          Register a new business
        </Link>
        <p className="bl-resident-link">
          Not a business? <Link to="/login">Resident sign in →</Link>
        </p>
      </div>
    </div>
  );
}

export default BusinessLogin;
