const express = require("express");
const User = require("../models/User");
const protect = require("../middleware/auth");

const router = express.Router();

// @route GET /api/referral/me
router.get("/me", protect, async (req, res) => {
  res.json({
    referralCode: req.user.referralCode,
    referralCount: req.user.referralCount,
  });
});

// @route GET /api/referral/list — people this user referred
router.get("/list", protect, async (req, res) => {
  const referred = await User.find({ referredBy: req.user._id }).select("name phone createdAt");
  res.json({ referred });
});

module.exports = router;
