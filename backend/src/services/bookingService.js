const { Booking, User, Vendor, Service } = require("../models");

class BookingService {
  // Create a new booking
  async createBooking(bookingData) {
    try {
      const bookingNumber = `BKG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      const booking = await Booking.create({
        ...bookingData,
        bookingNumber,
        status: "pending",
      });
      
      return booking;
    } catch (error) {
      throw error;
    }
  }

  // Get bookings by user
  async getBookingsByUser(userId) {
    try {
      const bookings = await Booking.findAll({
        where: { userId },
        include: [
          { model: Vendor, attributes: ["businessName", "vendorType"] },
          { model: Service, attributes: ["name", "price"] },
        ],
        order: [["createdAt", "DESC"]],
      });
      return bookings;
    } catch (error) {
      throw error;
    }
  }

  // Get bookings by vendor
  async getBookingsByVendor(vendorId) {
    try {
      const bookings = await Booking.findAll({
        where: { vendorId },
        include: [{ model: User, attributes: ["name", "email", "phone"] }],
        order: [["eventDate", "ASC"]],
      });
      return bookings;
    } catch (error) {
      throw error;
    }
  }

  // Get booking by ID
  async getBookingById(id) {
    try {
      const booking = await Booking.findByPk(id, {
        include: [
          { model: User, attributes: ["name", "email", "phone"] },
          { model: Vendor, attributes: ["businessName"] },
          { model: Service, attributes: ["name", "price"] },
        ],
      });
      if (!booking) {
        throw new Error("Booking not found");
      }
      return booking;
    } catch (error) {
      throw error;
    }
  }

  // Update booking status
  async updateBookingStatus(id, status) {
    try {
      const booking = await Booking.findByPk(id);
      if (!booking) {
        throw new Error("Booking not found");
      }
      
      await booking.update({ status });
      return booking;
    } catch (error) {
      throw error;
    }
  }

  // Cancel booking
  async cancelBooking(id) {
    try {
      const booking = await Booking.findByPk(id);
      if (!booking) {
        throw new Error("Booking not found");
      }
      
      await booking.update({ status: "cancelled" });
      return { message: "Booking cancelled successfully" };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new BookingService();