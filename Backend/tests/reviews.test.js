// tests/reviews.test.js
//
// Tests the review feature: leaving a review requires a completed booking
// that belongs to the reviewer, and prevents duplicate reviews.
//
// Run with:  BASE_URL=<your-backend-url> node --test tests/reviews.test.js

import { test } from "node:test";
import assert from "node:assert/strict";

const BASE_URL = process.env.BASE_URL || "http://localhost:5001";
const stamp = Date.now();

const testBusiness = {
  businessName: `Review Test Biz ${stamp}`,
  businessType: "Home services",
  address: { street: "1 Test St", city: "Testville", state: "NJ", zip: "07001" },
  phone: "5551234567",
  email: `review.biz.${stamp}@example.com`,
  description: "Test business for review tests.",
  keywords: ["test"],
  username: `reviewbiz${stamp}`,
  password: "TestPass123",
};

const testResident = {
  firstName: "Review",
  lastName: "Tester",
  email: `review.tester.${stamp}@example.com`,
  password: "TestPass123",
  role: "resident",
};

let businessToken, businessId, residentToken, bookingId;

test("setup: register and log in business + resident", async () => {
  await fetch(`${BASE_URL}/api/business/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(testBusiness),
  });
  const bizLogin = await fetch(`${BASE_URL}/api/business/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: testBusiness.email, password: testBusiness.password }),
  });
  const bizData = await bizLogin.json();
  businessToken = bizData.token;
  businessId = bizData.business.id;

  await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(testResident),
  });
  const resLogin = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: testResident.email, password: testResident.password }),
  });
  const resData = await resLogin.json();
  residentToken = resData.token;

  assert.ok(businessToken && residentToken);
});

test("setup: create and confirm a booking, then mark it completed", async () => {
  const bookRes = await fetch(`${BASE_URL}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${residentToken}` },
    body: JSON.stringify({
      businessId,
      businessName: testBusiness.businessName,
      date: "2026-12-01",
      time: "9:00 AM",
      note: "Review test booking",
    }),
  });
  const bookData = await bookRes.json();
  bookingId = bookData.booking._id;

  // Business confirms it
  await fetch(`${BASE_URL}/api/bookings/${bookingId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${businessToken}` },
    body: JSON.stringify({ status: "confirmed" }),
  });

  // Business marks it completed
  const completeRes = await fetch(`${BASE_URL}/api/bookings/${bookingId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${businessToken}` },
    body: JSON.stringify({ status: "completed" }),
  });
  assert.equal(completeRes.status, 200);
});

test("cannot review without rating", async () => {
  const res = await fetch(`${BASE_URL}/api/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${residentToken}` },
    body: JSON.stringify({ bookingId }),
  });
  assert.equal(res.status, 400);
});

test("cannot review with rating out of range", async () => {
  const res = await fetch(`${BASE_URL}/api/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${residentToken}` },
    body: JSON.stringify({ bookingId, rating: 7 }),
  });
  assert.equal(res.status, 400);
});

test("cannot review a booking that isn't yours", async () => {
  const otherResident = {
    firstName: "Other", lastName: "Reviewer",
    email: `other.reviewer.${stamp}@example.com`, password: "TestPass123", role: "resident",
  };
  await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(otherResident),
  });
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: otherResident.email, password: otherResident.password }),
  });
  const { token: otherToken } = await loginRes.json();

  const res = await fetch(`${BASE_URL}/api/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${otherToken}` },
    body: JSON.stringify({ bookingId, rating: 5 }),
  });
  assert.equal(res.status, 403);
});

test("resident can submit a valid review", async () => {
  const res = await fetch(`${BASE_URL}/api/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${residentToken}` },
    body: JSON.stringify({ bookingId, rating: 5, comment: "Great service!" }),
  });
  assert.equal(res.status, 201);
  const data = await res.json();
  assert.equal(data.review.rating, 5);
});

test("cannot submit a second review for the same booking", async () => {
  const res = await fetch(`${BASE_URL}/api/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${residentToken}` },
    body: JSON.stringify({ bookingId, rating: 4 }),
  });
  assert.equal(res.status, 409);
});

test("review appears in the business's public review list", async () => {
  const res = await fetch(`${BASE_URL}/api/reviews/business/${businessId}`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.reviews.some((r) => r.bookingId === bookingId || r.bookingId?.toString?.() === bookingId));
});

test("review summary returns correct average and count", async () => {
  const res = await fetch(`${BASE_URL}/api/reviews/business/${businessId}/summary`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.count, 1);
  assert.equal(data.avgRating, 5);
});

test("cannot review a booking that is still pending", async () => {
  // create a second, unconfirmed booking
  const bookRes = await fetch(`${BASE_URL}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${residentToken}` },
    body: JSON.stringify({
      businessId,
      businessName: testBusiness.businessName,
      date: "2026-12-05",
      time: "10:00 AM",
    }),
  });
  const { booking } = await bookRes.json();

  const res = await fetch(`${BASE_URL}/api/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${residentToken}` },
    body: JSON.stringify({ bookingId: booking._id, rating: 5 }),
  });
  assert.equal(res.status, 400);
});
