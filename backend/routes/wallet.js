const express = require("express");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const protect = require("../middleware/auth");

const router = express.Router();

const todayStr = () => new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

// @route GET /api/wallet/balance
router.get("/balance", protect, async (req, res) => {
  res.json({ balance: req.user.balance });
});

// @route GET /api/wallet/history
router.get("/history", protect, async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(100);
  res.json({ transactions });
});

// @route POST /api/wallet/earn
// body: { type: "ad" | "task", amount: number, note?: string }
router.post("/earn", protect, async (req, res) => {
  try {
    const { type, amount, note } = req.body;

    if (!["ad", "task"].includes(type)) {
      return res.status(400).json({ message: "Invalid earn type" });
    }
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const user = req.user;
    const DAILY_LIMIT = Number(process.env.DAILY_EARN_LIMIT || 200);

    // Reset daily counter if it's a new day
    if (user.lastEarnDate !== todayStr()) {
      user.todayEarned = 0;
      user.lastEarnDate = todayStr();
    }

    // Basic fraud control — daily earning cap
    if (user.todayEarned + amount > DAILY_LIMIT) {
      return res.status(429).json({
        message: `Daily earning limit reached (Rs. ${DAILY_LIMIT}). Try again tomorrow.`,
      });
    }

    user.balance += amount;
    user.todayEarned += amount;
    await user.save();

    await Transaction.create({
      user: user._id,
      type,
      amount,
      note: note || (type === "ad" ? "Watched an ad" : "Completed a task"),
    });

    res.json({ balance: user.balance, todayEarned: user.todayEarned });
  } catch (err) {
    res.status(500).json({ message: "Could not process earning", error: err.message });
  }
});

module.exports = router;
