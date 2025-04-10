// src/models/respostaQuiz.js
import database from '../db/database.js';
import { DataTypes } from 'sequelize';

const SalaAlunoResposta = database.define('sala_aluno_respostas', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  sala_pergunta_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'sala_perguntas',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  sala_aluno_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'sala_alunos',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  resposta_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'alternativas',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
 
}, {
  timestamps: true,
});

export default SalaAlunoResposta;
