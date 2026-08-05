const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Deposit = require("../models/deposit");
const protect = require("../middleware/auth");

router.post("/request", protect, async (req, res) => {
  try {
    const { amount, method, senderNumber, transactionId, screenshotUrl } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }
    if (!method || !senderNumber || !transactionId) {
      return res.status(400).json({ message: "All fields required" });
    }

    const deposit = await Deposit.create({
      user: req.user._id,
      amount,
      method,
      senderNumber,
      transactionId,
      screenshotUrl,
      status: "pending",
    });

    res.json({ message: "Deposit request submitted, admin will verify soon", deposit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/my-deposits", protect, async (req, res) => {
  const deposits = await Deposit.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ deposits });
});

router.get("/admin/pending", protect, async (req, res) => {
  const deposits = await Deposit.find({ status: "pending" })
    .populate("user", "name phone")
    .sort({ createdAt: -1 });
  res.json({ deposits });
});

router.put("/admin/:id/status", protect, async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    const deposit = await Deposit.findById(req.params.id);
    if (!deposit) return res.status(404).json({ message: "Not found" });

    if (deposit.status !== "pending") {
      return res.status(400).json({ message: "Already processed" });
    }

    if (status === "approved") {
      await User.findByIdAndUpdate(deposit.user, { $inc: { balance: deposit.amount } });
    }

    deposit.status = status;
    deposit.adminNote = adminNote || "";
    await deposit.save();

    res.json({ message: "Updated", deposit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;