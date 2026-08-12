const isAdmin = require("../middleware/isAdmin");
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
// @route PUT /api/withdraw/admin/:id/status
router.put("/admin/:id/status", protect, isAdmin, async (req, res) => {
  try {
    const { status, adminNote } = req.body; // "approved" | "rejected" | "completed"

    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) return res.status(404).json({ message: "Not found" });

    if (withdrawal.status !== "pending") {
      return res.status(400).json({ message: "Already processed" });
    }

    // Agar reject kiya toh paisa wapas wallet mein daalo
    if (status === "rejected") {
      await User.findByIdAndUpdate(withdrawal.user, { $inc: { balance: withdrawal.amount } });
    }

    withdrawal.status = status;
    withdrawal.adminNote = adminNote || "";
    await withdrawal.save();

    res.json({ message: "Updated", withdrawal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route GET /api/withdraw/admin/pending
router.get("/admin/pending", protect, isAdmin, async (req, res) => {
  const withdrawals = await Withdrawal.find({ status: "pending" })
    .populate("user", "name phone")
    .sort({ createdAt: -1 });
  res.json({ withdrawals });
});
module.exports = router;
