// src/models/respostaQuiz.js
import database from '../db/database.js';
import { DataTypes } from 'sequelize';

const RespostaQuiz = database.define('respostas_quiz', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  pergunta_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'perguntas',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  alternativa_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'alternativas',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  data_resposta: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
});

export default RespostaQuiz;
