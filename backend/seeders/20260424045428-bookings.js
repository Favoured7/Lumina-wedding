"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("bookings", [
      {
        userId: 1,
        vendorId: 1,
        serviceId: 1,
        eventDate: "2026-06-15",
        status: "confirmed",
        totalAmount: 1500.00,
        paymentStatus: "deposit_paid",
        guestCount: 150,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        vendorId: 2,
        serviceId: 3,
        eventDate: "2026-07-20",
        status: "confirmed",
        totalAmount: 150.00,
        paymentStatus: "fully_paid",
        guestCount: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 3,
        vendorId: 1,
        serviceId: 2,
        eventDate: "2026-05-10",
        status: "completed",
        totalAmount: 350.00,
        paymentStatus: "fully_paid",
        guestCount: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 4,
        vendorId: 3,
        serviceId: 5,
        eventDate: "2026-08-10",
        status: "pending",
        totalAmount: 5000.00,
        paymentStatus: "pending",
        guestCount: 200,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 5,
        vendorId: 4,
        serviceId: 7,
        eventDate: "2026-09-05",
        status: "confirmed",
        totalAmount: 2500.00,
        paymentStatus: "deposit_paid",
        guestCount: 120,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 6,
        vendorId: 5,
        serviceId: 9,
        eventDate: "2026-10-12",
        status: "pending",
        totalAmount: 800.00,
        paymentStatus: "pending",
        guestCount: 150,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("bookings", null, {});
  },
};
