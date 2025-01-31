'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.createTable('tipo_usuarios', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Tabela de usuários
    await queryInterface.createTable('usuarios', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      senha: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      foto: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      nivel: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      matricula: {
        type: Sequelize.STRING,
        unique: true,
      },
      experiencia: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      tipo_usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tipo_usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Tabela de matérias
    await queryInterface.createTable('materias', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      nome: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      icone: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

     // Criar a tabela de elos
     await queryInterface.createTable('elos', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      nome: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      elo1: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      elo2: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      elo3: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Criar a tabela de subelos
    await queryInterface.createTable('subelos', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      nome: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Modificar a tabela de elo_materias para usar a nova estrutura de elos e subelos
    await queryInterface.createTable('elo_materias', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      materia_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'materias',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      elo_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'elos',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      subelo_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'subelos',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: true,
      },
      perguntas_acertadas: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      // Garantir que o elo de um usuário para uma matéria seja único
      unique_elo_per_usuario_materia: {
        type: Sequelize.STRING,
        unique: true,
      }
    });
    // Tabela de histórico de partidas
    await queryInterface.createTable('historico_partidas', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      usuario_id_1: {
        type: Sequelize.INTEGER,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      usuario_id_2: {
        type: Sequelize.INTEGER,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      materia_id_1: {
        type: Sequelize.INTEGER,
        references: {
          model: 'materias',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      materia_id_2: {
        type: Sequelize.INTEGER,
        references: {
          model: 'materias',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      materia_aleatoria_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'materias',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      vencedor_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      data_partida: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Tabela de perguntas
    await queryInterface.createTable('perguntas', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      materia_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'materias',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      pergunta: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Tabela de alternativas
    await queryInterface.createTable('alternativas', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      pergunta_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'perguntas',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      alternativa: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      correta: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Tabela de respostas de quiz
    await queryInterface.createTable('respostas_quiz', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      pergunta_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'perguntas',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      alternativa_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'alternativas',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      data_resposta: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Tabela de estatísticas gerais
    await queryInterface.createTable('estatisticas_gerais', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      total_perguntas_acertadas: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      total_disputas_ganhas: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      total_perguntas_respostas: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

  },

  async down (queryInterface, Sequelize) {
    // Remover tabelas na ordem inversa da criação
    await queryInterface.dropTable('estatisticas_gerais');
    await queryInterface.dropTable('respostas_quiz');
    await queryInterface.dropTable('alternativas');
    await queryInterface.dropTable('perguntas');
    await queryInterface.dropTable('historico_partidas');
    await queryInterface.dropTable('elo_materias');
    await queryInterface.dropTable('subelos');
    await queryInterface.dropTable('elos');
    await queryInterface.dropTable('materias');
    await queryInterface.dropTable('usuarios');
    await queryInterface.dropTable('tipo_usuarios');
  }
};
