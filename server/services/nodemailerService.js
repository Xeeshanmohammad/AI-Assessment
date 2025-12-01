const nodemailer = require("nodemailer");

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.example.com",
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || "user@example.com",
      pass: process.env.SMTP_PASS || "password",
    },
  });
}

async function sendEmail({ to, subject, text }) {
  const transporter = getTransporter();
  return transporter.sendMail({
    from: process.env.SMTP_FROM || "noreply@example.com",
    to,
    subject,
    text,
  });
}

module.exports = { sendEmail };
