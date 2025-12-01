const { storeAndNotify } = require("./reportService");
const { sendEmail } = require("./nodemailerService");

async function generateScore(req, res) {
  const scores = {
    candidateId: req.body.candidateId,
    overall: Math.floor(Math.random() * 100),
    skills: [
      { name: "JavaScript", score: Math.floor(Math.random() * 100) },
      { name: "React", score: Math.floor(Math.random() * 100) },
      { name: "Node.js", score: Math.floor(Math.random() * 100) },
      { name: "MongoDB", score: Math.floor(Math.random() * 100) },
    ],
    gaps: ["Testing", "DevOps"],
  };
  // Store in Cosmos DB, trigger Azure Logic App, and robustly send email
  try {
    await storeAndNotify(req.body.candidateId, scores, req.body.email);
    // Send robust assessment report email directly
    if (req.body.email) {
      const html = `
        <div style="font-family:Segoe UI,Arial,sans-serif;max-width:600px;margin:auto;background:#f8fafc;padding:24px;border-radius:12px;">
          <h2 style="color:#2a3b4d;">Candidate Assessment Report</h2>
          <p><b>Candidate ID:</b> ${scores.candidateId}</p>
          <p><b>Overall Score:</b> ${scores.overall}</p>
          <h3 style="margin-top:24px;">Skill Breakdown</h3>
          <ul>
            ${scores.skills
              .map((s) => `<li><b>${s.name}:</b> ${s.score}</li>`)
              .join("")}
          </ul>
          <p><b>Skill Gaps:</b> ${scores.gaps.join(", ")}</p>
          <p style="margin-top:32px;font-size:13px;color:#888;">This is an automated message from the Candidate Assessment System.</p>
        </div>
      `;
      const text = `Assessment report for candidate ${
        scores.candidateId
      }:\nOverall Score: ${scores.overall}\nSkills: ${scores.skills
        .map((s) => `${s.name}: ${s.score}`)
        .join(", ")}\nSkill Gaps: ${scores.gaps.join(", ")}`;
      try {
        await sendEmail({
          to: req.body.email,
          subject: "Candidate Assessment Report",
          text,
          html,
        });
      } catch (emailErr) {
        console.error("Email sending error:", emailErr);
      }
    }
  } catch (err) {
    console.error("Report workflow error:", err);
  }
  res.json(scores);
}

function generateFeedback(req, res) {
  const feedback = {
    candidateId: req.body.candidateId,
    suggestions: [
      "Improve test coverage.",
      "Work on advanced React patterns.",
      "Practice database indexing.",
    ],
    codeSnippet: "function sum(a, b) { return a + b; }",
    action: "Approve/Reject",
  };
  res.json(feedback);
}

module.exports = { generateScore, generateFeedback };
