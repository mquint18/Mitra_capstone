// routes/auth.js  — full file including resident routes
import express from "express";
import {
  registerResident,
  loginResident,
  getResidentProfile,
} from "../controllers/residentController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerResident); // POST /api/auth/register
router.post("/login", loginResident); // POST /api/auth/login
router.get("/me", requireAuth, getResidentProfile); // GET  /api/auth/me

export default router;

// PUT /api/auth/profile — update resident profile
router.put("/profile", requireAuth, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address, suburb } = req.body;
    const resident = await Resident.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, email, phone, address, suburb },
      { returnDocument: "after" },
    ).select("-password");

    if (!resident)
      return res.status(404).json({ message: "Resident not found" });

    res.json({ message: "Profile updated", user: resident });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});
