// routes/reviews.js
import express from "express";
import mongoose from "mongoose";
import Review from "../models/Review.js";
import { Booking } from "./bookings.js"; // Booking is exported from bookings.js
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// ── POST /api/reviews — resident leaves a review ──────────
router.post("/", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "resident") {
      return res.status(403).json({ message: "Only residents can leave reviews" });
    }

    const { bookingId, rating, comment } = req.body;

    if (!bookingId || !rating) {
      return res.status(400).json({ message: "bookingId and rating are required" });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.residentId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your booking" });
    }
    if (booking.status !== "completed") {
      return res.status(400).json({ message: "You can only review completed bookings" });
    }

    const existing = await Review.findOne({ bookingId });
    if (existing) {
      return res.status(409).json({ message: "You already reviewed this booking" });
    }

    const review = new Review({
      residentId: req.user.id,
      businessId: booking.businessId,
      bookingId,
      rating,
      comment: comment || "",
    });

    await review.save();

    res.status(201).json({ message: "Review submitted", review });
  } catch (error) {
    console.error("Review submit error:", error);
    res.status(500).json({ message: "Failed to submit review" });
  }
});

// ── GET /api/reviews/business/:businessId — public list ──
router.get("/business/:businessId", async (req, res) => {
  try {
    const reviews = await Review.find({ businessId: req.params.businessId })
      .populate("residentId", "firstName lastName")
      .sort({ createdAt: -1 });

    res.json({ reviews });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

// ── GET /api/reviews/business/:businessId/summary — avg + count ──
router.get("/business/:businessId/summary", async (req, res) => {
  try {
    const result = await Review.aggregate([
      { $match: { businessId: new mongoose.Types.ObjectId(req.params.businessId) } },
      { $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    const summary = result[0]
      ? { avgRating: Math.round(result[0].avgRating * 10) / 10, count: result[0].count }
      : { avgRating: 0, count: 0 };

    res.json(summary);
  } catch (error) {
    console.error("Review summary error:", error);
    res.status(500).json({ message: "Failed to fetch review summary" });
  }
});

// ── GET /api/reviews/mine — resident checks which bookings they've reviewed ──
router.get("/mine", requireAuth, async (req, res) => {
  try {
    const reviews = await Review.find({ residentId: req.user.id }).select("bookingId");
    res.json({ reviewedBookingIds: reviews.map((r) => r.bookingId.toString()) });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your reviews" });
  }
});

export default router;
