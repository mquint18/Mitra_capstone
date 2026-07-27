// AiQuery.jsx

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import "./AiQuery.css";

function AiQuery() {
  const [job, setJob] = useState("");
  const [expertise, setExpertise] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function askClaude() {
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
    <div className="ai-query-wrap">
      <h2>Ask Mitra</h2>
      <h3>Ask Mitra is powered by Claude AI</h3>
      <h4>
        Type in the task or job you need to complete; ex. "I need to trim a
        tree". Then select your level of expertise in this type of work. Mitra
        will use ClaudeAI to tell you if this is a task you can take on yourself
        or if you should hire a professional.
      </h4>

      <input
        type="text"
        placeholder="Describe the household job"
        value={job}
        onChange={(e) => setJob(e.target.value)}
      />

      <br />

      <div className="expertise-options">
        {["Beginner", "Intermediate", "Professional"].map((level) => (
          <label
            key={level}
            className={`expertise-option ${expertise === level ? "selected" : ""}`}
          >
            <input
              type="radio"
              name="expertise"
              value={level}
              checked={expertise === level}
              onChange={(e) => setExpertise(e.target.value)}
            />
            {level}
          </label>
        ))}
      </div>
      <br />

      <button onClick={askClaude} disabled={loading}>
        {loading ? "Thinking..." : "Ask Mitra"}
      </button>

      {loading && (
        <div className="loading-box">
          <div className="spinner"></div>
          <h3>
            Mitra is evaluating your project... This may take a few seconds
          </h3>
          <p>Estimating difficulty, tools, time, and safety.</p>
        </div>
      )}
      {response && (
        <>
          <h3>AI Recommendation:</h3>
          <div className="ai-response">
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        </>
      )}
    </div>
  );
}
export default AiQuery;
