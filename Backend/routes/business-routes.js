// routes/business.js
import express from "express";
import { registerBusiness, loginBusiness } from "../controllers/businessController.js";

const router = express.Router();

router.post("/register", registerBusiness);
router.post("/login",    loginBusiness);      // ← new

export default router;
