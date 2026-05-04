"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("payments", [
      {
        bookingId: 1,
        amount: 500.00,
        paymentMethod: "credit_card",
        status: "completed",
        transactionId: "TXN001",
        paymentDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bookingId: 1,
        amount: 1000.00,
        paymentMethod: "mobile_money",
        status: "pending",
        transactionId: "TXN002",
        paymentDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bookingId: 2,
        amount: 150.00,
        paymentMethod: "credit_card",
        status: "completed",
        transactionId: "TXN003",
        paymentDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bookingId: 3,
        amount: 350.00,
        paymentMethod: "bank_transfer",
        status: "completed",
        transactionId: "TXN004",
        paymentDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bookingId: 5,
        amount: 1000.00,
        paymentMethod: "credit_card",
        status: "completed",
        transactionId: "TXN005",
        paymentDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("payments", null, {});
  },
};
