const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const { Booking, Vendor, User, Payment } = require("../database/models");
const router = express.Router();

router.get("/my-bookings", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.userId },
      include: [{ model: Vendor }, { model: Payment }],
      order: [["createdAt", "DESC"]],
    });
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { vendorId, date, totalPrice, notes } = req.body;
    const vendor = await Vendor.findByPk(vendorId);
    if (!vendor) {
      return res.status(404).json({ success: false, error: "Vendor not found" });
    }
    if (vendor.isFree) {
      return res.status(400).json({ success: false, error: "Free resources cannot be booked" });
    }

    const booking = await Booking.create({
      userId: req.userId,
      vendorId,
      date,
      totalPrice,
      notes,
      status: "pending",
    });

    return res.status(201).json({ success: true, data: booking });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [{ model: Vendor }, { model: User }, { model: Payment }],
    });
    if (!booking) {
      return res.status(404).json({ success: false, error: "Booking not found" });
    }
    return res.json({ success: true, data: booking });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, error: "Booking not found" });
    }
    await booking.update({ status: req.body.status || booking.status });
    return res.json({ success: true, data: booking });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});

router.put("/:id/cancel", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, error: "Booking not found" });
    }
    await booking.update({ status: "cancelled" });
    return res.json({ success: true, data: booking });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});

router.get("/vendor/:vendorId", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { vendorId: req.params.vendorId },
      include: [{ model: User }, { model: Payment }],
      order: [["createdAt", "DESC"]],
    });
    return res.json({ success: true, data: bookings });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;