// SignupForm.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignupForm.css";
import MitraLogo from "./MitraLogo";
import { API } from "../utils/api";
import { isValidEmail, isValidName } from "../utils/format";

function SignupForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "resident",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  function set(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function setName(field) {
    return (e) => {
      const value = e.target.value;
      if (/^[a-zA-Z\s'-]*$/.test(value) && value.length <= 50) {
        setForm((prev) => ({ ...prev, [field]: value }));
      }
    };
  }

  function validate() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    else if (!isValidName(form.firstName))
      e.firstName = "Letters only, max 50 characters";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    else if (!isValidName(form.lastName))
      e.lastName = "Letters only, max 50 characters";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!isValidEmail(form.email)) e.email = "Enter a valid email address";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Minimum 8 characters";
    if (!form.confirmPassword)
      e.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
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
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ server: data.message || "Registration failed" });
        return;
      }
      setSuccess(true);
    } catch (_) {
      setErrors({ server: "Unable to connect to the server." });
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="signup-wrap">
        <div className="signup-card">
          <div className="success-icon">🏡</div>
          <h2 className="success-title">Welcome to Mitra!</h2>
          <p className="success-sub">
            Your account has been created. You can now log in and explore your
            neighborhood.
          </p>
          <button className="signup-btn" onClick={() => navigate("/login")}>
            Go to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-wrap">
      <div className="signup-card">
        <div className="signup-logo">
          <MitraLogo size={32} />
          <span className="signup-logo-text">mitra</span>
        </div>

        <h2 className="signup-title">Create your account</h2>
        <p className="signup-sub">Join your neighborhood on Mitra</p>

        <div className="role-toggle">
          <button
            type="button"
            className={`role-btn ${form.role === "resident" ? "active" : ""}`}
            onClick={() => setForm((p) => ({ ...p, role: "resident" }))}
          >
            I'm a resident
          </button>
          <button
            type="button"
            className={`role-btn ${form.role === "business" ? "active" : ""}`}
            onClick={() => navigate("/business-register")}
          >
            I'm a business
          </button>
        </div>

        {errors.server && <div className="error-banner">{errors.server}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field-row">
            <div className="field">
              <label htmlFor="firstName">First name</label>
              <input
                id="firstName"
                type="text"
                placeholder="Jane"
                value={form.firstName}
                onChange={setName("firstName")}
                className={errors.firstName ? "input-error" : ""}
              />
              {errors.firstName && (
                <span className="field-error">{errors.firstName}</span>
              )}
            </div>
            <div className="field">
              <label htmlFor="lastName">Last name</label>
              <input
                id="lastName"
                type="text"
                placeholder="Smith"
                value={form.lastName}
                onChange={setName("lastName")}
                className={errors.lastName ? "input-error" : ""}
              />
              {errors.lastName && (
                <span className="field-error">{errors.lastName}</span>
              )}
            </div>
          </div>

          <div className="field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="jane@example.com"
              value={form.email}
              onChange={set("email")}
              className={errors.email ? "input-error" : ""}
              autoComplete="email"
            />
            {errors.email && (
              <span className="field-error">{errors.email}</span>
            )}
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Minimum 8 characters"
              value={form.password}
              onChange={set("password")}
              className={errors.password ? "input-error" : ""}
              autoComplete="new-password"
            />
            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </div>

          <div className="field">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={set("confirmPassword")}
              className={errors.confirmPassword ? "input-error" : ""}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <span className="field-error">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="signin-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
        <p className="business-link">
          Sign up as a business <Link to="/business-register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default SignupForm;
