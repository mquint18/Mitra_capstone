// routes/search.js
import express from "express";
import Business from "../models/Business.js";

const router = express.Router();

// GET /api/search?q=lawn+care&category=Home+services&neighborhood=Maplewood&page=1
// Public — no login required
router.get("/", async (req, res) => {
  try {
    const { q, category, neighborhood, page = 1, limit = 10 } = req.query;

    const query = {};

    if (q && q.trim()) {
      query.$text = { $search: q.trim() };
    }

    if (category && category !== "all") {
      query.businessType = category;
    }

    if (neighborhood && neighborhood !== "all") {
      query.neighborhoods = neighborhood;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const businesses = await Business.find(query, {
      password: 0,
      username: 0,
    })
      .sort(q ? { score: { $meta: "textScore" } } : { createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Business.countDocuments(query);

    res.json({
      businesses,
      total,
      page:       Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Search failed" });
  }
});

// GET /api/search/categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Business.distinct("businessType");
    res.json({ categories: ["all", ...categories.sort()] });
  } catch (error) {
    console.error("Categories error:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

// GET /api/search/:id
router.get("/:id", async (req, res) => {
  try {
    const business = await Business.findById(req.params.id).select("-password -username");
    if (!business) return res.status(404).json({ message: "Business not found" });
    res.json({ business });
  } catch (error) {
    console.error("Get business error:", error);
    res.status(500).json({ message: "Failed to fetch business" });
  }
});

export default router;
