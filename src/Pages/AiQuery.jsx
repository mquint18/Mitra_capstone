// AiQuery.jsx

import { useState } from "react";

function AiQuery() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  async function askClaude() {
    const res = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    // Extract the text from Claude's response
    setResponse(data.content?.[0]?.text || "No response");
  }

  return (
    <div>
      <h2>Ask Mitra AI</h2>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask a question..."
      />

      <br />

      <button onClick={askClaude}>Ask Claude</button>

      <p>{response}</p>
    </div>
  );
}

export default AiQuery;
