// AdminPanel.jsx
import { useState, useEffect, useCallback } from "react";
import "./AdminPanel.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5001";

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
}

// ── Stat card ─────────────────────────────────────────────
function StatCard({ label, value, color }) {
  return (
    <div className="ap-stat" style={{ borderTop: `3px solid ${color}` }}>
      <p className="ap-stat-value">{value ?? "—"}</p>
      <p className="ap-stat-label">{label}</p>
    </div>
  );
}

// ── Confirm modal ─────────────────────────────────────────
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="ap-modal-backdrop" onClick={onCancel}>
      <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
        <p className="ap-modal-msg">{message}</p>
        <div className="ap-modal-actions">
          <button className="ap-btn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button className="ap-btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Businesses tab ────────────────────────────────────────
function BusinessesTab({ showToast }) {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState(null);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/businesses`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (res.ok) setBusinesses(data.businesses || []);
    } catch (_) {
      showToast("Failed to load businesses");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetch_();
  }, [fetch_]);

  async function deleteBusiness(id) {
    try {
      const res = await fetch(`${API}/api/admin/businesses/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) {
        setBusinesses((bs) => bs.filter((b) => b._id !== id));
        showToast("Business deleted");
      }
    } catch (_) {
      showToast("Failed to delete");
    }
    setConfirm(null);
  }

  const filtered = businesses.filter(
    (b) =>
      (b.businessName || "").toLowerCase().includes(search.toLowerCase()) ||
      (b.businessType || "").toLowerCase().includes(search.toLowerCase()) ||
      (b.email || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="ap-tab-content">
      {confirm && (
        <ConfirmModal
          message={`Delete "${confirm.name}"? This cannot be undone.`}
          onConfirm={() => deleteBusiness(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}
      <div className="ap-tab-header">
        <h2 className="ap-tab-title">
          Businesses <span className="ap-count">{businesses.length}</span>
        </h2>
        <input
          className="ap-search"
          placeholder="Search by name, type or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {loading ? (
        <p className="ap-loading">Loading…</p>
      ) : (
        <div className="ap-table-wrap">
          <table className="ap-table">
            <thead>
              <tr>
                <th>Business</th>
                <th>Type</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Keywords</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b._id}>
                  <td>
                    <p className="ap-primary">{b.businessName}</p>
                  </td>
                  <td>
                    <span className="ap-badge ap-badge-green">
                      {b.businessType}
                    </span>
                  </td>
                  <td className="ap-secondary">{b.email}</td>
                  <td className="ap-secondary">{b.phone || "—"}</td>
                  <td>
                    <div className="ap-pills">
                      {(b.keywords || []).slice(0, 3).map((k) => (
                        <span key={k} className="ap-pill">
                          {k}
                        </span>
                      ))}
                      {(b.keywords || []).length > 3 && (
                        <span className="ap-pill-more">
                          +{b.keywords.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <button
                      className="ap-btn-delete"
                      onClick={() =>
                        setConfirm({ id: b._id, name: b.businessName })
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="ap-empty">
                    No businesses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Residents tab ─────────────────────────────────────────
function ResidentsTab({ showToast }) {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState(null);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/residents`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (res.ok) setResidents(data.residents || []);
    } catch (_) {
      showToast("Failed to load residents");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetch_();
  }, [fetch_]);

  async function deleteResident(id) {
    try {
      const res = await fetch(`${API}/api/admin/residents/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) {
        setResidents((rs) => rs.filter((r) => r._id !== id));
        showToast("Resident deleted");
      }
    } catch (_) {
      showToast("Failed to delete");
    }
    setConfirm(null);
  }

  const filtered = residents.filter(
    (r) =>
      `${r.firstName} ${r.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (r.email || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="ap-tab-content">
      {confirm && (
        <ConfirmModal
          message={`Delete "${confirm.name}"? This cannot be undone.`}
          onConfirm={() => deleteResident(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}
      <div className="ap-tab-header">
        <h2 className="ap-tab-title">
          Residents <span className="ap-count">{residents.length}</span>
        </h2>
        <input
          className="ap-search"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {loading ? (
        <p className="ap-loading">Loading…</p>
      ) : (
        <div className="ap-table-wrap">
          <table className="ap-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r._id}>
                  <td>
                    <p className="ap-primary">
                      {r.firstName} {r.lastName}
                    </p>
                  </td>
                  <td className="ap-secondary">{r.email}</td>
                  <td className="ap-secondary">{r.phone || "—"}</td>
                  <td className="ap-secondary">
                    {r.suburb || r.address || "—"}
                  </td>
                  <td className="ap-secondary">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      className="ap-btn-delete"
                      onClick={() =>
                        setConfirm({
                          id: r._id,
                          name: `${r.firstName} ${r.lastName}`,
                        })
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="ap-empty">
                    No residents found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Bookings tab ──────────────────────────────────────────
function BookingsTab({ showToast }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/bookings`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (res.ok) setBookings(data.bookings || []);
    } catch (_) {
      showToast("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetch_();
  }, [fetch_]);

  async function updateStatus(id, status) {
    try {
      const res = await fetch(`${API}/api/bookings/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setBookings((bs) =>
          bs.map((b) => (b._id === id ? { ...b, status } : b)),
        );
        showToast(`Booking marked as ${status}`);
      }
    } catch (_) {
      showToast("Failed to update");
    }
  }

  const statusColor = {
    confirmed: "ap-badge-green",
    pending: "ap-badge-gold",
    declined: "ap-badge-red",
    cancelled: "ap-badge-grey",
    completed: "ap-badge-grey",
  };

  const filtered =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div className="ap-tab-content">
      <div className="ap-tab-header">
        <h2 className="ap-tab-title">
          Bookings <span className="ap-count">{bookings.length}</span>
        </h2>
        <div className="ap-filters">
          {[
            "all",
            "pending",
            "confirmed",
            "declined",
            "cancelled",
            "completed",
          ].map((f) => (
            <button
              key={f}
              className={`ap-filter-btn ${filter === f ? "active" : ""}`}
              style={{ textTransform: "capitalize" }}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <p className="ap-loading">Loading…</p>
      ) : (
        <div className="ap-table-wrap">
          <table className="ap-table">
            <thead>
              <tr>
                <th>Resident</th>
                <th>Business</th>
                <th>Date</th>
                <th>Time</th>
                <th>Note</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => {
                const resident = b.residentId
                  ? `${b.residentId.firstName || ""} ${b.residentId.lastName || ""}`.trim()
                  : "—";
                const business =
                  b.businessId?.businessName || b.businessName || "—";
                return (
                  <tr key={b._id}>
                    <td>
                      <p className="ap-primary">{resident}</p>
                    </td>
                    <td className="ap-secondary">{business}</td>
                    <td className="ap-secondary">{b.date}</td>
                    <td className="ap-secondary">{b.time}</td>
                    <td className="ap-secondary">{b.note || "—"}</td>
                    <td>
                      <span
                        className={`ap-badge ${statusColor[b.status] || ""}`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td>
                      <div className="ap-action-row">
                        {b.status === "pending" && (
                          <>
                            <button
                              className="ap-btn-sm ap-btn-green"
                              onClick={() => updateStatus(b._id, "confirmed")}
                            >
                              Confirm
                            </button>
                            <button
                              className="ap-btn-sm ap-btn-red"
                              onClick={() => updateStatus(b._id, "declined")}
                            >
                              Decline
                            </button>
                          </>
                        )}
                        {b.status === "confirmed" && (
                          <button
                            className="ap-btn-sm ap-btn-grey"
                            onClick={() => updateStatus(b._id, "completed")}
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="ap-empty">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Main Admin Panel ──────────────────────────────────────
export default function AdminPanel() {
  const [tab, setTab] = useState("overview");
  const [toast, setToast] = useState(null);
  const [stats, setStats] = useState({});

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`${API}/api/admin/stats`, {
          headers: authHeaders(),
        });
        const data = await res.json();
        if (res.ok) setStats(data);
      } catch (_) {}
    }
    fetchStats();
  }, []);

  function handleLogout() {
    localStorage.clear();
    window.location.href = "/login";
  }

  const navItems = [
    { id: "overview", icon: "⊞", label: "Overview" },
    { id: "businesses", icon: "🏪", label: "Businesses" },
    { id: "residents", icon: "👤", label: "Residents" },
    { id: "bookings", icon: "📅", label: "Bookings" },
  ];

  return (
    <div className="ap-wrap">
      {toast && <div className="ap-toast">{toast}</div>}

      {/* Sidebar */}
      <aside className="ap-sidebar">
        <div className="ap-sidebar-logo">
          <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="10" r="7" fill="#EF9F27" />
            <polygon points="2,16 16,3 30,16" fill="#3B6D11" />
            <rect x="9" y="15" width="14" height="12" rx="2" fill="#639922" />
            <rect x="13" y="20" width="6" height="8" rx="1" fill="#3B6D11" />
            <rect x="9" y="26" width="14" height="3" rx="1" fill="#27500A" />
            <ellipse cx="16" cy="30" rx="4" ry="1.5" fill="#97C459" />
          </svg>
          <div>
            <span className="ap-sidebar-logo-text">mitra</span>
            <span className="ap-sidebar-badge">Admin</span>
          </div>
        </div>

        <nav className="ap-nav">
          {navItems.map(({ id, icon, label }) => (
            <button
              key={id}
              className={`ap-nav-item ${tab === id ? "ap-nav-active" : ""}`}
              onClick={() => setTab(id)}
            >
              <span className="ap-nav-icon">{icon}</span>
              {label}
            </button>
          ))}
        </nav>

        <button className="ap-logout" onClick={handleLogout}>
          Sign out
        </button>
      </aside>

      {/* Main */}
      <main className="ap-main">
        {/* ── Overview ── */}
        {tab === "overview" && (
          <div className="ap-tab-content">
            <div className="ap-tab-header">
              <h2 className="ap-tab-title">Overview</h2>
            </div>
            <div className="ap-stats-grid">
              <StatCard
                label="Total businesses"
                value={stats.businesses}
                color="#639922"
              />
              <StatCard
                label="Total residents"
                value={stats.residents}
                color="#EF9F27"
              />
              <StatCard
                label="Total bookings"
                value={stats.bookings}
                color="#534AB7"
              />
              <StatCard
                label="Pending bookings"
                value={stats.pending}
                color="#E24B4A"
              />
            </div>
            <div className="ap-overview-grid">
              <div
                className="ap-overview-card"
                onClick={() => setTab("businesses")}
              >
                <div className="ap-overview-icon">🏪</div>
                <p className="ap-overview-label">Manage businesses</p>
                <p className="ap-overview-sub">
                  View, search and delete business listings
                </p>
              </div>
              <div
                className="ap-overview-card"
                onClick={() => setTab("residents")}
              >
                <div className="ap-overview-icon">👤</div>
                <p className="ap-overview-label">Manage residents</p>
                <p className="ap-overview-sub">
                  View and manage resident accounts
                </p>
              </div>
              <div
                className="ap-overview-card"
                onClick={() => setTab("bookings")}
              >
                <div className="ap-overview-icon">📅</div>
                <p className="ap-overview-label">Manage bookings</p>
                <p className="ap-overview-sub">
                  Review, confirm and decline appointments
                </p>
              </div>
            </div>
          </div>
        )}

        {tab === "businesses" && <BusinessesTab showToast={showToast} />}
        {tab === "residents" && <ResidentsTab showToast={showToast} />}
        {tab === "bookings" && <BookingsTab showToast={showToast} />}
      </main>
    </div>
  );
}
