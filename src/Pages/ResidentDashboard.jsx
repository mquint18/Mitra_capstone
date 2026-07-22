// ResidentDashboard.jsx
import { useState } from "react";
import "./ResidentDashboard.css";
import AiQuery from "../components/AiQuery";
import BusinessSearch from "./BusinessSearch";

// ── Mock data — replace with real API calls ──────────────
const mockResident = {
  firstName: "Jane",
  lastName: "Smith",
  email: "jane@example.com",
  suburb: "Maplewood",
  phone: "(555) 234-5678",
};

const mockBookings = [
  {
    id: 1,
    business: "Green Thumb Landscaping",
    service: "Lawn mowing",
    date: "2026-07-24",
    time: "9:00 AM",
    status: "confirmed",
  },
  {
    id: 2,
    business: "Pawsome Pet Services",
    service: "Dog walking",
    date: "2026-07-26",
    time: "10:00 AM",
    status: "pending",
  },
  {
    id: 3,
    business: "Clean Home Co.",
    service: "House cleaning",
    date: "2026-07-10",
    time: "1:00 PM",
    status: "completed",
  },
  {
    id: 4,
    business: "Fix-It Plumbing",
    service: "Pipe inspection",
    date: "2026-07-05",
    time: "2:00 PM",
    status: "completed",
  },
];

const mockBusinesses = [
  {
    id: 1,
    name: "Green Thumb Landscaping",
    category: "Home services",
    keywords: ["lawn care", "landscaping", "garden"],
    rating: 4.9,
    reviews: 34,
  },
  {
    id: 2,
    name: "Pawsome Pet Services",
    category: "Pet services",
    keywords: ["dog walking", "pet sitting", "grooming"],
    rating: 5.0,
    reviews: 18,
  },
  {
    id: 3,
    name: "Sparkle Cleaning Co.",
    category: "Home services",
    keywords: ["cleaning", "housekeeping", "windows"],
    rating: 4.7,
    reviews: 52,
  },
  {
    id: 4,
    name: "Fix-It Plumbing",
    category: "Home services",
    keywords: ["plumbing", "pipes", "leaks"],
    rating: 4.8,
    reviews: 29,
  },
  {
    id: 5,
    name: "Bright Minds Tutoring",
    category: "Education",
    keywords: ["tutoring", "maths", "english"],
    rating: 5.0,
    reviews: 11,
  },
  {
    id: 6,
    name: "Fit Life Personal Training",
    category: "Fitness",
    keywords: ["personal training", "fitness", "gym"],
    rating: 4.6,
    reviews: 23,
  },
];

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
  return `${first[0]}${last[0]}`.toUpperCase();
}

// ── Sub-components ────────────────────────────────────────
function BookingCard({ booking, onCancel }) {
  return (
    <div className="booking-card">
      <div className="booking-card-left">
        <p className="booking-business">{booking.business}</p>
        <p className="booking-service">{booking.service}</p>
        <p className="booking-datetime">
          {booking.date} at {booking.time}
        </p>
      </div>
      <div className="booking-card-right">
        <span className={`badge ${statusClass(booking.status)}`}>
          {booking.status}
        </span>
        {(booking.status === "confirmed" || booking.status === "pending") && (
          <button className="btn-cancel" onClick={() => onCancel(booking.id)}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

function BusinessCard({ business, onBook }) {
  return (
    <div className="biz-card">
      <div className="biz-avatar">{business.name[0]}</div>
      <div className="biz-info">
        <p className="biz-name">{business.name}</p>
        <p className="biz-category">{business.category}</p>
        <div className="biz-keywords">
          {business.keywords.slice(0, 2).map((k) => (
            <span key={k} className="keyword-pill">
              {k}
            </span>
          ))}
        </div>
      </div>
      <div className="biz-right">
        <p className="biz-rating">
          ⭐ {business.rating} <span>({business.reviews})</span>
        </p>
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
  const [bookings, setBookings] = useState(mockBookings);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  // Load resident from localStorage — falls back to mock
  const stored = localStorage.getItem("resident");
  const resident = stored ? JSON.parse(stored) : mockResident;

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function cancelBooking(id) {
    setBookings((bs) =>
      bs.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)),
    );
    showToast("Booking cancelled");
  }

  function handleBook(business) {
    showToast(`Booking request sent to ${business.name}`);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("resident");
    window.location.href = "/login";
  }

  const filtered = mockBusinesses.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase()) ||
      b.keywords.some((k) => k.includes(search.toLowerCase())),
  );

  const upcoming = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "pending",
  );
  const past = bookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled",
  );

  return (
    <div className="rd-wrap">
      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}

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

        {/* Avatar */}
        <div className="rd-sidebar-user">
          <div className="rd-avatar">
            {initials(resident.firstName, resident.lastName)}
          </div>
          <div>
            <p className="rd-sidebar-name">
              {resident.firstName} {resident.lastName}
            </p>
            <p className="rd-sidebar-suburb">
              {resident.suburb || "Maplewood"}
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
            { id: "ai", icon: "✦", label: "AI advisor" },
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

            {/* Stats */}
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
                <p className="rd-stat-value">{mockBusinesses.length}</p>
                <p className="rd-stat-label">Local businesses</p>
              </div>
            </div>

            {/* Upcoming bookings */}
            {upcoming.length > 0 && (
              <>
                <h2 className="rd-section-title">Upcoming bookings</h2>
                <div className="rd-bookings">
                  {upcoming.map((b) => (
                    <BookingCard
                      key={b.id}
                      booking={b}
                      onCancel={cancelBooking}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Quick find */}
            <h2 className="rd-section-title" style={{ marginTop: "1.75rem" }}>
              Businesses near you
            </h2>
            <div className="rd-biz-list">
              {mockBusinesses.slice(0, 3).map((b) => (
                <BusinessCard key={b.id} business={b} onBook={handleBook} />
              ))}
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
                      key={b.id}
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
                      key={b.id}
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
            <h1 className="rd-title">AI job advisor</h1>
            <p className="rd-sub">
              Describe a household task and we'll tell you what's involved — and
              whether to DIY or hire a pro.
            </p>
            <div className="rd-ai-embed">
              {/* Drop your AiQuery component here */}
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
              <button
                className="btn-primary"
                onClick={() => showToast("Profile saved ✓")}
              >
                Save changes
              </button>
            </div>

            <div className="rd-profile-card">
              {/* Avatar large */}
              <div className="rd-profile-avatar">
                {initials(resident.firstName, resident.lastName)}
              </div>

              <div className="rd-profile-fields">
                <div className="rd-row2">
                  <div className="rd-field">
                    <label>First name</label>
                    <input type="text" defaultValue={resident.firstName} />
                  </div>
                  <div className="rd-field">
                    <label>Last name</label>
                    <input type="text" defaultValue={resident.lastName} />
                  </div>
                </div>
                <div className="rd-field">
                  <label>Email address</label>
                  <input type="email" defaultValue={resident.email} />
                </div>
                <div className="rd-field">
                  <label>Phone</label>
                  <input
                    type="tel"
                    defaultValue={resident.phone || ""}
                    placeholder="(555) 000-0000"
                  />
                </div>
                <div className="rd-field">
                  <label>Address</label>
                  <input
                    type="text"
                    defaultValue={resident.address || ""}
                    placeholder="123 Maple St"
                  />
                </div>
                <div className="rd-field">
                  <label>Suburb</label>
                  <input
                    type="text"
                    defaultValue={resident.suburb || ""}
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
