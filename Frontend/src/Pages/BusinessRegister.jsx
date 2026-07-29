// BusinessRegister.jsx
import { useState } from "react";
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
    if (!business.businessType) e.businessType = "Business type is required";
    if (!business.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(business.email))
      e.email = "Enter a valid email";
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
      const res = await fetch("http://localhost:5001/api/business/register", {
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
            {message ||
              "Your business has been registered. You can now sign in to your dashboard."}
          </p>
          <button
            className="br-btn"
            onClick={() => (window.location.href = "/business/login")}
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
        {/* Logo */}
        <a href="/" className="br-logo">
          <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="10" r="7" fill="#EF9F27" />
            <polygon points="2,16 16,3 30,16" fill="#3B6D11" />
            <rect x="9" y="15" width="14" height="12" rx="2" fill="#639922" />
            <rect x="13" y="20" width="6" height="8" rx="1" fill="#3B6D11" />
            <rect x="9" y="26" width="14" height="3" rx="1" fill="#27500A" />
            <ellipse cx="16" cy="30" rx="4" ry="1.5" fill="#97C459" />
          </svg>
          <span className="br-logo-text">mitra</span>
        </a>

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
          {/* ── Business info ── */}
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
              placeholder="Describe what your business offers in 2–3 sentences."
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
            <span className="br-hint">
              Separate keywords with commas — helps residents find you
            </span>
          </div>

          {/* ── Contact ── */}
          <p className="br-section-label">Contact & location</p>

          <div className="br-row2">
            <div className="br-field">
              <label>Email *</label>
              <input
                name="email"
                type="email"
                placeholder="hello@yourbusiness.com"
                value={business.email}
                onChange={set("email")}
                className={errors.email ? "br-input-error" : ""}
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
                onChange={set("phone")}
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

          {/* ── Account ── */}
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
          Already registered? <a href="/business/login">Sign in →</a>
        </p>
        <p className="br-signin-link">
          Not a business? <a href="/sign-up">Resident sign up →</a>
        </p>
      </div>
    </div>
  );
}

export default BusinessRegister;
