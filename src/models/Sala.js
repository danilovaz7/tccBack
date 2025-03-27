// src/models/respostaQuiz.js
import database from '../db/database.js';
import { DataTypes } from 'sequelize';

const Sala = database.define('salas', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  codigo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'aberta'
  },
  vencedor_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'usuarios',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
 
}, {
  timestamps: true,
});

export default Sala;
