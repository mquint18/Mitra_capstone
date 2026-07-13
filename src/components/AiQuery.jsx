// AiQuery.jsx

import { useState } from "react";
import "./AiQuery.css";

function AiQuery() {
  const [job, setJob] = useState("");
  const [expertise, setExpertise] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function askClaude() {
    setLoading(true);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/api/ai-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job,
          expertise,
        }),
      });

      const data = await res.json();

      // Extract the text from Claude's response
      setResponse(data.answer || data.error || "No response");
    } catch (err) {
      console.error(err);
      setResponse("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div>
      <h2>Ask Mitra AI</h2>

      <input
        type="text"
        placeholder="Describe the household job"
        value={job}
        onChange={(e) => setJob(e.target.value)}
      />

      <br />
      <br />
      <select value={expertise} onChange={(e) => setExpertise(e.target.value)}>
        <option value="">Select Expertise</option>
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Professional">Professional</option>
      </select>

      <br />
      <br />

      <button onClick={askClaude} disabled={loading}>
        {loading ? "Thinking..." : "Ask Claude AI"}
      </button>

      {loading && (
        <div className="loading-box">
          <div className="spinner"></div>
          <h3>Mitra AI is evaluating your project...</h3>
          <p>Estimating difficulty, tools, time, and safety.</p>
        </div>
      )}

      <h3>AI Recommendation:</h3>

      <pre className="ai-response">{response}</pre>
    </div>
  );
}
export default AiQuery;
