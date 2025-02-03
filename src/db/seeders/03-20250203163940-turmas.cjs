'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('turmas', [
      {
        nome: 'Primeiro ano',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Segundo ano',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Terceiro ano',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('turmas', null);
  }
};
