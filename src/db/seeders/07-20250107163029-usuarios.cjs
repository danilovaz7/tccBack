'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('usuarios', [
      {
        nome: 'Joao da silva',
        email: 'jota@gmail.com',
        senha: '123',
        genero: 'M',
        id_avatar: 1,
        tipo_usuario_id: 1,
        id_escola: 1,
        id_turma: 3,
        nivel: 99,
        experiencia: 999999,
        matricula:'999999',
        ic_ativo: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Maria Antonieta ',
        email: 'emi@gmail.com',
        senha: '111',
        genero: 'F',
        id_avatar: 2,
        tipo_usuario_id: 2,
        id_escola: 1,
        id_turma: 3,
        nivel: 1,
        experiencia:0 ,
        matricula:'129082' ,
        ic_ativo: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Luiz Carlos',
        email: 'eli@gmail.com',
        senha: '333',
        genero: 'M',
        id_avatar: 3,
        tipo_usuario_id: 3,
        id_escola: 1,
        id_turma: 3,
        nivel: 1,
        experiencia:0 ,
        id_materia: 2,
        matricula:'325478' ,
        ic_ativo: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Hugo Leonardo',
        email: 'aga@gmail.com',
        senha: '222',
        genero: 'M',
        id_avatar: 4,
        tipo_usuario_id: 4,
        id_escola: 1,
        id_turma: 3,
        nivel: 1,
        experiencia:0 ,
        matricula:'783411' ,
        ic_ativo: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios', null);
  }
};
