'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('perguntas', [
      // Perguntas de Matemática e Português (já existentes)
      {
        materia_id: 1,
        pergunta: 'Quanto é 2 + 2?',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        materia_id: 1,
        pergunta: 'Quanto é 2 X 2?',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        materia_id: 1,
        pergunta: 'Quanto é 2 - 2?',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        materia_id: 2,
        pergunta: "Na frase 'O homem é o lobo do homem', qual o verbo?",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        materia_id: 2,
        pergunta: "O que é um palíndromo?",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        materia_id: 2,
        pergunta: "Qual das palavras abaixo é uma proparoxítona?",
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Perguntas de Biologia
      {
        materia_id: 3,
        pergunta: "Qual é a função dos cloroplastos nas células vegetais?",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        materia_id: 3,
        pergunta: "Qual destes seres vivos é um mamífero?",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        materia_id: 3,
        pergunta: "O que é fotossíntese?",
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Perguntas de Física
      {
        materia_id: 4,
        pergunta: "O que é a força gravitacional?",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        materia_id: 4,
        pergunta: "Qual é a unidade de medida da força?",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        materia_id: 4,
        pergunta: "O que acontece quando um objeto é lançado para o alto?",
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Perguntas de Filosofia
      {
        materia_id: 5,
        pergunta: "Quem é considerado o pai da filosofia?",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        materia_id: 5,
        pergunta: "O que é ética?",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        materia_id: 5,
        pergunta: "Qual é a diferença entre moral e ética?",
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Perguntas de Geografia
      {
        materia_id: 6,
        pergunta: "Qual é a capital do Brasil?",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        materia_id: 6,
        pergunta: "O que é um bioma?",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        materia_id: 6,
        pergunta: "Qual continente é o mais populoso?",
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Perguntas de Química
      {
        materia_id: 7,
        pergunta: "Qual é a fórmula da água?",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        materia_id: 7,
        pergunta: "O que é um átomo?",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        materia_id: 7,
        pergunta: "O que é uma reação química?",
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Perguntas de História
      {
        materia_id: 8,
        pergunta: "Quem foi o primeiro presidente do Brasil?",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        materia_id: 8,
        pergunta: "O que foi a Revolução Francesa?",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        materia_id: 8,
        pergunta: "Qual foi a importância da Independência do Brasil?",
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Perguntas de Inglês
      {
        materia_id: 9,
        pergunta: "Como se diz 'cachorro' em inglês?",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        materia_id: 9,
        pergunta: "Qual é a tradução da palavra 'livro'?",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        materia_id: 9,
        pergunta: "O que significa 'hello'?",
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('perguntas', null);
  }
};
