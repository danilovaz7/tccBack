// src/models/respostaQuiz.js
import database from '../db/database.js';
import { DataTypes } from 'sequelize';

const SalaAluno = database.define('sala_alunos', {
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
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
 
}, {
  timestamps: true,
});

export default SalaAluno;
