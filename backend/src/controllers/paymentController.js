const { paymentService } = require("../services");

class PaymentController {
  async createPayment(req, res) {
    try {
      const payment = await paymentService.createPayment(req.body);
      res.status(201).json({
        success: true,
        message: "Payment initiated successfully",
        data: payment,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getPaymentsByBooking(req, res) {
    try {
      const payments = await paymentService.getPaymentsByBooking(req.params.bookingId);
      res.json({
        success: true,
        count: payments.length,
        data: payments,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async confirmPayment(req, res) {
    try {
      const payment = await paymentService.confirmPayment(req.params.id);
      res.json({
        success: true,
        message: "Payment confirmed successfully",
        data: payment,
      });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async getPaymentById(req, res) {
    try {
      const payment = await paymentService.getPaymentById(req.params.id);
      res.json({
        success: true,
        data: payment,
      });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new PaymentController();