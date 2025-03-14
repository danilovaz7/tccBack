// src/models/pergunta.js
import database from '../db/database.js';
import { DataTypes } from 'sequelize';

const Pergunta = database.define('perguntas', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  materia_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'materias',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  turma_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'turmas',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  elo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'elos',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  pergunta: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  timestamps: true,
});

export default Pergunta;
