require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const bodyParser = require("body-parser");
const { sendEmail } = require("./services/nodemailerService");


const connectDB = require("./services/db");
app.use(bodyParser.json());



const { generateScore } = require("./services/assessmentService");

app.post("/api/generate-score", generateScore);

app.use(cors());
app.use(express.json());

const assessmentRoutes = require("./routes/assessmentRoutes");
app.use("/", assessmentRoutes);

app.post("/api/send-email", async (req, res) => {
  const { to, subject, text, html } = req.body;
  try {
    const info = await sendEmail({ to, subject, text, html });
    res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};
startServer();
