const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["ad", "task", "referral_bonus", "withdrawal", "signup_bonus"],
      required: true,
    },
    amount: { type: Number, required: true }, // positive = credit, negative = debit
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
