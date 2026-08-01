require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const walletRoutes = require("./routes/wallet");
const withdrawRoutes = require("./routes/withdraw");
const referralRoutes = require("./routes/referral");

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
app.use("/api/referral", referralRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Sikka backend running on port ${PORT}`));
