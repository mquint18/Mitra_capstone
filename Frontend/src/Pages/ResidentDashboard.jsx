// ResidentDashboard.jsx
import { useState, useEffect, useCallback } from "react";
import "./ResidentDashboard.css";
import AiQuery from "../components/AiQuery";
import BusinessSearch from "./BusinessSearch";

const API = import.meta.env.VITE_API_URL || "http://localhost:5001";

function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
}

// ── Helpers ──────────────────────────────────────────────
function statusClass(s) {
  return (
    {
      confirmed: "badge-confirmed",
      pending: "badge-pending",
      completed: "badge-completed",
      cancelled: "badge-cancelled",
    }[s] || ""
  );
}

function initials(first, last) {
  return `${(first || "?")[0]}${(last || "")[0]}`.toUpperCase();
}

// ── Sub-components ────────────────────────────────────────
function BookingCard({ booking, onCancel }) {
  const businessName =
    booking.businessId?.businessName ||
    booking.businessName ||
    "Unknown business";
  return (
    <div className="booking-card">
      <div className="booking-card-left">
        <p className="booking-business">{businessName}</p>
        <p className="booking-service">
          {booking.note || "Service appointment"}
        </p>
        <p className="booking-datetime">
          {booking.date} at {booking.time}
        </p>
      </div>
      <div className="booking-card-right">
        <span className={`badge ${statusClass(booking.status)}`}>
          {booking.status}
        </span>
        {(booking.status === "confirmed" || booking.status === "pending") && (
          <button className="btn-cancel" onClick={() => onCancel(booking._id)}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

function BusinessCard({ business, onBook }) {
  const name = business.businessName || business.name || "?";
  return (
    <div className="biz-card">
      <div className="biz-avatar">{name[0]}</div>
      <div className="biz-info">
        <p className="biz-name">{name}</p>
        <p className="biz-category">
          {business.businessType || business.category}
        </p>
        <div className="biz-keywords">
          {(business.keywords || []).slice(0, 2).map((k) => (
            <span key={k} className="keyword-pill">
              {k}
            </span>
          ))}
        </div>
      </div>
      <div className="biz-right">
        <button className="btn-book" onClick={() => onBook(business)}>
          Book
        </button>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────
export default function ResidentDashboard() {
  const [tab, setTab] = useState("home");
  const [bookings, setBookings] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Resident from localStorage — must be defined before profile state
  const stored = localStorage.getItem("resident");
  const resident = stored
    ? JSON.parse(stored)
    : {
        firstName: "",
        lastName: "",
        email: "",
        suburb: "",
        phone: "",
        address: "",
      };

  const [profile, setProfile] = useState({
    firstName: resident.firstName || "",
    lastName: resident.lastName || "",
    email: resident.email || "",
    phone: resident.phone || "",
    address: resident.address || "",
    suburb: resident.suburb || "",
  });

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  // ── Fetch resident bookings ──
  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/bookings/my`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (res.ok) setBookings(data.bookings || []);
    } catch (_) {
      console.error("Failed to load bookings");
    }
  }, []);

  // ── Fetch nearby businesses ──
  const fetchBusinesses = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/search?limit=6`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (res.ok) setBusinesses(data.businesses || []);
    } catch (_) {
      console.error("Failed to load businesses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
    fetchBusinesses();
  }, [fetchBookings, fetchBusinesses]);

  // ── Cancel booking ──
  async function cancelBooking(id) {
    try {
      const res = await fetch(`${API}/api/bookings/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ status: "cancelled" }),
      });
      if (res.ok) {
        setBookings((bs) =>
          bs.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b)),
        );
        showToast("Booking cancelled");
      }
    } catch (_) {
      showToast("Failed to cancel booking");
    }
  }

  // ── Save profile ──
  async function saveProfile() {
    try {
      const res = await fetch(`${API}/api/auth/profile`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem(
          "resident",
          JSON.stringify({ ...resident, ...profile }),
        );
        showToast("Profile saved ✓");
      } else {
        showToast(data.message || "Failed to save");
      }
    } catch (_) {
      showToast("Unable to connect to server");
    }
  }

  function handleBook(business) {
    showToast(
      `Booking request sent to ${business.businessName || business.name}`,
    );
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("resident");
    window.location.href = "/login";
  }

  const upcoming = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "pending",
  );
  const past = bookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled",
  );

  if (loading) {
    return (
      <div
        className="rd-wrap"
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <p style={{ color: "#888780", fontFamily: "system-ui" }}>Loading…</p>
      </div>
    );
  }

  return (
    <div className="rd-wrap">
      {toast && <div className="rd-toast">{toast}</div>}

      {/* Sidebar */}
      <aside className="rd-sidebar">
        <div className="rd-sidebar-logo">
          <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="10" r="7" fill="#EF9F27" />
            <polygon points="2,16 16,3 30,16" fill="#3B6D11" />
            <rect x="9" y="15" width="14" height="12" rx="2" fill="#639922" />
            <rect x="13" y="20" width="6" height="8" rx="1" fill="#3B6D11" />
            <rect x="9" y="26" width="14" height="3" rx="1" fill="#27500A" />
            <ellipse cx="16" cy="30" rx="4" ry="1.5" fill="#97C459" />
          </svg>
          <span className="rd-sidebar-logo-text">mitra</span>
        </div>

        <div className="rd-sidebar-user">
          <div className="rd-avatar">
            {initials(resident.firstName, resident.lastName)}
          </div>
          <div>
            <p className="rd-sidebar-name">
              {resident.firstName} {resident.lastName}
            </p>
            <p className="rd-sidebar-suburb">
              {resident.suburb || resident.address || "Resident"}
            </p>
          </div>
        </div>

        <nav className="rd-nav">
          {[
            { id: "home", icon: "⊞", label: "Home" },
            { id: "search", icon: "◎", label: "Find businesses" },
            {
              id: "bookings",
              icon: "◫",
              label: "My bookings",
              count: upcoming.length,
            },
            { id: "ai", icon: "✦", label: "Ask Mitra" },
            { id: "profile", icon: "⊙", label: "My profile" },
          ].map(({ id, icon, label, count }) => (
            <button
              key={id}
              className={`rd-nav-item ${tab === id ? "rd-nav-active" : ""}`}
              onClick={() => setTab(id)}
            >
              <span className="rd-nav-icon">{icon}</span>
              {label}
              {count > 0 && <span className="rd-nav-badge">{count}</span>}
            </button>
          ))}
        </nav>

        <button className="rd-logout" onClick={handleLogout}>
          Sign out
        </button>
      </aside>

      {/* Main */}
      <main className="rd-main">
        {/* ── Home ── */}
        {tab === "home" && (
          <div className="rd-section">
            <div className="rd-header">
              <div>
                <h1 className="rd-title">
                  Good morning, {resident.firstName} 👋
                </h1>
                <p className="rd-sub">
                  Here's what's happening in your neighbourhood.
                </p>
              </div>
            </div>

            <div className="rd-stats">
              <div className="rd-stat">
                <p className="rd-stat-value">{upcoming.length}</p>
                <p className="rd-stat-label">Upcoming bookings</p>
              </div>
              <div className="rd-stat">
                <p className="rd-stat-value">{past.length}</p>
                <p className="rd-stat-label">Completed services</p>
              </div>
              <div className="rd-stat">
                <p className="rd-stat-value">{businesses.length}</p>
                <p className="rd-stat-label">Local businesses</p>
              </div>
            </div>

            {upcoming.length > 0 && (
              <>
                <h2 className="rd-section-title">Upcoming bookings</h2>
                <div className="rd-bookings">
                  {upcoming.map((b) => (
                    <BookingCard
                      key={b._id}
                      booking={b}
                      onCancel={cancelBooking}
                    />
                  ))}
                </div>
              </>
            )}

            <h2 className="rd-section-title" style={{ marginTop: "1.75rem" }}>
              Businesses near you
            </h2>
            <div className="rd-biz-list">
              {businesses.slice(0, 3).map((b) => (
                <BusinessCard key={b._id} business={b} onBook={handleBook} />
              ))}
              {businesses.length === 0 && (
                <p style={{ color: "#888780", fontSize: "14px" }}>
                  No businesses found yet.
                </p>
              )}
            </div>
            <button className="rd-see-all" onClick={() => setTab("search")}>
              See all businesses →
            </button>
          </div>
        )}

        {/* ── Search ── */}
        {tab === "search" && <BusinessSearch />}

        {/* ── Bookings ── */}
        {tab === "bookings" && (
          <div className="rd-section">
            <h1 className="rd-title">My bookings</h1>
            <p className="rd-sub">
              Track and manage your service appointments.
            </p>

            {upcoming.length > 0 && (
              <>
                <h2 className="rd-section-title">Upcoming</h2>
                <div className="rd-bookings">
                  {upcoming.map((b) => (
                    <BookingCard
                      key={b._id}
                      booking={b}
                      onCancel={cancelBooking}
                    />
                  ))}
                </div>
              </>
            )}

            {past.length > 0 && (
              <>
                <h2
                  className="rd-section-title"
                  style={{ marginTop: "1.5rem" }}
                >
                  Past
                </h2>
                <div className="rd-bookings">
                  {past.map((b) => (
                    <BookingCard
                      key={b._id}
                      booking={b}
                      onCancel={cancelBooking}
                    />
                  ))}
                </div>
              </>
            )}

            {bookings.length === 0 && (
              <div className="rd-empty">
                <p>No bookings yet.</p>
                <button className="rd-link" onClick={() => setTab("search")}>
                  Find a business →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── AI Advisor ── */}
        {tab === "ai" && (
          <div className="rd-section">
            <div className="rd-ai-embed">
              <AiQuery />
            </div>
          </div>
        )}

        {/* ── Profile ── */}
        {tab === "profile" && (
          <div className="rd-section">
            <div className="rd-header">
              <div>
                <h1 className="rd-title">My profile</h1>
                <p className="rd-sub">
                  Update your contact details and address.
                </p>
              </div>
              <button className="btn-primary" onClick={saveProfile}>
                Save changes
              </button>
            </div>
            <div className="rd-profile-card">
              <div className="rd-profile-avatar">
                {initials(resident.firstName, resident.lastName)}
              </div>
              <div className="rd-profile-fields">
                <div className="rd-row2">
                  <div className="rd-field">
                    <label>First name</label>
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, firstName: e.target.value }))
                      }
                    />
                  </div>
                  <div className="rd-field">
                    <label>Last name</label>
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, lastName: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div className="rd-field">
                  <label>Email address</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, email: e.target.value }))
                    }
                  />
                </div>
                <div className="rd-field">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile((p) => ({
                        ...p,
                        phone: formatPhone(e.target.value),
                      }))
                    }
                    placeholder="(555) 000-0000"
                  />
                </div>
                <div className="rd-field">
                  <label>Address</label>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, address: e.target.value }))
                    }
                    placeholder="123 Maple St"
                  />
                </div>
                <div className="rd-field">
                  <label>Suburb</label>
                  <input
                    type="text"
                    value={profile.suburb}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, suburb: e.target.value }))
                    }
                    placeholder="Maplewood"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
