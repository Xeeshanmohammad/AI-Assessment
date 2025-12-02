import React, { useState } from "react";
import "./App.css";
import { generateScore, generateFeedback } from "./services/api";

import { useEffect } from "react";

function App() {
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [approved, setApproved] = useState(false);
  const [approveMsg, setApproveMsg] = useState("");

  // Fetch candidates from backend
  useEffect(() => {
    async function fetchCandidates() {
      try {
        const res = await fetch(
          "http://localhost:4001/api/candidates"
        );
        if (!res.ok) throw new Error("Failed to fetch candidates");
        const data = await res.json();
        setCandidates(data);
      } catch (err) {
        setCandidates([]);
      }
    }
    fetchCandidates();
  }, []);

  const handleEvaluate = async () => {
    if (!selected) return;
    setLoading(true);
    setScore(null);
    setFeedback(null);
    try {
      const data = await generateScore({ candidateId: selected.id });
      setScore(data);
    } catch (err) {
      alert("Error fetching score");
    }
    setLoading(false);
  };

  const handleFeedback = async () => {
    if (!selected) return;
    setFeedbackLoading(true);
    try {
      const data = await generateFeedback({ candidateId: selected.id });
      setFeedback(data);
    } catch (err) {
      alert("Error fetching feedback");
    }
    setFeedbackLoading(false);
  };

  return (
    <div className="App responsive-app">
      <header className="App-header responsive-header">
        <h2 className="responsive-title">Candidate Assessment Dashboard</h2>
        <div className="responsive-controls">
          <label>Select Candidate: </label>
          <select
            value={selected ? selected.id : ""}
            onChange={(e) => {
              const cand = candidates.find((c) => c.id === e.target.value);
              setSelected(cand);
              setScore(null);
              setFeedback(null);
            }}
          >
            <option value="">-- Choose --</option>
            {candidates.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleEvaluate}
            disabled={!selected || loading}
            style={{ marginLeft: 10 }}
          >
            {loading ? "Evaluating..." : "Trigger AI Evaluation"}
          </button>
        </div>

        {score && (
          <div className="score-card responsive-card">
            <h3>Score Report</h3>
            <div>
              <b>Overall Score:</b> {score.overall}
            </div>
            <div style={{ margin: "10px 0" }}>
              <b>Skills:</b>
              {score.skills.map((skill) => (
                <div key={skill.name} style={{ margin: "5px 0" }}>
                  {skill.name}:{" "}
                  <progress
                    value={skill.score}
                    max="100"
                    style={{ width: "100%" }}
                  />
                  {skill.score}
                </div>
              ))}
            </div>
            <div>
              <b>Skill Gaps:</b> {score.gaps.join(", ")}
            </div>
            {!feedback && (
              <button
                onClick={handleFeedback}
                disabled={feedbackLoading}
                style={{ marginTop: 15 }}
              >
                {feedbackLoading ? "Loading..." : "Show Feedback"}
              </button>
            )}
          </div>
        )}

        {feedback && (
          <div className="feedback-card responsive-card">
            <h3>AI Feedback</h3>
            <div>
              <b>Suggestions:</b>
              <ul>
                {feedback.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <b>Code Snippet:</b>
              <pre className="feedback-snippet">{feedback.codeSnippet}</pre>
            </div>
            <div>
              <button
                className="approve-btn"
                style={{ marginRight: 10 }}
                onClick={() => {
                  setApproved(true);
                  setApproveMsg("Feedback approved successfully!");
                }}
                disabled={approved}
              >
                {approved ? "Approved" : "Approve"}
              </button>
              <button
                className="reject-btn"
                onClick={() => {
                  const ok = window.confirm(
                    "Are you sure you want to reject this feedback?"
                  );
                  if (ok) {
                    window.location.reload();
                  }
                }}
              >
                Reject
              </button>
              {approveMsg && (
                <div
                  style={{ color: "#10b981", marginTop: 8, fontWeight: 600 }}
                >
                  {approveMsg}
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
