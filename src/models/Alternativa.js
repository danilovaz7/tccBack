// src/models/alternativa.js
import database from '../db/database.js';
import { DataTypes } from 'sequelize';

const Alternativa = database.define('alternativas', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
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
  alternativa: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  correta: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  timestamps: true,
});

export default Alternativa;
