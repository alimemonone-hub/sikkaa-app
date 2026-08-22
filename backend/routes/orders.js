const Commission = require("../models/commission");
const User = require("../models/User");
const Investment = require("../models/Investment");
const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const Product = require("../models/product");
const protect = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

// User - "Buy Now" pe click karke order request bheje
router.post("/request", protect, async (req, res) => {
  try {
    const { productId, method, senderNumber, transactionId } = req.body;

    if (!productId || !method || !senderNumber || !transactionId) {
      return res.status(400).json({ message: "All fields required" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const order = await Order.create({
      user: req.user._id,
      product: product._id,
      amount: product.price,
      method,
      senderNumber,
      transactionId,
      status: "pending",
    });

    res.json({ message: "Order submitted, admin will verify soon", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// User - apne orders dekhe
router.get("/my-orders", protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("product", "name price imageUrl")
    .sort({ createdAt: -1 });
  res.json({ orders });
});

// Admin - pending orders dekhe
router.get("/admin/pending", protect, isAdmin, async (req, res) => {
  const orders = await Order.find({ status: "pending" })
    .populate("user", "name phone")
    .populate("product", "name price")
    .sort({ createdAt: -1 });
  res.json({ orders });
});

// Admin - approve/reject kare
router.put("/admin/:id/status", protect, isAdmin, async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Not found" });

    if (order.status !== "pending") {
      return res.status(400).json({ message: "Already processed" });
    }
if (status === "approved") {
  const product = await Product.findById(order.product);
  await Investment.create({
    user: order.user,
    product: order.product,
    order: order._id,
    amount: order.amount,
    dailyReturn: product.dailyReturn,
  });
  // Multi-level referral commission
const buyer = await User.findById(order.user);
const rates = [0.35, 0.03, 0.01]; // level 1, 2, 3

let currentReferrerId = buyer.referredBy;
for (let level = 1; level <= 3 && currentReferrerId; level++) {
  const referrer = await User.findById(currentReferrerId);
  if (!referrer) break;

  const commissionAmount = order.amount * rates[level - 1];

  await User.findByIdAndUpdate(referrer._id, { $inc: { balance: commissionAmount } });

  await Commission.create({
    user: referrer._id,
    fromUser: buyer._id,
    level,
    amount: commissionAmount,
  });

  currentReferrerId = referrer.referredBy;
}
}

    order.status = status;
    order.adminNote = adminNote || "";
    await order.save();

    res.json({ message: "Updated", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;