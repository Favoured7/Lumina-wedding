"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("saved_vendors", [
      {
        userId: 1,
        vendorId: 2,
        notes: "Loved their portfolio, will contact later",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        vendorId: 3,
        notes: "Beautiful venue, need to check availability",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        vendorId: 4,
        notes: "Great catering options",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 3,
        vendorId: 5,
        notes: "Good music selection",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 4,
        vendorId: 1,
        notes: "Best photographer in Kigali",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("saved_vendors", null, {});
  },
};
