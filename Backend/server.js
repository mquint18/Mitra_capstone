// server.js

import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

dotenv.config();

console.log("=== THIS IS MY SERVER.JS ===");
console.log(import.meta.url);

import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";
import Business from "./models/Business.js";
import authRoutes from "./routes/auth.js";

const app = express();

// Allow React to communicate with Node
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: false,
  }),
);

// Allow JSON requests
app.use(express.json());

// ================================
// MongoDB Connection
// ================================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ================================
// Business Registration Route
// ================================

app.post("/api/business/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const business = new Business({
      ...req.body,
      password: hashedPassword,
    });

    await business.save();

    res.status(201).json({
      message: "Business registered successfully!",
      business: {
        id: business._id,
        name: business.businessName,
        type: business.businessType,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Registration failed",
    });
  }
});

// ================================
// Test Route
// ================================

app.get("/test", (req, res) => {
  res.json({
    message: "Server is working!",
  });
});

// ================================
// Start Server
// ================================

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post("/api/ai-job", async (req, res) => {
  try {
    const { job, expertise } = req.body;

    const prompt = `
      
A homeowner needs help with this task:

Job:
${job}

Expertise:
${expertise}

Respond using Markdown.

Use this format:

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

## Approximate cost`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",

      max_tokens: 1024,

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    res.json({
      answer: message.content[0].text,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "AI request failed",
    });
  }
});

app.get("/test", async (req, res) => {
  res.json({ message: "Test route works!" });
});

const PORT2 = 5002;

app.listen(PORT2, () => {
  console.log(`Server running on port ${PORT2} `);
});

app.use("/api/auth", authRoutes);
