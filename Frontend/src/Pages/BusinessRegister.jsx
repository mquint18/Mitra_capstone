// BusinessRegister.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./BusinessRegister.css";

const BUSINESS_TYPES = [
  "Home services",
  "Health & wellness",
  "Food & catering",
  "Childcare & tutoring",
  "Pet services",
  "Professional services",
  "Fitness & sports",
  "Arts & crafts",
  "Other",
];

function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function validateEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}
function isValidBusinessName(name) {
  return name.trim().length > 0 && name.length <= 80;
}

function BusinessRegister() {
  const [business, setBusiness] = useState({
    businessName: "",
    businessType: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    website: "",
    phone: "",
    email: "",
    description: "",
    keywords: "",
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL || "http://localhost:5001";

  function set(field) {
    return (e) => {
      setBusiness((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
    };
  }

  function validate() {
    const e = {};
    if (!business.businessName.trim())
      e.businessName = "Business name is required";
    else if (business.businessName.length > 80)
      e.businessName = "Maximum 80 characters";
    if (!business.businessType) e.businessType = "Business type is required";
    if (!business.email.trim()) e.email = "Email is required";
    else if (!validateEmail(business.email))
      e.email = "Enter a valid email address";

    if (!business.phone.trim()) e.phone = "Phone is required";
    if (!business.username.trim()) e.username = "Username is required";
    if (!business.password) e.password = "Password is required";
    else if (business.password.length < 8) e.password = "Minimum 8 characters";
    return e;
  }

  async function registerBusiness(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/business/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: business.businessName,
          businessType: business.businessType,
          address: {
            street: business.street,
            city: business.city,
            state: business.state,
            zip: business.zip,
          },
          website: business.website,
          phone: business.phone,
          email: business.email,
          description: business.description,
          keywords: business.keywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean),
          username: business.username,
          password: business.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ server: data.message || "Registration failed" });
        return;
      }
      setSuccess(true);
      setMessage(data.message);
    } catch (_) {
      setErrors({ server: "Unable to connect to the server." });
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="br-wrap">
        <div className="br-card">
          <div className="br-success-icon">🏪</div>
          <h2 className="br-success-title">You're on Mitra!</h2>
          <p className="br-success-sub">
            {message || "Your business has been registered."}
          </p>
          <button
            className="br-btn"
            onClick={() => navigate("/business/login")}
          >
            Go to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="br-wrap">
      <div className="br-card">
        <Link to="/" className="br-logo">
          <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="10" r="7" fill="#EF9F27" />
            <polygon points="2,16 16,3 30,16" fill="#3B6D11" />
            <rect x="9" y="15" width="14" height="12" rx="2" fill="#639922" />
            <rect x="13" y="20" width="6" height="8" rx="1" fill="#3B6D11" />
            <rect x="9" y="26" width="14" height="3" rx="1" fill="#27500A" />
            <ellipse cx="16" cy="30" rx="4" ry="1.5" fill="#97C459" />
          </svg>
          <span className="br-logo-text">mitra</span>
        </Link>

        <div className="br-badge">Business portal</div>
        <h2 className="br-title">Register your business</h2>
        <p className="br-sub">
          Join Mitra and connect with residents in your neighbourhood.
        </p>

        {errors.server && (
          <div className="br-error-banner" role="alert">
            {errors.server}
          </div>
        )}

        <form onSubmit={registerBusiness} noValidate>
          <p className="br-section-label">Business details</p>

          <div className="br-field">
            <label>Business name *</label>
            <input
              name="businessName"
              type="text"
              placeholder="e.g. Green Thumb Landscaping"
              value={business.businessName}
              onChange={set("businessName")}
              className={errors.businessName ? "br-input-error" : ""}
            />
            {errors.businessName && (
              <span className="br-field-error">{errors.businessName}</span>
            )}
          </div>

          <div className="br-field">
            <label>Business type *</label>
            <select
              name="businessType"
              value={business.businessType}
              onChange={set("businessType")}
              className={errors.businessType ? "br-input-error" : ""}
            >
              <option value="">Select a type</option>
              {BUSINESS_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            {errors.businessType && (
              <span className="br-field-error">{errors.businessType}</span>
            )}
          </div>

          <div className="br-field">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Describe what your business offers."
              value={business.description}
              onChange={set("description")}
              rows={3}
            />
          </div>

          <div className="br-field">
            <label>Keywords</label>
            <input
              name="keywords"
              type="text"
              placeholder="lawn care, landscaping, garden design"
              value={business.keywords}
              onChange={set("keywords")}
            />
            <span className="br-hint">Separate keywords with commas</span>
          </div>

          <p className="br-section-label">Contact & location</p>

          <div className="br-row2">
            <div className="br-field">
              <label>Email *</label>
              <input
                name="email"
                type="email"
                placeholder="hello@yourbusiness.com"
                value={business.email}
                onChange={(e) => {
                  setBusiness((prev) => ({ ...prev, email: e.target.value }));
                  if (errors.email && validateEmail(e.target.value)) {
                    setErrors((prev) => ({ ...prev, email: null }));
                  }
                }}
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && (
                <span className="br-field-error">{errors.email}</span>
              )}
            </div>
            <div className="br-field">
              <label>Phone *</label>
              <input
                name="phone"
                type="tel"
                placeholder="(555) 000-0000"
                value={business.phone}
                onChange={(e) =>
                  setBusiness((prev) => ({
                    ...prev,
                    phone: formatPhone(e.target.value),
                  }))
                }
                className={errors.phone ? "br-input-error" : ""}
              />
              {errors.phone && (
                <span className="br-field-error">{errors.phone}</span>
              )}
            </div>
          </div>

          <div className="br-field">
            <label>Street address</label>
            <input
              name="street"
              type="text"
              placeholder="123 Maple St"
              value={business.street}
              onChange={set("street")}
            />
          </div>

          <div className="br-row3">
            <div className="br-field">
              <label>City</label>
              <input
                name="city"
                type="text"
                placeholder="Maplewood"
                value={business.city}
                onChange={set("city")}
              />
            </div>
            <div className="br-field">
              <label>State</label>
              <input
                name="state"
                type="text"
                placeholder="NJ"
                value={business.state}
                onChange={set("state")}
              />
            </div>
            <div className="br-field">
              <label>Zip</label>
              <input
                name="zip"
                type="text"
                placeholder="07001"
                value={business.zip}
                onChange={set("zip")}
              />
            </div>
          </div>

          <div className="br-field">
            <label>Website</label>
            <input
              name="website"
              type="text"
              placeholder="https://yourwebsite.com"
              value={business.website}
              onChange={set("website")}
            />
          </div>

          <p className="br-section-label">Account credentials</p>

          <div className="br-field">
            <label>Username *</label>
            <input
              name="username"
              type="text"
              placeholder="Choose a username"
              value={business.username}
              onChange={set("username")}
              autoComplete="username"
              className={errors.username ? "br-input-error" : ""}
            />
            {errors.username && (
              <span className="br-field-error">{errors.username}</span>
            )}
          </div>

          <div className="br-field">
            <label>Password *</label>
            <input
              name="password"
              type="password"
              placeholder="Minimum 8 characters"
              value={business.password}
              onChange={set("password")}
              autoComplete="new-password"
              className={errors.password ? "br-input-error" : ""}
            />
            {errors.password && (
              <span className="br-field-error">{errors.password}</span>
            )}
          </div>

          <button type="submit" className="br-btn" disabled={loading}>
            {loading ? "Registering…" : "Register business"}
          </button>
        </form>

        <p className="br-signin-link">
          Already registered? <Link to="/business/login">Sign in →</Link>
        </p>
        <p className="br-signin-link">
          Not a business? <Link to="/sign-up">Resident sign up →</Link>
        </p>
      </div>
    </div>
  );
}

export default BusinessRegister;
