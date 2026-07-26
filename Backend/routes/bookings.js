// routes/bookings.js
import express from "express";
import mongoose from "mongoose";
import { requireAuth } from "../middleware/auth.js";
import Business from "../models/Business.js";

const router = express.Router();

// ── Booking schema (inline for simplicity) ───────────────
const bookingSchema = new mongoose.Schema(
  {
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      required: true,
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    businessName: { type: String },
    date: { type: String, required: true },
    time: { type: String, required: true },
    note: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "declined", "cancelled", "completed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

// ── POST /api/bookings — resident creates a booking ──────
router.post("/", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "resident") {
      return res
        .status(403)
        .json({ message: "Only residents can make bookings" });
    }

    const { businessId, businessName, date, time, note } = req.body;

    if (!businessId || !date || !time) {
      return res
        .status(400)
        .json({ message: "businessId, date and time are required" });
    }

    // Verify business exists
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const booking = new Booking({
      residentId: req.user.id,
      businessId,
      businessName: businessName || business.businessName,
      date,
      time,
      note: note || "",
    });

    await booking.save();

    res.status(201).json({
      message: "Booking request sent!",
      booking,
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: "Booking failed" });
  }
});

// ── GET /api/bookings/my — resident sees their bookings ──
router.get("/my", requireAuth, async (req, res) => {
  try {
    const bookings = await Booking.find({ residentId: req.user.id })
      .populate("businessId", "businessName businessType phone email address")
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

// ── GET /api/bookings/business — business sees their bookings ──
router.get("/business", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "business") {
      return res.status(403).json({ message: "Business access only" });
    }

    const bookings = await Booking.find({ businessId: req.user.id })
      .populate("residentId", "firstName lastName email phone")
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    console.error("Get business bookings error:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

// ── PUT /api/bookings/:id — update booking status ────────
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Residents can only cancel their own bookings
    if (req.user.role === "resident") {
      if (booking.residentId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not your booking" });
      }
      if (status !== "cancelled") {
        return res
          .status(403)
          .json({ message: "Residents can only cancel bookings" });
      }
    }

    // Businesses can confirm, decline, or complete their bookings
    if (req.user.role === "business") {
      if (booking.businessId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not your booking" });
      }
    }

    booking.status = status;
    await booking.save();

    res.json({ message: "Booking updated", booking });
  } catch (error) {
    console.error("Update booking error:", error);
    res.status(500).json({ message: "Failed to update booking" });
  }
});

export default router;
