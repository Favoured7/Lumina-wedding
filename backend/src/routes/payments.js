const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const { Payment, Booking, Vendor, User } = require("../database/models");
const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { bookingId, amount, paymentMethod } = req.body;
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, error: "Booking not found" });
    }

    const payment = await Payment.create({
      bookingId,
      amount,
      paymentMethod: paymentMethod || "card",
      status: "completed",
      transactionId: `TXN-${Date.now()}`,
    });

    const totalPaid = await Payment.sum("amount", {
      where: { bookingId, status: "completed" },
    });

    if (Number(totalPaid || 0) >= Number(booking.totalPrice || 0)) {
      await booking.update({ status: "confirmed" });
    }

    return res.status(201).json({ success: true, data: payment });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});

router.get("/booking/:bookingId", authMiddleware, async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { bookingId: req.params.bookingId },
      order: [["createdAt", "DESC"]],
    });
    return res.json({ success: true, data: payments });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/vendor-summary/:vendorId", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { vendorId: req.params.vendorId },
      include: [{ model: Payment }, { model: User }, { model: Vendor }],
    });

    const summary = bookings.map((booking) => {
      const paid = (booking.Payments || [])
        .filter((p) => p.status === "completed")
        .reduce((sum, p) => sum + Number(p.amount || 0), 0);
      return {
        bookingId: booking.id,
        couple: booking.User?.name || "Unknown",
        vendor: booking.Vendor?.name || "Vendor",
        totalPrice: Number(booking.totalPrice || 0),
        paidAmount: paid,
        balance: Math.max(Number(booking.totalPrice || 0) - paid, 0),
        status: booking.status,
      };
    });

    return res.json({ success: true, data: summary });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, error: "Payment not found" });
    }
    return res.json({ success: true, data: payment });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.put("/:id/confirm", authMiddleware, async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, error: "Payment not found" });
    }
    await payment.update({ status: "completed" });
    return res.json({ success: true, data: payment });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;