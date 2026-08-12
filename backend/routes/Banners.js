const express = require("express");
const router = express.Router();
const Banner = require("../models/banner");
const isAdmin = require("../middleware/isAdmin");

// GET /banners - fetch active banners, sorted by order (public - used by app)
router.get("/", async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1 });
    res.json({ banners });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /banners - add a new banner (admin only)
router.post("/", isAdmin, async (req, res) => {
  try {
    const { imageUrl, order } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ message: "imageUrl is required" });
    }
    const banner = await Banner.create({ imageUrl, order: order || 0 });
    res.status(201).json({ banner });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /banners/:id - remove a banner (admin only)
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: "Banner deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;