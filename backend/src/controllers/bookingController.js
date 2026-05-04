const { bookingService } = require("../services");

class BookingController {
  async createBooking(req, res) {
    try {
      const bookingData = {
        ...req.body,
        userId: req.userId,
      };
      const booking = await bookingService.createBooking(bookingData);
      res.status(201).json({
        success: true,
        message: "Booking created successfully",
        data: booking,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getMyBookings(req, res) {
    try {
      const bookings = await bookingService.getBookingsByUser(req.userId);
      res.json({
        success: true,
        count: bookings.length,
        data: bookings,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getVendorBookings(req, res) {
    try {
      const vendorId = req.params.vendorId || req.userId;
      const bookings = await bookingService.getBookingsByVendor(vendorId);
      res.json({
        success: true,
        count: bookings.length,
        data: bookings,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getBookingById(req, res) {
    try {
      const booking = await bookingService.getBookingById(req.params.id);
      res.json({
        success: true,
        data: booking,
      });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async updateBookingStatus(req, res) {
    try {
      const { status } = req.body;
      const booking = await bookingService.updateBookingStatus(req.params.id, status);
      res.json({
        success: true,
        message: `Booking ${status} successfully`,
        data: booking,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async cancelBooking(req, res) {
    try {
      const result = await bookingService.cancelBooking(req.params.id);
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new BookingController();