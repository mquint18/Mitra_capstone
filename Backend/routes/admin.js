// routes/admin.js
import express from "express";
import { requireAuth } from "../middleware/auth.js";
import Business from "../models/Business.js";
import Resident from "../models/Resident.js";
import { Booking } from "./bookings.js";

const router = express.Router();

// All admin routes require auth + admin role
function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }
    next();
  });
}

// ── GET /api/admin/stats ──────────────────────────────────
router.get("/stats", requireAdmin, async (req, res) => {
  try {
    const [businesses, residents, bookings, pending] = await Promise.all([
      Business.countDocuments(),
      Resident.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ status: "pending" }),
    ]);
    res.json({ businesses, residents, bookings, pending });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

// ── GET /api/admin/businesses ─────────────────────────────
router.get("/businesses", requireAdmin, async (req, res) => {
  try {
    const businesses = await Business.find()
      .select("-password -username")
      .sort({ createdAt: -1 });
    res.json({ businesses });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch businesses" });
  }
});

// ── DELETE /api/admin/businesses/:id ─────────────────────
router.delete("/businesses/:id", requireAdmin, async (req, res) => {
  try {
    await Business.findByIdAndDelete(req.params.id);
    res.json({ message: "Business deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete business" });
  }
});

// ── GET /api/admin/residents ──────────────────────────────
router.get("/residents", requireAdmin, async (req, res) => {
  try {
    const residents = await Resident.find()
      .select("-password")
      .sort({ createdAt: -1 });
    res.json({ residents });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch residents" });
  }
});

// ── DELETE /api/admin/residents/:id ──────────────────────
router.delete("/residents/:id", requireAdmin, async (req, res) => {
  try {
    await Resident.findByIdAndDelete(req.params.id);
    res.json({ message: "Resident deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete resident" });
  }
});

// ── GET /api/admin/bookings ───────────────────────────────
router.get("/bookings", requireAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("residentId", "firstName lastName email")
      .populate("businessId", "businessName businessType")
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

export default router;
