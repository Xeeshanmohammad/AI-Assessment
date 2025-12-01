const mongoose = require("mongoose");
const { sendEmail } = require("./nodemailerService");
const { triggerAzureLogicApp } = require("./azureLogicApp");

const reportSchema = new mongoose.Schema({
  candidateId: String,
  report: Object,
  createdAt: { type: Date, default: Date.now },
});

const Report = mongoose.model("Report", reportSchema);

async function storeAndNotify(candidateId, report, email) {
  const saved = await Report.create({ candidateId, report });

  await triggerAzureLogicApp({ candidateId, report });

  if (email) {
    const html = `
      <div style="font-family:Segoe UI,Arial,sans-serif;max-width:600px;margin:auto;background:#f8fafc;padding:24px;border-radius:12px;">
        <h2 style="color:#2a3b4d;">Candidate Assessment Report</h2>
        <p><b>Candidate ID:</b> ${candidateId}</p>
        <p><b>Overall Score:</b> ${report.overall}</p>
        <h3 style="margin-top:24px;">Skill Breakdown</h3>
        <ul>
          ${report.skills
            .map((s) => `<li><b>${s.name}:</b> ${s.score}</li>`)
            .join("")}
        </ul>
        <p><b>Skill Gaps:</b> ${report.gaps.join(", ")}</p>
        <p style="margin-top:32px;font-size:13px;color:#888;">This is an automated message from the Candidate Assessment System.</p>
      </div>
    `;
    await sendEmail({
      to: email,
      subject: "Candidate Assessment Report",
      text: `Assessment report for candidate ${candidateId}:\n${JSON.stringify(
        report,
        null,
        2
      )}`,
      html,
    });
  }
  return saved;
}

module.exports = { storeAndNotify };
