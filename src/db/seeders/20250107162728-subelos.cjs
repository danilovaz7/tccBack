'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('subelos', [
      {
        nome: 'I',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'II',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'III',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('subelos', null);
  }
};
