const express = require("express");
const router = express.Router();
const { Vendor } = require("../database/models");
const { authMiddleware } = require("../middleware/auth");

const initialVendors = [
  { name: "Glow by Clarisse", category: "makeup", location: "Kigali", availability: "available", isFree: false, price: 150 },
  { name: "Umucyo Photography", category: "photography", location: "Kigali", availability: "available", isFree: false, price: 1500 },
  { name: "Kigali Heights Venue", category: "venues", location: "Kigali", availability: "unavailable", isFree: false, price: 5000 },
  { name: "Africana Catering", category: "catering", location: "Kigali", availability: "available", isFree: false, price: 2500 },
  { name: "Kigali Entertainment", category: "musician", location: "Kigali", availability: "available", isFree: false, price: 800 },
  { name: "The 5 Love Languages", category: "resources", location: "Online", availability: "available", isFree: true, price: 0 },
  { name: "Zanzibar Beach Paradise", category: "honeymoon", location: "Zanzibar", availability: "available", isFree: true, price: 0 },
];

const ensureSeedVendors = async () => {
  const count = await Vendor.count();
  if (count === 0) {
    await Vendor.bulkCreate(initialVendors);
  }
};

router.get("/", async (req, res) => {
  try {
    await ensureSeedVendors();
    const vendors = await Vendor.findAll({ order: [["id", "ASC"]] });
    return res.json({ success: true, data: vendors });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/type/:type", async (req, res) => {
  try {
    await ensureSeedVendors();
    const list = await Vendor.findAll({
      where: { category: req.params.type },
      order: [["id", "ASC"]],
    });
    return res.json({ success: true, data: list });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const payload = req.body;
    const vendor = await Vendor.create({
      name: payload.name,
      description: payload.description || "",
      category: payload.category,
      price: payload.price || 0,
      location: payload.location || "Kigali",
      availability: payload.availability || "available",
      isFree: payload.category === "resources" || payload.category === "honeymoon",
      imageUrl: payload.imageUrl || null,
      userId: req.userId || null,
    });
    return res.status(201).json({ success: true, data: vendor });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id);
    if (!vendor) {
      return res.status(404).json({ success: false, error: "Vendor not found" });
    }
    await vendor.update({
      ...req.body,
      isFree: req.body.category === "resources" || req.body.category === "honeymoon"
    });
    return res.json({ success: true, data: vendor });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id);
    if (!vendor) {
      return res.status(404).json({ success: false, error: "Vendor not found" });
    }
    return res.json({ success: true, data: vendor });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;