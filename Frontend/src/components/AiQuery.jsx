// AiQuery.jsx
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import "./AiQuery.css";

function AiQuery() {
  const [job, setJob] = useState("");
  const [expertise, setExpertise] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_API_URL || "http://localhost:5001";

  async function askClaude() {
    if (!job.trim() || !expertise) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch(`${API}/api/ai/job`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job, expertise }),
      });
      const data = await res.json();
      setResponse(data.answer || data.error || "No response");
    } catch (_) {
      setResponse("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ai-wrap">
      {/* ── Left panel: input ── */}
      <div className="ai-panel-left">
        <p className="ai-eyebrow">Powered by Claude AI</p>
        <h2 className="ai-title">Ask Mitra</h2>
        <p className="ai-lead">
          Describe a household task and we'll tell you what's involved — and
          whether to DIY or call a professional.
        </p>

        <div className="ai-field">
          <label htmlFor="job-input">What do you need help with?</label>
          <input
            id="job-input"
            type="text"
            placeholder='e.g. "I need to trim a large tree"'
            value={job}
            onChange={(e) => setJob(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askClaude()}
          />
        </div>

        <div className="ai-field">
          <label>Your experience level</label>
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
        </div>

        <button
          className="ai-btn"
          onClick={askClaude}
          disabled={loading || !job.trim() || !expertise}
        >
          {loading ? "Thinking…" : "Ask Mitra"}
        </button>

        {/* Tips */}
        <div className="ai-tips">
          <p className="ai-tips-label">Tips for better results</p>
          <ul>
            <li>Be specific — "fix a leaky tap under the kitchen sink"</li>
            <li>Mention any tools you already have</li>
            <li>Include any safety concerns you have</li>
          </ul>
        </div>
      </div>

      {/* ── Right panel: response ── */}
      <div className="ai-panel-right">
        {loading && (
          <div className="loading-box">
            <div className="spinner" />
            <h3>Mitra is evaluating your project…</h3>
            <p>Estimating difficulty, tools, time, and safety.</p>
          </div>
        )}

        {!loading && !response && (
          <div className="ai-empty">
            <div className="ai-empty-icon">✦</div>
            <p>Your assessment will appear here once you submit a job.</p>
          </div>
        )}

        {!loading && response && (
          <>
            <p className="ai-response-label">AI Recommendation</p>
            <div className="ai-response">
              <ReactMarkdown>{response}</ReactMarkdown>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AiQuery;
