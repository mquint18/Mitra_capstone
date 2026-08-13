// ResidentDashboard.jsx
import { useState, useEffect, useCallback } from "react";
import "./ResidentDashboard.css";
import AiQuery from "../components/AiQuery";
import BusinessSearch from "./BusinessSearch";
import MitraLogo from "../components/MitraLogo";
import ReviewModal from "../components/ReviewModal";
import { API, authHeaders } from "../utils/api";
import { formatPhone, initials } from "../utils/format";
import { useSearchParams } from "react-router-dom";
import { useNeighborhoods } from "../utils/useNeighborhoods";

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

function BookingCard({ booking, onCancel, onReview, reviewedIds }) {
  const businessName =
    booking.businessId?.businessName ||
    booking.businessName ||
    "Unknown business";

  const alreadyReviewed = reviewedIds.includes(booking._id);

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
        {booking.status === "completed" && !alreadyReviewed && (
          <button
            className="btn-cancel"
            style={{ color: "#639922", borderColor: "#639922" }}
            onClick={() => onReview(booking)}
          >
            Leave a review
          </button>
        )}
        {booking.status === "completed" && alreadyReviewed && (
          <span style={{ fontSize: "12px", color: "#888780" }}>✓ Reviewed</span>
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
    </div>
  );
}

export default function ResidentDashboard() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "home";
  const [tab, setTab] = useState(initialTab);
  const [bookings, setBookings] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [reviewingBooking, setReviewingBooking] = useState(null);
  const [reviewedIds, setReviewedIds] = useState([]);
  const { neighborhoods } = useNeighborhoods();

  const stored = localStorage.getItem("resident");
  const resident = stored
    ? JSON.parse(stored)
    : {
        firstName: "",
        lastName: "",
        email: "",
        neighborhood: "",
        phone: "",
        address: "",
      };

  const [profile, setProfile] = useState({
    firstName: resident.firstName || "",
    lastName: resident.lastName || "",
    email: resident.email || "",
    phone: resident.phone || "",
    address: resident.address || "",
    neighborhood: resident.neighborhood || "",
  });

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

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

  const fetchReviewedIds = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/reviews/mine`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (res.ok) setReviewedIds(data.reviewedBookingIds || []);
    } catch (_) {
      console.error("Failed to load reviewed bookings");
    }
  }, []);

  useEffect(() => {
    fetchBookings();
    fetchBusinesses();
    fetchReviewedIds();
  }, [fetchBookings, fetchBusinesses, fetchReviewedIds]);

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

  async function submitReview({ bookingId, rating, comment }) {
    try {
      const res = await fetch(`${API}/api/reviews`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ bookingId, rating, comment }),
      });
      const data = await res.json();
      if (res.ok) {
        setReviewedIds((prev) => [...prev, bookingId]);
        setReviewingBooking(null);
        showToast("Review submitted ✓");
      } else {
        showToast(data.message || "Failed to submit review");
      }
    } catch (_) {
      showToast("Unable to connect to server");
    }
  }

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
      {toast && (
        <div className="toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}

      {reviewingBooking && (
        <ReviewModal
          booking={reviewingBooking}
          onClose={() => setReviewingBooking(null)}
          onSubmit={submitReview}
        />
      )}

      <aside className="rd-sidebar">
        <div className="rd-sidebar-logo">
          <MitraLogo size={28} />
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
            <p className="rd-sidebar-neighborhood">
              {resident.neighborhood || resident.address || "Resident"}
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

      <main className="rd-main">
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
                      onReview={setReviewingBooking}
                      reviewedIds={reviewedIds}
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

        {tab === "search" && <BusinessSearch />}

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
                      onReview={setReviewingBooking}
                      reviewedIds={reviewedIds}
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
                      onReview={setReviewingBooking}
                      reviewedIds={reviewedIds}
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

        {tab === "ai" && (
          <div className="rd-section">
            <div className="rd-ai-embed">
              <AiQuery />
            </div>
          </div>
        )}

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
                  <label>Neighborhood</label>
                  <select
                    value={profile.neighborhood}
                    onChange={(e) =>
                      setProfile((p) => ({
                        ...p,
                        neighborhood: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select your neighborhood</option>
                    {neighborhoods.map((n) => (
                      <option key={n._id} value={n.name}>
                        {n.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
