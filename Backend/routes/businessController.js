// controllers/businessController.js  — add this login function

import bcrypt from "bcrypt";
import jwt    from "jsonwebtoken";
import Business from "../models/Business.js";

// ── Register ──────────────────────────────────────────────
export async function registerBusiness(req, res) {
  try {
    const { password, ...rest } = req.body;

    if (!password)
      return res.status(400).json({ message: "Password is required" });

    const existing = await Business.findOne({ email: rest.email });
    if (existing)
      return res.status(409).json({ message: "A business with this email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const business = new Business({ ...rest, password: hashedPassword });
    await business.save();

    res.status(201).json({
      message: "Business registered successfully!",
      business: { id: business._id, name: business.businessName, type: business.businessType },
    });
  } catch (error) {
    console.error("Business registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
}

// ── Login ─────────────────────────────────────────────────
export async function loginBusiness(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    // Find business by email, explicitly include password field
    const business = await Business.findOne({ email }).select("+password");
    if (!business)
      return res.status(401).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, business.password);
    if (!match)
      return res.status(401).json({ message: "Invalid email or password" });

    // Sign JWT
    const token = jwt.sign(
      { id: business._id, role: "business" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return token + safe business profile (no password)
    res.json({
      token,
      business: {
        id:           business._id,
        businessName: business.businessName,
        businessType: business.businessType,
        email:        business.email,
        phone:        business.phone,
        address:      business.address,
        keywords:     business.keywords,
        availability: business.availability,
      },
    });
  } catch (error) {
    console.error("Business login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
}
