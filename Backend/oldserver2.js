// server.js
import dotenv from "dotenv";
dotenv.config(); // must be first

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Anthropic from "@anthropic-ai/sdk";

import authRoutes from "./routes/auth.js";
import searchRoutes from "./routes/search-route.js";
import businessRoutes from "./routes/business-routes.js";
import bookingRoutes from "./routes/bookings.js";

const app = express();
const PORT = process.env.PORT || 5001;

// ── Middleware ──────────────────────────────────────────
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: false,
  }),
);
app.use(express.json());

// ── MongoDB ─────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// ── Anthropic ───────────────────────────────────────────
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ── Routes ──────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/bookings", bookingRoutes);

// ── AI job route ────────────────────────────────────────
app.post("/api/ai-job", async (req, res) => {
  try {
    const { job, expertise } = req.body;

    if (!job?.trim() || !expertise?.trim()) {
      return res.status(400).json({ error: "Job and expertise are required" });
    }

    const prompt = `
A homeowner needs help with this task:

Job: ${job}
Expertise: ${expertise}

Respond using Markdown with this format:

# Household Job Assessment

## Difficulty
...

## Tools Required
- Tool 1
- Tool 2

## Estimated Time
...

## Safety Concerns
- Concern 1
- Concern 2

## Recommendation
...

## Approximate Cost
...`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ answer: message.content[0].text });
  } catch (error) {
    console.error("AI error:", error);
    res.status(500).json({ error: "AI request failed" });
  }
});

// ── Health check ────────────────────────────────────────
app.get("/test", (_, res) => res.json({ message: "Server is working!" }));

// ── Start ───────────────────────────────────────────────
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
