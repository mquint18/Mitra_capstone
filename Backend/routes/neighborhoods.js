// routes/neighborhoods.js
import express from "express";
import Neighborhood from "../models/Neighborhood.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }
    next();
  });
}

// GET /api/neighborhoods — public, list active neighborhoods
router.get("/", async (req, res) => {
  try {
    const neighborhoods = await Neighborhood.find({ active: true }).sort({ name: 1 });
    res.json({ neighborhoods });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch neighborhoods" });
  }
});

// POST /api/neighborhoods — admin only, add a new neighborhood
router.post("/", requireAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }
    const existing = await Neighborhood.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({ message: "That neighborhood already exists" });
    }
    const neighborhood = new Neighborhood({ name: name.trim() });
    await neighborhood.save();
    res.status(201).json({ neighborhood });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add neighborhood" });
  }
});

// PUT /api/neighborhoods/:id — admin only, rename or toggle active
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const { name, active } = req.body;
    const update = {};
    if (name !== undefined) update.name = name.trim();
    if (active !== undefined) update.active = active;

    const neighborhood = await Neighborhood.findByIdAndUpdate(
      req.params.id,
      update,
      { returnDocument: "after" }
    );
    if (!neighborhood) return res.status(404).json({ message: "Not found" });
    res.json({ neighborhood });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update neighborhood" });
  }
});

// DELETE /api/neighborhoods/:id — admin only
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await Neighborhood.findByIdAndDelete(req.params.id);
    res.json({ message: "Neighborhood deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete neighborhood" });
  }
});

export default router;
