const { Payment, Booking } = require("../models");

class PaymentService {
  // Create a new payment
  async createPayment(paymentData) {
    try {
      const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      
      const payment = await Payment.create({
        ...paymentData,
        transactionId,
        status: "pending",
      });
      
      // Update booking payment status
      if (paymentData.bookingId) {
        const booking = await Booking.findByPk(paymentData.bookingId);
        if (booking) {
          const totalPaid = await this.getTotalPaidForBooking(paymentData.bookingId);
          const newPaymentStatus = totalPaid + paymentData.amount >= booking.totalAmount 
            ? "fully_paid" 
            : "deposit_paid";
          
          await booking.update({ paymentStatus: newPaymentStatus });
        }
      }
      
      return payment;
    } catch (error) {
      throw error;
    }
  }

  // Get total paid for a booking
  async getTotalPaidForBooking(bookingId) {
    const payments = await Payment.findAll({
      where: { bookingId, status: "completed" },
    });
    return payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  }

  // Get payments by booking
  async getPaymentsByBooking(bookingId) {
    try {
      const payments = await Payment.findAll({
        where: { bookingId },
        order: [["createdAt", "DESC"]],
      });
      return payments;
    } catch (error) {
      throw error;
    }
  }

  // Confirm payment
  async confirmPayment(id) {
    try {
      const payment = await Payment.findByPk(id);
      if (!payment) {
        throw new Error("Payment not found");
      }
      
      await payment.update({ status: "completed", paymentDate: new Date() });
      return payment;
    } catch (error) {
      throw error;
    }
  }

  // Get payment by ID
  async getPaymentById(id) {
    try {
      const payment = await Payment.findByPk(id);
      if (!payment) {
        throw new Error("Payment not found");
      }
      return payment;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new PaymentService();