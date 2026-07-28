// routes/ai.js
import express from "express";
import Anthropic from "@anthropic-ai/sdk";

const router = express.Router();

function buildPrompt(job, expertise) {
  return `A homeowner needs help with this task:

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
}

// POST /api/ai/job
router.post("/job", async (req, res) => {
  const { job, expertise } = req.body;

  if (!job?.trim() || !expertise?.trim()) {
    return res.status(400).json({ error: "Job and expertise are required" });
  }

  if (job.length > 1000) {
    return res.status(400).json({ error: "Job description too long" });
  }

  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [{ role: "user", content: buildPrompt(job, expertise) }],
    });

    res.json({ answer: message.content[0].text });
  } catch (error) {
    console.error("AI error:", error);
    res.status(500).json({ error: "AI request failed" });
  }
});

export default router;
