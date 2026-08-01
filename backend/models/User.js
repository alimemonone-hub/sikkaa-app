const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },

    balance: { type: Number, default: 0 }, // in Rs

    referralCode: { type: String, unique: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    referralCount: { type: Number, default: 0 },

    // Basic fraud control
    todayEarned: { type: Number, default: 0 },
    lastEarnDate: { type: String, default: null }, // stored as YYYY-MM-DD

    status: { type: String, enum: ["active", "banned"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
