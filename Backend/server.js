// server.js

import dotenv from "dotenv";

dotenv.config();

console.log(Object.keys(process.env).filter((key) => key.includes("ANTH")));

console.log("=== THIS IS MY SERVER.JS ===");
console.log(import.meta.url);

import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";

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

        Required expertise level:
        ${expertise}


        Provide:
        1. Difficulty level
        2. Tools required
        3. Estimated time
        4. Safety concerns
        5. Whether they should hire a professional

        `;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",

      max_tokens: 500,

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

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} `);
});
