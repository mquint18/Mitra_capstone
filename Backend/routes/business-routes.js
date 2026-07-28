// routes/business.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Business from "../models/Business.js";
import { requireAuth } from "../middleware/auth.js"; // ← add this

import {
  registerBusiness,
  loginBusiness,
} from "../controllers/businessController.js";

const router = express.Router();

router.post("/register", registerBusiness);
router.post("/login", loginBusiness); // ← new

export default router;

// GET /api/business/:id — fetch single business
router.get("/:id", async (req, res) => {
  try {
    const business = await Business.findById(req.params.id).select(
      "-password -username",
    );
    if (!business) return res.status(404).json({ message: "Not found" });
    res.json({ business });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch business" });
  }
});

// PUT /api/business/:id/availability — update availability
router.put("/:id/availability", requireAuth, async (req, res) => {
  try {
    const business = await Business.findByIdAndUpdate(
      req.params.id,
      { $set: { availability: req.body.availability } },
      { new: true },
    ).select("-password -username");

    if (!business) return res.status(404).json({ message: "Not found" });
    res.json({ business });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update availability" });
  }
});
