const Commission = require("../models/commission");
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
// @route GET /api/referral/stats
router.get("/stats", protect, async (req, res) => {
  try {
    const referredUsers = await User.find({ referredBy: req.user._id }).select("_id");

    const commissions = await Commission.find({ user: req.user._id });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCommission = commissions
      .filter(c => new Date(c.createdAt) >= today)
      .reduce((sum, c) => sum + c.amount, 0);

    const totalIncome = commissions.reduce((sum, c) => sum + c.amount, 0);

    res.json({
      referralCount: referredUsers.length,
      todayCommission,
      totalIncome,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
