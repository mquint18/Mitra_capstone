import { useState } from "react";
import "./BusinessDashboard.css";

// ── Helpers ────────────────────────────────────────────────
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

// ── Mock data ──────────────────────────────────────────────
const mockBusiness = {
  name: "Green Thumb Landscaping",
  category: "Home services",
  email: "hello@greenthumb.com",
  phone: "(555) 234-5678",
  address: "Serving the Maplewood area",
  keywords: [
    "lawn care",
    "landscaping",
    "yard cleanup",
    "leaf removal",
    "garden design",
  ],
  availability: {
    days: ["Monday", "Tuesday", "Thursday", "Friday"],
    timeSlots: [
      "9:00 AM",
      "10:00 AM",
      "11:00 AM",
      "1:00 PM",
      "2:00 PM",
      "3:00 PM",
    ],
    appointmentDuration: 60,
  },
};

const mockBookings = [
  {
    id: 1,
    resident: "Sara Rodriguez",
    date: "2026-07-21",
    time: "9:00 AM",
    status: "confirmed",
    job: "Lawn mowing",
  },
  {
    id: 2,
    resident: "Tom Kim",
    date: "2026-07-21",
    time: "1:00 PM",
    status: "pending",
    job: "Garden cleanup",
  },
  {
    id: 3,
    resident: "Priya Tanden",
    date: "2026-07-24",
    time: "10:00 AM",
    status: "confirmed",
    job: "Hedge trimming",
  },
  {
    id: 4,
    resident: "Mark Johnson",
    date: "2026-07-28",
    time: "2:00 PM",
    status: "pending",
    job: "Leaf removal",
  },
];

// ── Sub-components ─────────────────────────────────────────
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
  const statusClass =
    {
      confirmed: "badge-confirmed",
      pending: "badge-pending",
      declined: "badge-declined",
    }[booking.status] || "";

  return (
    <div className="booking-row">
      <div className="booking-info">
        <p className="booking-name">{booking.resident}</p>
        <p className="booking-meta">
          {booking.job} · {booking.date} at {booking.time}
        </p>
      </div>
      <div className="booking-right">
        <span className={`badge ${statusClass}`}>{booking.status}</span>
        {booking.status === "pending" && (
          <div className="booking-actions">
            <button
              className="btn-confirm"
              onClick={() => onConfirm(booking.id)}
            >
              Confirm
            </button>
            <button
              className="btn-decline"
              onClick={() => onDecline(booking.id)}
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
    ? availability.days.includes(selectedDayName)
    : false;

  return (
    <div className="calendar-wrap">
      <div className="cal-panel">
        {/* Month nav */}
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

        {/* Day labels */}
        <div className="cal-grid">
          {DAYS.map((d) => (
            <div key={d} className="cal-day-label">
              {d}
            </div>
          ))}

          {/* Empty cells */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`e${i}`} className="cal-cell empty" />
          ))}

          {/* Day cells */}
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

        {/* Legend */}
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

      {/* Day detail panel */}
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
                    const on = availability.timeSlots.includes(slot);
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
                {selectedBookings.map((b) => (
                  <div key={b.id} className="day-booking">
                    <span className="day-booking-time">{b.time}</span>
                    <div>
                      <p className="day-booking-name">{b.resident}</p>
                      <p className="day-booking-job">{b.job}</p>
                    </div>
                    <span
                      className={`badge ${b.status === "confirmed" ? "badge-confirmed" : "badge-pending"}`}
                    >
                      {b.status}
                    </span>
                  </div>
                ))}
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

// ── Main Dashboard ─────────────────────────────────────────
export default function BusinessDashboard() {
  const [tab, setTab] = useState("overview");
  const [bookings, setBookings] = useState(mockBookings);
  const [availability, setAvailability] = useState(mockBusiness.availability);
  const [toast, setToast] = useState(null);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function confirmBooking(id) {
    setBookings((bs) =>
      bs.map((b) => (b.id === id ? { ...b, status: "confirmed" } : b)),
    );
    showToast("Booking confirmed ✓");
  }

  function declineBooking(id) {
    setBookings((bs) =>
      bs.map((b) => (b.id === id ? { ...b, status: "declined" } : b)),
    );
    showToast("Booking declined");
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

  return (
    <div className="dash-wrap">
      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="10" r="7" fill="#EF9F27" />
            <polygon points="2,16 16,3 30,16" fill="#3B6D11" />
            <rect x="9" y="15" width="14" height="12" rx="2" fill="#639922" />
            <rect x="13" y="20" width="6" height="8" rx="1" fill="#3B6D11" />
            <rect x="9" y="26" width="14" height="3" rx="1" fill="#27500A" />
            <ellipse cx="16" cy="30" rx="4" ry="1.5" fill="#97C459" />
          </svg>
          <span className="sidebar-logo-text">mitra</span>
        </div>

        <div className="sidebar-biz">
          <div className="sidebar-avatar">{mockBusiness.name.charAt(0)}</div>
          <div>
            <p className="sidebar-biz-name">{mockBusiness.name}</p>
            <p className="sidebar-biz-cat">{mockBusiness.category}</p>
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

        <a href="/logout" className="sidebar-logout">
          Sign out
        </a>
      </aside>

      {/* Main content */}
      <main className="dash-main">
        {/* ── Overview ── */}
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
                value={mockBusiness.keywords.length}
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
                  key={b.id}
                  booking={b}
                  onConfirm={confirmBooking}
                  onDecline={declineBooking}
                />
              ))}
            </div>
            <button className="see-all" onClick={() => setTab("bookings")}>
              See all bookings →
            </button>
          </div>
        )}

        {/* ── Calendar ── */}
        {tab === "calendar" && (
          <div className="dash-section">
            <div className="dash-header">
              <div>
                <h1 className="dash-title">Calendar</h1>
                <p className="dash-sub">
                  Manage your availability and view bookings by day.
                </p>
              </div>
              <button
                className="btn-primary"
                onClick={() => showToast("Availability saved ✓")}
              >
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

        {/* ── Bookings ── */}
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
                    className="filter-btn"
                    style={{ textTransform: "capitalize" }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="bookings-list">
              {bookings.map((b) => (
                <BookingRow
                  key={b.id}
                  booking={b}
                  onConfirm={confirmBooking}
                  onDecline={declineBooking}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Profile ── */}
        {tab === "profile" && (
          <div className="dash-section">
            <div className="dash-header">
              <div>
                <h1 className="dash-title">My listing</h1>
                <p className="dash-sub">
                  This is how neighbors see your business on Mitra.
                </p>
              </div>
              <button className="btn-primary">Save changes</button>
            </div>
            <div className="profile-card">
              {[
                { label: "Business name", value: mockBusiness.name },
                { label: "Category", value: mockBusiness.category },
                { label: "Email", value: mockBusiness.email },
                { label: "Phone", value: mockBusiness.phone },
                { label: "Service area", value: mockBusiness.address },
              ].map(({ label, value }) => (
                <div key={label} className="profile-field">
                  <label>{label}</label>
                  <input type="text" defaultValue={value} />
                </div>
              ))}
              <div className="profile-field">
                <label>Keywords</label>
                <div className="keywords-display">
                  {mockBusiness.keywords.map((k) => (
                    <span key={k} className="keyword-tag">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Settings ── */}
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
