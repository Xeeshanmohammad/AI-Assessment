// Send assessment report email
export async function sendAssessmentEmail(payload) {
  const res = await fetch("http://localhost:4001/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to send email");
  return await res.json();
}
// API service for backend integration
export async function generateScore(payload) {
  const res = await fetch("http://localhost:4001/generate-score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to fetch score");
  return await res.json();
}

export async function generateFeedback(payload) {
  const res = await fetch("http://localhost:4001/generate-feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to fetch feedback");
  return await res.json();
}
