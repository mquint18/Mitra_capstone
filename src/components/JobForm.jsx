//JobForm.jsx

import { useState } from "react";

function JobForm() {
  const [job, setJob] = useState("");
  const [expertise, setExpertise] = useState("");
  const [response, setResponse] = useState("");

  async function submitJob(e) {
    e.preventDefault();

    const result = await fetch("http://localhost:5000/api/ai-job", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        job,
        expertise,
      }),
    });

    const data = await result.json();

    setResponse(data.answer);
  }

  return (
    <div>
      <h2>Household Job Helper</h2>

      <form onSubmit={submitJob}>
        <input
          type="text"
          placeholder="Describe your job"
          value={job}
          onChange={(e) => setJob(e.target.value)}
        />

        <select
          value={expertise}
          onChange={(e) => setExpertise(e.target.value)}
        >
          <option value="">Select Expertise</option>

          <option value="Beginner">Beginner</option>

          <option value="Intermediate">Intermediate</option>

          <option value="Professional">Professional</option>
        </select>

        <button>Ask AI</button>
      </form>

      <h3>AI Recommendation:</h3>

      <p>{response}</p>
    </div>
  );
}

export default JobForm;
