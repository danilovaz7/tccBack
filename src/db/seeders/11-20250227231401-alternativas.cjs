'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('alternativas', [
      // Perguntas de Matemática
      {
        pergunta_id: 1, // Quanto é 2 + 2?
        alternativa: '1',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 1,
        alternativa: '5',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 1,
        alternativa: '4',
        correta: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 1,
        alternativa: '8',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 2, // Quanto é 2 X 2?
        alternativa: '2',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 2,
        alternativa: '4',
        correta: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 2,
        alternativa: '6',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 2,
        alternativa: '8',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 3, // Quanto é 2 - 2?
        alternativa: '0',
        correta: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 3,
        alternativa: '2',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 3,
        alternativa: '4',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 3,
        alternativa: '-2',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Perguntas de Português
      {
        pergunta_id: 4, // Verbo na frase
        alternativa: 'Ser',
        correta: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 4,
        alternativa: 'Homem',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 4,
        alternativa: 'Lobo',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 4,
        alternativa: 'Do',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 5, // O que é um palíndromo?
        alternativa: 'Uma palavra que se lê igual de trás para frente',
        correta: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 5,
        alternativa: 'Uma palavra com mais de cinco letras',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 5,
        alternativa: 'Uma frase sem sentido',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 5,
        alternativa: 'Uma expressão idiomática',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 6, // Proparoxítona
        alternativa: 'Médico',
        correta: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 6,
        alternativa: 'Cachorro',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 6,
        alternativa: 'Banana',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 6,
        alternativa: 'Arroz',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Perguntas de Biologia
      {
        pergunta_id: 7, // Função dos cloroplastos
        alternativa: 'Produzir energia',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 7,
        alternativa: 'Realizar a fotossíntese',
        correta: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 7,
        alternativa: 'Absorver água',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 7,
        alternativa: 'Proteger a célula',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 8, // Mamífero
        alternativa: 'Pato',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 8,
        alternativa: 'Cobra',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 8,
        alternativa: 'Elefante',
        correta: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 8,
        alternativa: 'Peixe',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 9, // Fotossíntese
        alternativa: 'Processo de respiração',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 9,
        alternativa: 'Produção de alimentos pelas plantas',
        correta: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 9,
        alternativa: 'Absorção de água',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 9,
        alternativa: 'Decomposição de matéria orgânica',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Perguntas de Física
      {
        pergunta_id: 10, // Força gravitacional
        alternativa: 'Força que puxa os objetos para o centro da Terra',
        correta: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 10,
        alternativa: 'Força que empurra os objetos para longe',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 10,
        alternativa: 'Força que mantém os objetos em movimento',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 10,
        alternativa: 'Força que não existe',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 11, // Unidade de medida da força
        alternativa: 'Quilograma',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 11,
        alternativa: 'Metro',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 11,
        alternativa: 'Newton',
        correta: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 11,
        alternativa: 'Joule',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 12, // Objeto lançado
        alternativa: 'Ele desce',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 12,
        alternativa: 'Ele fica parado',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 12,
        alternativa: 'Ele sobe e depois desce',
        correta: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 12,
        alternativa: 'Ele explode',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Perguntas de Filosofia
      {
        pergunta_id: 13, // Pai da filosofia
        alternativa: 'Aristóteles',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 13,
        alternativa: 'Platão',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 13,
        alternativa: 'Sócrates',
        correta: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 13,
        alternativa: 'Descartes',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 14, // O que é ética?
        alternativa: 'Estudo dos sentimentos',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 14,
        alternativa: 'Estudo do comportamento moral',
        correta: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 14,
        alternativa: 'Estudo da história',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 14,
        alternativa: 'Estudo das ciências',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 15, // Diferença entre moral e ética
        alternativa: 'Nenhuma',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 15,
        alternativa: 'Moral é pessoal, ética é social',
        correta: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 15,
        alternativa: 'Ambas são a mesma coisa',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 15,
        alternativa: 'Ética é pessoal, moral é social',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Perguntas de Geografia
      {
        pergunta_id: 16, // Capital do Brasil
        alternativa: 'São Paulo',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 16,
        alternativa: 'Brasília',
        correta: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 16,
        alternativa: 'Rio de Janeiro',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 16,
        alternativa: 'Salvador',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 17, // O que é um bioma?
        alternativa: 'Clima',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 17,
        alternativa: 'Conjunto de seres vivos e ambiente',
        correta: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 17,
        alternativa: 'Região montanhosa',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 17,
        alternativa: 'Tipo de solo',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 18, // Continente mais populoso
        alternativa: 'África',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 18,
        alternativa: 'Europa',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 18,
        alternativa: 'Ásia',
        correta: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 18,
        alternativa: 'América do Sul',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Perguntas de Química
      {
        pergunta_id: 19, // Fórmula da água
        alternativa: 'H2O',
        correta: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 19,
        alternativa: 'CO2',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 19,
        alternativa: 'O2',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 19,
        alternativa: 'H2',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 20, // O que é um átomo?
        alternativa: 'Parte de uma célula',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 20,
        alternativa: 'Unidade básica da matéria',
        correta: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 20,
        alternativa: 'Tipo de ligação',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 20,
        alternativa: 'Elemento químico',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 21, // O que é uma reação química?
        alternativa: 'Mudança de temperatura',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 21,
        alternativa: 'Transformação de substâncias',
        correta: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 21,
        alternativa: 'Movimento de elétrons',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 21,
        alternativa: 'Divisão celular',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Perguntas de História
      {
        pergunta_id: 22, // Primeiro presidente do Brasil
        alternativa: 'Getúlio Vargas',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 22,
        alternativa: 'Deodoro da Fonseca',
        correta: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 22,
        alternativa: 'Juscelino Kubitschek',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 22,
        alternativa: 'Fernando Henrique Cardoso',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 23, // O que foi a Revolução Francesa?
        alternativa: 'Conflito religioso',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 23,
        alternativa: 'Luta pela independência',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 23,
        alternativa: 'Movimento social e político',
        correta: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 23,
        alternativa: 'Guerra civil',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 24, // Importância da Independência do Brasil
        alternativa: 'Fim da escravidão',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 24,
        alternativa: 'Autonomia do Brasil',
        correta: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 24,
        alternativa: 'Proclamação da República',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 24,
        alternativa: 'Início da industrialização',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Perguntas de Inglês
      {
        pergunta_id: 25, // Cachorro em inglês
        alternativa: 'Cat',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 25,
        alternativa: 'Dog',
        correta: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 25,
        alternativa: 'Bird',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 25,
        alternativa: 'Fish',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 26, // Tradução de 'livro'
        alternativa: 'Book',
        correta: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 26,
        alternativa: 'Pen',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 26,
        alternativa: 'Paper',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 26,
        alternativa: 'Table',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 27, // Significado de 'hello'
        alternativa: 'Tchau',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 27,
        alternativa: 'Oi',
        correta: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 27,
        alternativa: 'Adeus',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        pergunta_id: 27,
        alternativa: 'Obrigado',
        correta: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('alternativas', null);
  }
};
