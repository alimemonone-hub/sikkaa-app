const mongoose = require("mongoose");

const commissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // commission pane wala
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // jisne invest kiya
    level: { type: Number, required: true }, // 1, 2, ya 3
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Commission", commissionSchema);