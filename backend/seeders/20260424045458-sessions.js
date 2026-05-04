"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Sessions are usually created dynamically, so this is optional
    await queryInterface.bulkInsert("sessions", []);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("sessions", null, {});
  },
};
