// src/models/respostaQuiz.js
import database from '../db/database.js';
import { DataTypes } from 'sequelize';

const SalaPergunta = database.define('sala_perguntas', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  sala_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'salas',
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
 
}, {
  timestamps: true,
});

export default SalaPergunta;
