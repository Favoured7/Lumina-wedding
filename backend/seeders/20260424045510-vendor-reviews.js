"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("vendor_reviews", [
      {
        userId: 1,
        vendorId: 1,
        rating: 5,
        comment: "Umucyo Photography captured our day perfectly! Highly recommend.",
        isApproved: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        vendorId: 2,
        rating: 5,
        comment: "Clarisse made me look like a princess on my wedding day.",
        isApproved: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 3,
        vendorId: 1,
        rating: 4,
        comment: "Great photographer, very professional.",
        isApproved: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 5,
        vendorId: 3,
        rating: 5,
        comment: "Beautiful venue, amazing views of Kigali.",
        isApproved: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("vendor_reviews", null, {});
  },
};
