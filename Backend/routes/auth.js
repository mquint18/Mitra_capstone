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
