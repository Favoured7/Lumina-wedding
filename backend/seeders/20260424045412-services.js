"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("services", [
      // Photography services
      {
        vendorId: 1,
        name: "Wedding Photography Package",
        description: "Full day wedding photography coverage",
        price: 1500.00,
        duration: 480,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        vendorId: 1,
        name: "Engagement Photo Session",
        description: "2-hour engagement photoshoot",
        price: 350.00,
        duration: 120,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Makeup services
      {
        vendorId: 2,
        name: "Bridal Makeup",
        description: "Professional bridal makeup",
        price: 150.00,
        duration: 90,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        vendorId: 2,
        name: "Bridesmaid Makeup",
        description: "Makeup for bridesmaids",
        price: 80.00,
        duration: 60,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Venue services
      {
        vendorId: 3,
        name: "Grand Ballroom Package",
        description: "Full day venue rental including setup",
        price: 5000.00,
        duration: 720,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        vendorId: 3,
        name: "Garden Ceremony",
        description: "Outdoor garden ceremony setup",
        price: 3000.00,
        duration: 480,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Catering services
      {
        vendorId: 4,
        name: "Plated Dinner Service",
        description: "3-course plated dinner for 100 guests",
        price: 2500.00,
        duration: 180,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        vendorId: 4,
        name: "Buffet Service",
        description: "Buffet style dinner for 100 guests",
        price: 1800.00,
        duration: 180,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Entertainment services
      {
        vendorId: 5,
        name: "DJ Service",
        description: "Professional DJ for 6 hours",
        price: 800.00,
        duration: 360,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        vendorId: 5,
        name: "Live Band",
        description: "5-piece live band performance",
        price: 1200.00,
        duration: 360,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Planning services
      {
        vendorId: 6,
        name: "Full Wedding Planning",
        description: "Complete wedding planning service",
        price: 2000.00,
        duration: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        vendorId: 6,
        name: "Day-of Coordination",
        description: "Wedding day coordination only",
        price: 800.00,
        duration: 480,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("services", null, {});
  },
};
