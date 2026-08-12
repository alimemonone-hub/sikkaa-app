const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const protect = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

// Public - sab products dekhein
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ inStock: true }).sort({ createdAt: -1 });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Admin - naya product add kare
router.post("/", protect, isAdmin, async (req, res) => {
  try {
    const { name, description, price, imageUrl } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: "Name and price required" });
    }
    const product = await Product.create({ name, description, price, imageUrl });
    res.json({ message: "Product added", product });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Admin - product delete/out of stock kare
router.put("/:id", protect, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Updated", product });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;