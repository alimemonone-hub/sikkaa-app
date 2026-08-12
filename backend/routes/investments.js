const express = require("express");
const router = express.Router();
const Investment = require("../models/Investment");
const protect = require("../middleware/auth");

router.get("/my-investments", protect, async (req, res) => {
  const investments = await Investment.find({ user: req.user._id })
    .populate("product", "name price dailyReturn")
    .sort({ createdAt: -1 });
  res.json({ investments });
});

module.exports = router;