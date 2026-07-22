// pages/BusinessSearch.jsx
import { useState, useEffect, useRef } from "react";
import { useBusinessSearch } from "../../hooks/useBusinessSearch";
import "./BusinessSearch.css";

// ── Business card ─────────────────────────────────────────
function BusinessCard({ business, onBook }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bs-card">
      <div className="bs-card-main">
        {/* Avatar */}
        <div className="bs-avatar">
          {business.businessName?.[0] || business.name?.[0] || "?"}
        </div>

        {/* Info */}
        <div className="bs-info">
          <p className="bs-name">{business.businessName || business.name}</p>
          <p className="bs-category">{business.category}</p>
          {business.address && (
            <p className="bs-address">📍 {business.address}</p>
          )}
          <div className="bs-keywords">
            {(business.keywords || []).slice(0, 4).map((k) => (
              <span key={k} className="bs-keyword">
                {k}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="bs-actions">
          <button
            className="bs-btn-outline"
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? "Less" : "Details"}
          </button>
          <button className="bs-btn-book" onClick={() => onBook(business)}>
            Book
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="bs-expanded">
          {business.description && (
            <div className="bs-detail-block">
              <p className="bs-detail-label">About</p>
              <p className="bs-detail-text">{business.description}</p>
            </div>
          )}
          <div className="bs-detail-row">
            {business.phone && (
              <div className="bs-detail-block">
                <p className="bs-detail-label">Phone</p>
                <p className="bs-detail-text">{business.phone}</p>
              </div>
            )}
            {business.email && (
              <div className="bs-detail-block">
                <p className="bs-detail-label">Email</p>
                <p className="bs-detail-text">{business.email}</p>
              </div>
            )}
            {business.website && (
              <div className="bs-detail-block">
                <p className="bs-detail-label">Website</p>
                <a
                  href={business.website}
                  target="_blank"
                  rel="noreferrer"
                  className="bs-detail-link"
                >
                  {business.website}
                </a>
              </div>
            )}
          </div>
          {business.availability?.days?.length > 0 && (
            <div className="bs-detail-block">
              <p className="bs-detail-label">Available days</p>
              <div className="bs-days">
                {business.availability.days.map((d) => (
                  <span key={d} className="bs-day">
                    {d.slice(0, 3)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Booking modal ─────────────────────────────────────────
function BookingModal({ business, onClose, onConfirm }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");

  const slots = business.availability?.timeSlots || [];
  const minDate = new Date().toISOString().split("T")[0];

  function handleSubmit(e) {
    e.preventDefault();
    if (!date || !time) return;
    onConfirm({ business, date, time, note });
  }

  return (
    <div className="bs-modal-backdrop" onClick={onClose}>
      <div className="bs-modal" onClick={(e) => e.stopPropagation()}>
        <div className="bs-modal-header">
          <h3>Book {business.businessName || business.name}</h3>
          <button className="bs-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bs-modal-field">
            <label>Date</label>
            <input
              type="date"
              min={minDate}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="bs-modal-field">
            <label>Time slot</label>
            {slots.length > 0 ? (
              <div className="bs-slot-grid">
                {slots.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`bs-slot ${time === s ? "bs-slot-active" : ""}`}
                    onClick={() => setTime(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : (
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            )}
          </div>

          <div className="bs-modal-field">
            <label>Note (optional)</label>
            <textarea
              placeholder="Describe what you need…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>

          <div className="bs-modal-actions">
            <button type="button" className="bs-btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="bs-btn-book"
              disabled={!date || !time}
            >
              Confirm booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main search page ──────────────────────────────────────
export default function BusinessSearch() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [booking, setBooking] = useState(null);
  const [toast, setToast] = useState(null);
  const debounceRef = useRef(null);

  const {
    search,
    results,
    categories,
    loading,
    error,
    total,
    page,
    totalPages,
  } = useBusinessSearch();

  // Load all on mount
  useEffect(() => {
    search();
  }, []);

  // Debounced search on query/category change
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      search({ q: query, category, pageNum: 1 });
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [query, category]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function handleConfirmBooking({ business, date, time, note }) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5001/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          businessId: business._id,
          date,
          time,
          note,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setBooking(null);
      showToast(
        `Booking request sent to ${business.businessName || business.name} ✓`,
      );
    } catch (err) {
      showToast(`Booking failed: ${err.message}`);
    }
  }

  return (
    <div className="bs-wrap">
      {toast && <div className="bs-toast">{toast}</div>}

      {/* Header */}
      <div className="bs-header">
        <div>
          <h1 className="bs-title">Find a business</h1>
          <p className="bs-sub">
            Search local services by name, category, or keyword.
          </p>
        </div>
      </div>

      {/* Search bar + category filter */}
      <div className="bs-controls">
        <input
          className="bs-search"
          type="text"
          placeholder="Search — e.g. lawn care, plumbing, tutoring…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="bs-category-select"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            search({ q: query, category: e.target.value, pageNum: 1 });
          }}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "All categories" : c}
            </option>
          ))}
        </select>
      </div>

      {/* Results count */}
      {!loading && (
        <p className="bs-count">
          {total} business{total !== 1 ? "es" : ""} found
          {query && ` for "${query}"`}
          {category !== "all" && ` in ${category}`}
        </p>
      )}

      {/* Error */}
      {error && <div className="bs-error">{error}</div>}

      {/* Loading */}
      {loading && (
        <div className="bs-loading">
          <div className="bs-spinner" />
          <p>Searching…</p>
        </div>
      )}

      {/* Results */}
      {!loading && (
        <div className="bs-results">
          {results.map((b) => (
            <BusinessCard
              key={b._id}
              business={b}
              onBook={() => setBooking(b)}
            />
          ))}
          {results.length === 0 && !error && (
            <div className="bs-empty">
              <p>No businesses found{query ? ` for "${query}"` : ""}.</p>
              <button
                className="bs-link"
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                  search();
                }}
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bs-pagination">
          <button
            className="bs-page-btn"
            disabled={page === 1}
            onClick={() => search({ q: query, category, pageNum: page - 1 })}
          >
            ← Previous
          </button>
          <span className="bs-page-info">
            Page {page} of {totalPages}
          </span>
          <button
            className="bs-page-btn"
            disabled={page === totalPages}
            onClick={() => search({ q: query, category, pageNum: page + 1 })}
          >
            Next →
          </button>
        </div>
      )}

      {/* Booking modal */}
      {booking && (
        <BookingModal
          business={booking}
          onClose={() => setBooking(null)}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
}
