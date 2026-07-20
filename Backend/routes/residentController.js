// controllers/residentController.js
import bcrypt from "bcrypt";
import jwt    from "jsonwebtoken";
import Resident from "../models/Resident.js";

// ── Register ──────────────────────────────────────────────
export async function registerResident(req, res) {
  try {
    const { firstName, lastName, email, password, address, suburb, phone } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "First name, last name, email and password are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const existing = await Resident.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const resident = new Resident({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      address:  address  || "",
      suburb:   suburb   || "",
      phone:    phone    || "",
    });

    await resident.save();

    res.status(201).json({ message: "Account created successfully. Please sign in." });

  } catch (error) {
    console.error("Resident register error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
}

// ── Login ─────────────────────────────────────────────────
export async function loginResident(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Explicitly fetch password field (select: false by default)
    const resident = await Resident.findOne({ email, active: true }).select("+password");

    if (!resident) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, resident.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Sign JWT
    const token = jwt.sign(
      { id: resident._id, role: "resident" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return token + safe profile (no password)
    res.json({
      token,
      user: {
        id:        resident._id,
        firstName: resident.firstName,
        lastName:  resident.lastName,
        email:     resident.email,
        address:   resident.address,
        suburb:    resident.suburb,
        phone:     resident.phone,
        role:      resident.role,
      },
    });

  } catch (error) {
    console.error("Resident login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
}

// ── Get profile (protected) ───────────────────────────────
export async function getResidentProfile(req, res) {
  try {
    const resident = await Resident.findById(req.user.id);
    if (!resident) {
      return res.status(404).json({ message: "Resident not found" });
    }
    res.json({ user: resident });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
}
