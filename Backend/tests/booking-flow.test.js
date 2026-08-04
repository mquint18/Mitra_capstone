// tests/booking-flow.test.js
//
// Full lifecycle tests: business registration/login, and the complete
// booking flow (create → confirm → cancel/decline).
//
// Run with:  BASE_URL=<your-backend-url> node --test tests/booking-flow.test.js

import { test } from "node:test";
import assert from "node:assert/strict";

const BASE_URL = process.env.BASE_URL || "http://localhost:5001";
const stamp = Date.now();

// ── Test fixtures ──────────────────────────────────────────
const testBusiness = {
  businessName: `Test Landscaping ${stamp}`,
  businessType: "Home services",
  address: {
    street: "1 Test St",
    city: "Testville",
    state: "NJ",
    zip: "07001",
  },
  phone: "5551234567",
  email: `test.biz.${stamp}@example.com`,
  description: "A test business created by automated tests.",
  keywords: ["test", "automation"],
  username: `testbiz${stamp}`,
  password: "TestPass123",
};

const testResident = {
  firstName: "Booking",
  lastName: "Tester",
  email: `booking.tester.${stamp}@example.com`,
  password: "TestPass123",
  role: "resident",
};

let businessToken = null;
let businessId = null;
let residentToken = null;
let bookingId = null;

// ── Business registration & login ──────────────────────────
test("business registration fails with missing password", async () => {
  const res = await fetch(`${BASE_URL}/api/business/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...testBusiness, password: undefined }),
  });
  assert.equal(res.status, 400);
});

test("business registration succeeds with valid data", async () => {
  const res = await fetch(`${BASE_URL}/api/business/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(testBusiness),
  });
  assert.equal(res.status, 201);
});

test("business registration fails with duplicate email", async () => {
  const res = await fetch(`${BASE_URL}/api/business/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(testBusiness),
  });
  assert.equal(res.status, 409);
});

test("business login fails with wrong password", async () => {
  const res = await fetch(`${BASE_URL}/api/business/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: testBusiness.email, password: "wrongpass" }),
  });
  assert.equal(res.status, 401);
});

test("business login succeeds and returns full profile", async () => {
  const res = await fetch(`${BASE_URL}/api/business/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: testBusiness.email,
      password: testBusiness.password,
    }),
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.token);
  assert.equal(data.business.businessName, testBusiness.businessName);
  assert.ok(!data.business.password, "password should never be returned");
  businessToken = data.token;
  businessId = data.business.id;
});

// ── Set business availability ──────────────────────────────
test("business can set availability", async () => {
  const res = await fetch(
    `${BASE_URL}/api/business/${businessId}/availability`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${businessToken}`,
      },
      body: JSON.stringify({
        availability: {
          days: ["Monday", "Wednesday", "Friday"],
          timeSlots: ["9:00 AM", "10:00 AM", "2:00 PM"],
          appointmentDuration: 60,
        },
      }),
    },
  );
  assert.equal(res.status, 200);
});

// ── Resident setup ─────────────────────────────────────────
test("resident registers and logs in", async () => {
  await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(testResident),
  });

  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: testResident.email,
      password: testResident.password,
    }),
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  residentToken = data.token;
});

// ── Full booking lifecycle ─────────────────────────────────
test("resident can find the newly registered business in search", async () => {
  const res = await fetch(
    `${BASE_URL}/api/search?q=${encodeURIComponent(testBusiness.businessName)}`,
    { headers: { Authorization: `Bearer ${residentToken}` } },
  );
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.businesses.some((b) => b._id === businessId));
});

test("resident creates a booking", async () => {
  const res = await fetch(`${BASE_URL}/api/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${residentToken}`,
    },
    body: JSON.stringify({
      businessId,
      businessName: testBusiness.businessName,
      date: "2026-12-01",
      time: "9:00 AM",
      note: "Automated test booking",
    }),
  });
  assert.equal(res.status, 201);
  const data = await res.json();
  assert.equal(data.booking.status, "pending");
  bookingId = data.booking._id;
});

test("booking appears in resident's booking list", async () => {
  const res = await fetch(`${BASE_URL}/api/bookings/my`, {
    headers: { Authorization: `Bearer ${residentToken}` },
  });
  const data = await res.json();
  assert.ok(data.bookings.some((b) => b._id === bookingId));
});

test("booking appears in business's booking list", async () => {
  const res = await fetch(`${BASE_URL}/api/bookings/business`, {
    headers: { Authorization: `Bearer ${businessToken}` },
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.bookings.some((b) => b._id === bookingId));
});

test("resident cannot confirm their own booking (only business can)", async () => {
  const res = await fetch(`${BASE_URL}/api/bookings/${bookingId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${residentToken}`,
    },
    body: JSON.stringify({ status: "confirmed" }),
  });
  // Residents can only cancel, not confirm — should be rejected
  assert.equal(res.status, 403);
});

test("business confirms the booking", async () => {
  const res = await fetch(`${BASE_URL}/api/bookings/${bookingId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${businessToken}`,
    },
    body: JSON.stringify({ status: "confirmed" }),
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.booking.status, "confirmed");
});

test("resident can cancel their confirmed booking", async () => {
  const res = await fetch(`${BASE_URL}/api/bookings/${bookingId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${residentToken}`,
    },
    body: JSON.stringify({ status: "cancelled" }),
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.booking.status, "cancelled");
});

test("another resident cannot access this booking", async () => {
  // Register a second resident to test cross-user access
  const otherResident = {
    firstName: "Other",
    lastName: "Person",
    email: `other.${stamp}@example.com`,
    password: "TestPass123",
    role: "resident",
  };
  await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(otherResident),
  });
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: otherResident.email,
      password: otherResident.password,
    }),
  });
  const { token: otherToken } = await loginRes.json();

  const res = await fetch(`${BASE_URL}/api/bookings/${bookingId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${otherToken}`,
    },
    body: JSON.stringify({ status: "cancelled" }),
  });
  assert.equal(res.status, 403);
});
