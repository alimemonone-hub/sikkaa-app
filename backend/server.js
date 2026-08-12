const cron = require("node-cron");
const Investment = require("./models/Investment");
const User = require("./models/User");
const Transaction = require("./models/Transaction");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const walletRoutes = require("./routes/wallet");
const withdrawRoutes = require("./routes/withdraw");
const referralRoutes = require("./routes/referral");
const depositRoutes = require("./routes/deposit");
const bannerRoutes = require("./routes/banners");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const investmentRoutes = require("./routes/investments");
const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Basic rate limiting to slow down abuse/bot requests
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute per IP
});
app.use(limiter);

app.get("/", (req, res) => {
  res.json({ status: "Sikka API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/withdraw", withdrawRoutes);
app.use("/api/products", productRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/referral", referralRoutes);
app.use("/api/deposit", depositRoutes);
app.use("/api/banners", bannerRoutes);
// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
cron.schedule("0 * * * *", async () => {
  try {
    const now = new Date();
    const dueInvestments = await Investment.find({
      status: "active",
      lastPayoutAt: { $lte: new Date(now - 24 * 60 * 60 * 1000) },
    });

    for (const inv of dueInvestments) {
      await User.findByIdAndUpdate(inv.user, { $inc: { balance: inv.dailyReturn } });
      inv.lastPayoutAt = now;
      inv.totalPaid += inv.dailyReturn;
      await inv.save();

      await Transaction.create({
        user: inv.user,
        type: "deposit",
        amount: inv.dailyReturn,
        status: "success",
      });
    }

    if (dueInvestments.length > 0) {
      console.log(`Paid out ${dueInvestments.length} investments`);
    }
  } catch (err) {
    console.error("Cron payout error:", err);
  }
});
app.listen(PORT, () => console.log(`Sikka backend running on port ${PORT}`));
