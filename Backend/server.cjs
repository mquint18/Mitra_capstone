// server.js

dotenv.config();

const app = express();

app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  try {
    const { prompt } = req.body;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    res.json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Unable to contact Claude",
    });
  }
});

app.listen(3000, () => {
  console.log("Server running");
});
