// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import searchRoutes from "./routes/search-route.js";
import businessRoutes from "./routes/business-routes.js";
import bookingRoutes from "./routes/bookings.js";
import aiRoutes from "./routes/ai.js";
import adminRoutes from "./routes/admin.js";

const app = express();
const PORT = process.env.PORT || 5001;

// ── Middleware ──

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mitra-project.onrender.com",
    ].filter(Boolean),
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: false,
  }),
);
app.use(express.json());

// ── Database ──
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB error:", err);
    process.exit(1);
  });

// ── Routes ──
app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);

// ── Health check ──
app.get("/test", (_, res) => res.json({ message: "Server is working!" }));

// ── Start ──
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
