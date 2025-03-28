'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.createTable('escolas', {
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

    await queryInterface.createTable('turmas', {
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

    await queryInterface.createTable('avatares', {
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
      caminho: {
        type: Sequelize.TEXT,
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
      genero: {
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
      id_avatar: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'avatares',
          key: 'id',
        },
        onUpdate: 'CASCADE'
      },
      id_turma: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'turmas',
          key: 'id',
        },
        onUpdate: 'CASCADE'
      },
      id_escola: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'escolas',
          key: 'id',
        },
        onUpdate: 'CASCADE'
      },
      tipo_usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tipo_usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE'
      },
      id_materia: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'materias',
          key: 'id',
        },
        onUpdate: 'CASCADE'
      },
      ic_ativo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 1,
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
      respostas_corretas_elo: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      respostas_corretas_total: {
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
      unique_elo_per_usuario_materia: {
        type: Sequelize.STRING,
        unique: true,
      }
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
      elo_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'elos',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      turma_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'turmas',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      escola_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'escolas',
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
      total_perguntas: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      total_perguntas_acertadas: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      total_disputas: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      total_disputas_ganhas: {
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

    await queryInterface.createTable('salas', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      codigo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'aberta' 
      },
      host_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'usuarios',
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
        allowNull: true,
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

    await queryInterface.createTable('sala_alunos', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      sala_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'salas',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      usuario_id                         : {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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

    
  },

  async down (queryInterface, Sequelize) {
    // Remover tabelas na ordem inversa da criação
    await queryInterface.dropTable('estatisticas_gerais');
    await queryInterface.dropTable('respostas_quiz');
    await queryInterface.dropTable('alternativas');
    await queryInterface.dropTable('perguntas');
    await queryInterface.dropTable('elo_materias');
    await queryInterface.dropTable('subelos');
    await queryInterface.dropTable('elos');
    await queryInterface.dropTable('sala_alunos');
    await queryInterface.dropTable('salas');
    await queryInterface.dropTable('usuarios');
    await queryInterface.dropTable('materias');
    await queryInterface.dropTable('avatares');
    await queryInterface.dropTable('turmas');
    await queryInterface.dropTable('escolas');
    await queryInterface.dropTable('tipo_usuarios');
  }
};
