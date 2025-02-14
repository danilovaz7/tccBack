'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('elo_materias', [
      {
        usuario_id: 2,
        materia_id: 1,
        elo_id: 1,
        subelo_id: 1,
        respostas_corretas_elo: 0,
        respostas_corretas_total: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        usuario_id: 2,
        materia_id: 2,
        elo_id: 1,
        subelo_id: 1,
        respostas_corretas_elo: 0,
        respostas_corretas_total: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        usuario_id: 2,
        materia_id: 3,
        elo_id: 1,
        subelo_id: 1,
        respostas_corretas_elo: 0,
        respostas_corretas_total: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        usuario_id: 2,
        materia_id: 4,
        elo_id: 1,
        subelo_id: 1,
        respostas_corretas_elo: 0,
        respostas_corretas_total: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        usuario_id: 2,
        materia_id: 5,
        elo_id: 1,
        subelo_id: 1,
        respostas_corretas_elo: 0,
        respostas_corretas_total: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        usuario_id: 2,
        materia_id: 6,
        elo_id: 1,
        subelo_id: 1,
        respostas_corretas_elo: 0,
        respostas_corretas_total: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        usuario_id: 2,
        materia_id: 7,
        elo_id: 1,
        subelo_id: 1,
        respostas_corretas_elo: 0,
        respostas_corretas_total: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        usuario_id: 2,
        materia_id: 8,
        elo_id: 1,
        subelo_id: 1,
        respostas_corretas_elo: 0,
        respostas_corretas_total: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        usuario_id: 2,
        materia_id: 9,
        elo_id: 1,
        subelo_id: 1,
        respostas_corretas_elo: 0,
        respostas_corretas_total: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        usuario_id: 2,
        materia_id: 10,
        elo_id: 1,
        subelo_id: 1,
        respostas_corretas_elo: 0,
        respostas_corretas_total: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('elo_materias', null);
  }
};
