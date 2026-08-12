const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    amount: { type: Number, required: true },
    dailyReturn: { type: Number, required: true },
    startDate: { type: Date, default: Date.now },
    lastPayoutAt: { type: Date, default: Date.now },
    totalPaid: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "stopped"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Investment", investmentSchema);