// Example: Serve candidate list (replace with DB in production)
const express = require("express");
const router = express.Router();

router.get("/candidates", (req, res) => {
  // In production, fetch from DB
  const candidates = [
    { id: "1", name: "Alice Johnson" },
    { id: "2", name: "Bob Smith" },
    { id: "3", name: "Charlie Lee" },
  ];
  res.json(candidates);
});

const {
  generateScore,
  generateFeedback,
} = require("../services/assessmentService");

// /generate-score endpoint
router.post("/generate-score", generateScore);

// /generate-feedback endpoint
router.post("/generate-feedback", generateFeedback);

module.exports = router;
