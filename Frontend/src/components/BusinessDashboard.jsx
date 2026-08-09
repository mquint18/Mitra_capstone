//BusinessDashboard.jsx

import { useState, useEffect, useCallback } from "react";
import "./BusinessDashboard.css";
import MitraLogo from "./MitraLogo";
import { API, authHeaders } from "../utils/api";
import NeighborhoodChecklist from "./NeighborhoodChecklist";
import "./NeighborhoodChecklist.css";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const TIME_SLOTS = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDay(year, month) {
  return new Date(year, month, 1).getDay();
}

function StatCard({ label, value, sub }) {
  return (
    <div className="stat-card">
      <p className="stat-value">{value}</p>
      <p className="stat-label">{label}</p>
      {sub && <p className="stat-sub">{sub}</p>}
    </div>
  );
}

function BookingRow({ booking, onConfirm, onDecline }) {
  const residentName = booking.residentId
    ? `${booking.residentId.firstName || ""} ${booking.residentId.lastName || ""}`.trim()
    : booking.resident || "Unknown";

  const statusClass =
    {
      confirmed: "badge-confirmed",
      pending: "badge-pending",
      declined: "badge-declined",
    }[booking.status] || "";

  return (
    <div className="booking-row">
      <div className="booking-info">
        <p className="booking-name">{residentName}</p>
        <p className="booking-meta">
          {booking.note || "No description"} · {booking.date} at {booking.time}
        </p>
      </div>
      <div className="booking-right">
        <span className={`badge ${statusClass}`}>{booking.status}</span>
        {booking.status === "pending" && (
          <div className="booking-actions">
            <button
              className="btn-confirm"
              onClick={() => onConfirm(booking._id)}
            >
              Confirm
            </button>
            <button
              className="btn-decline"
              onClick={() => onDecline(booking._id)}
            >
              Decline
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Calendar({ bookings, availability, onSlotToggle, onDayToggle }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState(null);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDay(year, month);
  const bookingDates = bookings.map((b) => b.date);

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
    setSelected(null);
  }
  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
    setSelected(null);
  }
  function dateStr(day) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  const selectedBookings = selected
    ? bookings.filter((b) => b.date === dateStr(selected))
    : [];
  const selectedDayName = selected
    ? [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ][new Date(year, month, selected).getDay()]
    : null;
  const isAvailableDay = selectedDayName
    ? (availability?.days || []).includes(selectedDayName)
    : false;

  return (
    <div className="calendar-wrap">
      <div className="cal-panel">
        <div className="cal-header">
          <button
            className="cal-nav"
            onClick={prevMonth}
            aria-label="Previous month"
          >
            ‹
          </button>
          <h3 className="cal-month">
            {MONTHS[month]} {year}
          </h3>
          <button
            className="cal-nav"
            onClick={nextMonth}
            aria-label="Next month"
          >
            ›
          </button>
        </div>
        <div className="cal-grid">
          {DAYS.map((d) => (
            <div key={d} className="cal-day-label">
              {d}
            </div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`e${i}`} className="cal-cell empty" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const ds = dateStr(day);
            const hasBook = bookingDates.includes(ds);
            const isPast =
              new Date(year, month, day) < new Date(today.toDateString());
            const isToday = ds === today.toISOString().slice(0, 10);
            const isSel = selected === day;
            return (
              <button
                key={day}
                className={[
                  "cal-cell",
                  isPast ? "past" : "",
                  isToday ? "today" : "",
                  isSel ? "sel" : "",
                  hasBook ? "has-booking" : "",
                ].join(" ")}
                onClick={() => !isPast && setSelected(day)}
                disabled={isPast}
              >
                {day}
                {hasBook && (
                  <span className="booking-dot" aria-label="has booking" />
                )}
              </button>
            );
          })}
        </div>
        <div className="cal-legend">
          <span>
            <span className="dot-demo booking-dot-demo" />
            Booking
          </span>
          <span>
            <span className="dot-demo today-demo" />
            Today
          </span>
          <span>
            <span className="dot-demo sel-demo" />
            Selected
          </span>
        </div>
      </div>

      <div className="day-panel">
        {selected ? (
          <>
            <div className="day-panel-header">
              <h4>
                {selectedDayName}, {MONTHS[month]} {selected}
              </h4>
              <label className="tog">
                <input
                  type="checkbox"
                  checked={isAvailableDay}
                  onChange={() => onDayToggle(selectedDayName)}
                />
                <div className="tog-track" />
                <div className="tog-thumb" />
              </label>
            </div>
            <p className="day-avail-label">
              {isAvailableDay
                ? "Available for bookings"
                : "Closed — toggle to open"}
            </p>
            {isAvailableDay && (
              <>
                <p className="slot-section-label">Time slots</p>
                <div className="slot-grid">
                  {TIME_SLOTS.map((slot) => {
                    const on = (availability?.timeSlots || []).includes(slot);
                    const booked = selectedBookings.some(
                      (b) => b.time === slot,
                    );
                    return (
                      <button
                        key={slot}
                        className={`slot ${on ? "slot-on" : ""} ${booked ? "slot-booked" : ""}`}
                        onClick={() => !booked && onSlotToggle(slot)}
                        disabled={booked}
                        title={
                          booked
                            ? "Booked"
                            : on
                              ? "Click to close"
                              : "Click to open"
                        }
                      >
                        {slot}
                        {booked && (
                          <span className="slot-booked-label"> ·booked</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
            {selectedBookings.length > 0 && (
              <>
                <p
                  className="slot-section-label"
                  style={{ marginTop: "1.25rem" }}
                >
                  Bookings this day
                </p>
                {selectedBookings.map((b) => {
                  const name = b.residentId
                    ? `${b.residentId.firstName || ""} ${b.residentId.lastName || ""}`.trim()
                    : "Unknown";
                  return (
                    <div key={b._id} className="day-booking">
                      <span className="day-booking-time">{b.time}</span>
                      <div>
                        <p className="day-booking-name">{name}</p>
                        <p className="day-booking-job">
                          {b.note || "No description"}
                        </p>
                      </div>
                      <span
                        className={`badge ${b.status === "confirmed" ? "badge-confirmed" : "badge-pending"}`}
                      >
                        {b.status}
                      </span>
                    </div>
                  );
                })}
              </>
            )}
            {selectedBookings.length === 0 && isAvailableDay && (
              <p className="empty-day">No bookings yet for this day.</p>
            )}
          </>
        ) : (
          <div className="day-panel-empty">
            <p>Select a day to manage slots and view bookings</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BusinessDashboard() {
  const [tab, setTab] = useState("overview");
  const [business, setBusiness] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [availability, setAvailability] = useState({
    days: [],
    timeSlots: [],
    appointmentDuration: 60,
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("all");
  const [neighborhoods, setNeighborhoods] = useState([]);

  const storedBusiness = JSON.parse(localStorage.getItem("business") || "{}");

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  const fetchBusiness = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/business/${storedBusiness.id}`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (res.ok) {
        setBusiness(data.business);
        setNeighborhoods(data.business.neighborhoods || []);
        if (data.business.availability)
          setAvailability(data.business.availability);
      }
    } catch (_) {
      setBusiness(storedBusiness);
    }
  }, [storedBusiness.id]);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/bookings/business`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (res.ok) setBookings(data.bookings || []);
    } catch (_) {
      console.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBusiness();
    fetchBookings();
  }, [fetchBusiness, fetchBookings]);

  async function updateBooking(id, status) {
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
        showToast(
          status === "confirmed" ? "Booking confirmed ✓" : "Booking declined",
        );
      }
    } catch (_) {
      showToast("Failed to update booking");
    }
  }

  async function saveAvailability() {
    try {
      const res = await fetch(
        `${API}/api/business/${storedBusiness.id}/availability`,
        {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify({ availability }),
        },
      );
      if (res.ok) showToast("Availability saved ✓");
      else showToast("Failed to save availability");
    } catch (_) {
      showToast("Failed to save availability");
    }
  }
  async function saveNeighborhoods() {
    try {
      const res = await fetch(
        `${API}/api/business/${storedBusiness.id}/neighborhoods`,
        {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify({ neighborhoods }),
        },
      );
      if (res.ok) showToast("Neighborhoods saved ✓");
      else showToast("Failed to save neighborhoods");
    } catch (_) {
      showToast("Failed to save neighborhoods");
    }
  }

  function toggleSlot(slot) {
    setAvailability((av) => ({
      ...av,
      timeSlots: av.timeSlots.includes(slot)
        ? av.timeSlots.filter((s) => s !== slot)
        : [...av.timeSlots, slot],
    }));
  }

  function toggleDay(day) {
    setAvailability((av) => ({
      ...av,
      days: av.days.includes(day)
        ? av.days.filter((d) => d !== day)
        : [...av.days, day],
    }));
  }

  const pending = bookings.filter((b) => b.status === "pending").length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;

  const filteredBookings =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const displayName =
    business?.businessName || storedBusiness?.businessName || "My Business";
  const displayCat =
    business?.businessType || storedBusiness?.businessType || "";

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("business");
    window.location.href = "/business/login";
  }

  if (loading) {
    return (
      <div
        className="dash-wrap"
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <p style={{ color: "#A17A5C", fontFamily: "system-ui" }}>
          Loading dashboard…
        </p>
      </div>
    );
  }

  return (
    <div className="dash-wrap">
      {toast && (
        <div className="toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <MitraLogo size={28} />
          <span className="sidebar-logo-text">mitra</span>
        </div>

        <div className="sidebar-biz">
          <div className="sidebar-avatar">{displayName.charAt(0)}</div>
          <div>
            <p className="sidebar-biz-name">{displayName}</p>
            <p className="sidebar-biz-cat">{displayCat}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {[
            { id: "overview", icon: "⊞", label: "Overview" },
            { id: "calendar", icon: "◫", label: "Calendar" },
            { id: "bookings", icon: "✓", label: "Bookings" },
            { id: "profile", icon: "⊙", label: "My listing" },
            { id: "settings", icon: "⚙", label: "Settings" },
          ].map(({ id, icon, label }) => (
            <button
              key={id}
              className={`nav-item ${tab === id ? "nav-item-active" : ""}`}
              onClick={() => setTab(id)}
            >
              <span className="nav-icon">{icon}</span>
              {label}
              {id === "bookings" && pending > 0 && (
                <span className="nav-badge">{pending}</span>
              )}
            </button>
          ))}
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          Sign out
        </button>
      </aside>

      <main className="dash-main">
        {tab === "overview" && (
          <div className="dash-section">
            <div className="dash-header">
              <div>
                <h1 className="dash-title">Good morning 👋</h1>
                <p className="dash-sub">
                  Here's what's happening with your business today.
                </p>
              </div>
            </div>
            <div className="stats-row">
              <StatCard
                label="Pending bookings"
                value={pending}
                sub="Need your response"
              />
              <StatCard label="Confirmed" value={confirmed} sub="This month" />
              <StatCard
                label="Keywords"
                value={(business?.keywords || []).length}
                sub="Search terms"
              />
              <StatCard
                label="Available days"
                value={availability.days.length}
                sub="Per week"
              />
            </div>
            <h2 className="section-title">Recent bookings</h2>
            <div className="bookings-list">
              {bookings.slice(0, 3).map((b) => (
                <BookingRow
                  key={b._id}
                  booking={b}
                  onConfirm={(id) => updateBooking(id, "confirmed")}
                  onDecline={(id) => updateBooking(id, "declined")}
                />
              ))}
              {bookings.length === 0 && (
                <p style={{ color: "#A17A5C", fontSize: "14px" }}>
                  No bookings yet.
                </p>
              )}
            </div>
            {bookings.length > 3 && (
              <button className="see-all" onClick={() => setTab("bookings")}>
                See all bookings →
              </button>
            )}
          </div>
        )}

        {tab === "calendar" && (
          <div className="dash-section">
            <div className="dash-header">
              <div>
                <h1 className="dash-title">Calendar</h1>
                <p className="dash-sub">
                  Manage your availability and view bookings by day.
                </p>
              </div>
              <button className="btn-primary" onClick={saveAvailability}>
                Save changes
              </button>
            </div>
            <Calendar
              bookings={bookings}
              availability={availability}
              onSlotToggle={toggleSlot}
              onDayToggle={toggleDay}
            />
          </div>
        )}

        {tab === "bookings" && (
          <div className="dash-section">
            <div className="dash-header">
              <div>
                <h1 className="dash-title">Bookings</h1>
                <p className="dash-sub">
                  Manage all incoming appointment requests.
                </p>
              </div>
              <div className="filter-row">
                {["all", "pending", "confirmed", "declined"].map((f) => (
                  <button
                    key={f}
                    className={`filter-btn ${filter === f ? "filter-btn-active" : ""}`}
                    style={{ textTransform: "capitalize" }}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="bookings-list">
              {filteredBookings.map((b) => (
                <BookingRow
                  key={b._id}
                  booking={b}
                  onConfirm={(id) => updateBooking(id, "confirmed")}
                  onDecline={(id) => updateBooking(id, "declined")}
                />
              ))}
              {filteredBookings.length === 0 && (
                <p style={{ color: "#A17A5C", fontSize: "14px" }}>
                  No {filter === "all" ? "" : filter} bookings.
                </p>
              )}
            </div>
          </div>
        )}

        {tab === "profile" && (
          <div className="dash-section">
            <div className="dash-header">
              <div>
                <h1 className="dash-title">My listing</h1>
                <p className="dash-sub">
                  This is how neighbors see your business on Mitra.
                </p>
              </div>
              <button
                className="btn-primary"
                onClick={() => showToast("Profile saved ✓")}
              >
                Save changes
              </button>
            </div>
            <div className="profile-card">
              {[
                { label: "Business name", value: business?.businessName || "" },
                { label: "Business type", value: business?.businessType || "" },
                { label: "Email", value: business?.email || "" },
                { label: "Phone", value: business?.phone || "" },
                { label: "Street", value: business?.address?.street || "" },
                { label: "City", value: business?.address?.city || "" },
                { label: "State", value: business?.address?.state || "" },
              ].map(({ label, value }) => (
                <div key={label} className="profile-field">
                  <label>{label}</label>
                  <input type="text" defaultValue={value} />
                </div>
              ))}
              <div className="profile-field">
                <label>Keywords</label>
                <div className="keywords-display">
                  {(business?.keywords || []).map((k) => (
                    <span key={k} className="keyword-tag">
                      {k}
                    </span>
                  ))}
                </div>
                <div className="profile-field">
                  <label>Neighborhoods served</label>
                  <NeighborhoodChecklist
                    selected={neighborhoods}
                    onChange={setNeighborhoods}
                  />
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ marginTop: "10px" }}
                    onClick={saveNeighborhoods}
                  >
                    Save neighborhoods
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "settings" && (
          <div className="dash-section">
            <h1 className="dash-title">Settings</h1>
            <p className="dash-sub">
              Manage your account and notification preferences.
            </p>
            <div className="settings-card">
              {[
                {
                  label: "Email notifications for new bookings",
                  defaultChecked: true,
                },
                {
                  label: "SMS reminders for upcoming appointments",
                  defaultChecked: false,
                },
                {
                  label: "Show listing publicly on Mitra",
                  defaultChecked: true,
                },
                {
                  label: "Allow instant booking (no approval)",
                  defaultChecked: false,
                },
              ].map(({ label, defaultChecked }) => (
                <div key={label} className="setting-row">
                  <span>{label}</span>
                  <label className="tog">
                    <input type="checkbox" defaultChecked={defaultChecked} />
                    <div className="tog-track" />
                    <div className="tog-thumb" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
