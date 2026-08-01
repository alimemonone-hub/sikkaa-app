const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const generateReferralCode = require("../utils/generateReferralCode");

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });

// @route POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, phone, password, referralCode } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ message: "Name, phone and password are required" });
    }

    const existing = await User.findOne({ phone });
    if (existing) {
      return res.status(400).json({ message: "Phone number already registered" });
    }

    let referredBy = null;
    if (referralCode) {
      const referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
      if (referrer) referredBy = referrer._id;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Ensure unique referral code
    let myCode;
    do {
      myCode = generateReferralCode();
    } while (await User.findOne({ referralCode: myCode }));

    const user = await User.create({
      name,
      phone,
      password: hashedPassword,
      referralCode: myCode,
      referredBy,
    });

    // Signup bonus
    const SIGNUP_BONUS = 10;
    user.balance += SIGNUP_BONUS;
    await user.save();
    await Transaction.create({
      user: user._id,
      type: "signup_bonus",
      amount: SIGNUP_BONUS,
      note: "Welcome bonus",
    });

    // Reward the referrer
    if (referredBy) {
      const REFERRAL_BONUS = 20;
      const referrer = await User.findById(referredBy);
      referrer.balance += REFERRAL_BONUS;
      referrer.referralCount += 1;
      await referrer.save();
      await Transaction.create({
        user: referrer._id,
        type: "referral_bonus",
        amount: REFERRAL_BONUS,
        note: `Referred ${user.name}`,
      });
    }

    res.status(201).json({
      token: signToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        balance: user.balance,
        referralCode: user.referralCode,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

// @route POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ message: "Invalid phone or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid phone or password" });

    if (user.status === "banned") {
      return res.status(403).json({ message: "Account suspended" });
    }

    res.json({
      token: signToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        balance: user.balance,
        referralCode: user.referralCode,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

module.exports = router;
