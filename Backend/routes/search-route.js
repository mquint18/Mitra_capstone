// routes/search.js
import express from "express";
import Business from "../models/Business.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET /api/search?q=lawn+care&category=Home+services&page=1
router.get("/", requireAuth, async (req, res) => {
  try {
    const { q, category, page = 1, limit = 10 } = req.query;

    const query = { active: true };

    // Full-text search across name, description, keywords
    if (q && q.trim()) {
      query.$text = { $search: q.trim() };
    }

    // Optional category filter
    if (category && category !== "all") {
      query.category = category;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const businesses = await Business.find(query, {
      // exclude password from results
      password: 0,
    })
      .sort(q ? { score: { $meta: "textScore" } } : { createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Business.countDocuments(query);

    res.json({
      businesses,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Search failed" });
  }
});

// GET /api/search/categories — distinct category list for filter dropdown
router.get("/categories", requireAuth, async (req, res) => {
  try {
    const categories = await Business.distinct("category", { active: true });
    res.json({ categories: ["all", ...categories.sort()] });
  } catch (error) {
    console.error("Categories error:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

// GET /api/search/:id — single business profile
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const business = await Business.findById(req.params.id).select("-password");
    if (!business || !business.active) {
      return res.status(404).json({ message: "Business not found" });
    }
    res.json({ business });
  } catch (error) {
    console.error("Get business error:", error);
    res.status(500).json({ message: "Failed to fetch business" });
  }
});

export default router;
