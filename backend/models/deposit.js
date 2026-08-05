const mongoose = require("mongoose");

const depositSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ["jazzcash", "easypaisa"], required: true },
    senderNumber: { type: String, required: true },
    transactionId: { type: String, required: true },
    screenshotUrl: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminNote: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deposit", depositSchema);