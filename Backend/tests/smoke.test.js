// tests/smoke.test.js
//
// Lightweight smoke tests using Node's built-in test runner (Node 18+).
// No extra dependencies needed — uses global fetch.
//
// Run with:  node --test tests/smoke.test.js
// Point at your deployed backend or localhost via BASE_URL env var:
//   BASE_URL=https://mitra-backend-djc8.onrender.com node --test tests/smoke.test.js

import { test, before } from "node:test";
import assert from "node:assert/strict";

const BASE_URL = process.env.BASE_URL || "http://localhost:5001";

// Unique email per run so repeated test runs don't collide
const stamp = Date.now();
const testResident = {
  firstName: "Test",
  lastName: "User",
  email: `test.user.${stamp}@example.com`,
  password: "TestPass123",
  role: "resident",
};

let residentToken = null;

// ── Health check ──────────────────────────────────────────
test("server is reachable", async () => {
  const res = await fetch(`${BASE_URL}/test`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.message, "Server is working!");
});

// ── Registration edge cases ───────────────────────────────
test("register fails with missing fields", async () => {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "incomplete@example.com" }),
  });
  assert.equal(res.status, 400);
});

test("register fails with short password", async () => {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...testResident,
      email: `short.${stamp}@example.com`,
      password: "123",
    }),
  });
  assert.equal(res.status, 400);
});

test("register succeeds with valid data", async () => {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(testResident),
  });
  assert.equal(res.status, 201);
});

test("register fails with duplicate email", async () => {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(testResident),
  });
  assert.equal(res.status, 409);
});

// ── Login edge cases ──────────────────────────────────────
test("login fails with wrong password", async () => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: testResident.email,
      password: "wrongpassword",
    }),
  });
  assert.equal(res.status, 401);
});

test("login fails with nonexistent email", async () => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "nobody@nowhere.com",
      password: "whatever123",
    }),
  });
  assert.equal(res.status, 401);
});

test("login succeeds with correct credentials", async () => {
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
  assert.ok(data.token, "expected a token in response");
  assert.equal(data.user.role, "resident");
  residentToken = data.token;
});

// ── Protected route access control ────────────────────────
test("admin route rejects request with no token", async () => {
  const res = await fetch(`${BASE_URL}/api/admin/stats`);
  assert.equal(res.status, 401);
});

test("admin route rejects resident token", async () => {
  const res = await fetch(`${BASE_URL}/api/admin/stats`, {
    headers: { Authorization: `Bearer ${residentToken}` },
  });
  assert.equal(res.status, 403);
});

test("bookings/my requires auth", async () => {
  const res = await fetch(`${BASE_URL}/api/bookings/my`);
  assert.equal(res.status, 401);
});

test("bookings/my works with valid resident token", async () => {
  const res = await fetch(`${BASE_URL}/api/bookings/my`, {
    headers: { Authorization: `Bearer ${residentToken}` },
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(Array.isArray(data.bookings));
});

// ── Search edge cases ──────────────────────────────────────
test("search handles special characters without crashing", async () => {
  const res = await fetch(
    `${BASE_URL}/api/search?q=${encodeURIComponent("<script>alert(1)</script>")}`,
    { headers: { Authorization: `Bearer ${residentToken}` } },
  );
  assert.equal(res.status, 200);
});

test("search handles empty query", async () => {
  const res = await fetch(`${BASE_URL}/api/search?q=`, {
    headers: { Authorization: `Bearer ${residentToken}` },
  });
  assert.equal(res.status, 200);
});

test("search with nonsense query returns empty results, not error", async () => {
  const res = await fetch(`${BASE_URL}/api/search?q=zzzznonexistentzzzz`, {
    headers: { Authorization: `Bearer ${residentToken}` },
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.businesses.length, 0);
});

// ── Booking edge cases ─────────────────────────────────────
test("booking fails without required fields", async () => {
  const res = await fetch(`${BASE_URL}/api/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${residentToken}`,
    },
    body: JSON.stringify({}),
  });
  assert.equal(res.status, 400);
});

test("booking fails for nonexistent business", async () => {
  const res = await fetch(`${BASE_URL}/api/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${residentToken}`,
    },
    body: JSON.stringify({
      businessId: "000000000000000000000000",
      date: "2026-12-01",
      time: "10:00 AM",
    }),
  });
  assert.equal(res.status, 404);
});
