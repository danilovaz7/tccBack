'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('estatisticas_gerais', [
      {
        usuario_id: 2,
        total_perguntas: 0,
        total_perguntas_acertadas: 0,
        total_disputas: 0,
        total_disputas_ganhas: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },

    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('estatisticas_gerais', null);
  }
};
