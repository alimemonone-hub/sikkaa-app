const express = require("express");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Withdrawal = require("../models/Withdrawal");
const protect = require("../middleware/auth");

const router = express.Router();

// @route POST /api/withdraw
// body: { amount, method: "jazzcash"|"easypaisa", accountNumber, accountName }
router.post("/", protect, async (req, res) => {
  try {
    const { amount, method, accountNumber, accountName } = req.body;
    const MIN_WITHDRAWAL = Number(process.env.MIN_WITHDRAWAL || 500);

    if (!["jazzcash", "easypaisa"].includes(method)) {
      return res.status(400).json({ message: "Invalid withdrawal method" });
    }
    if (!accountNumber || !accountName) {
      return res.status(400).json({ message: "Account number and name are required" });
    }
    if (!amount || amount < MIN_WITHDRAWAL) {
      return res.status(400).json({ message: `Minimum withdrawal is Rs. ${MIN_WITHDRAWAL}` });
    }

    const user = req.user;
    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct immediately so it can't be spent twice; refund if rejected later
    user.balance -= amount;
    await user.save();

    const withdrawal = await Withdrawal.create({
      user: user._id,
      amount,
      method,
      accountNumber,
      accountName,
    });

    await Transaction.create({
      user: user._id,
      type: "withdrawal",
      amount: -amount,
      note: `Withdrawal requested via ${method}`,
    });

    res.status(201).json({ message: "Withdrawal request submitted", withdrawal, balance: user.balance });
  } catch (err) {
    res.status(500).json({ message: "Withdrawal request failed", error: err.message });
  }
});

// @route GET /api/withdraw/history
router.get("/history", protect, async (req, res) => {
  const withdrawals = await Withdrawal.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ withdrawals });
});

module.exports = router;
