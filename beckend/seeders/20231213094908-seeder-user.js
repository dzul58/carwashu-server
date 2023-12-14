"use strict";

const { createHash } = require("../helpers/bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert("Users", [
      {
        email: "adminkartap@mail.com",
        password: createHash("12345"),
        fullName: "admin kartap",
        carName: "BMW z4 ",
        member: "admin",
        licensePlate: "z4",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "adminkontrak@mail.com",
        password: createHash("12345"),
        fullName: "admin kontrak",
        carName: "Toyota Corolla DX",
        member: "admin",
        licensePlate: "B1901WJF",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Users", null, {});
  },
};
