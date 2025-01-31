// src/models/materia.js
import database from '../db/database.js';
import { DataTypes } from 'sequelize';

const Elo = database.define('elos', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  elo1: {
    type: DataTypes.STRING,
    allowNull: false
  },
  elo2: {
    type: DataTypes.STRING,
    allowNull: false
  }, 
  elo3: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true,
});

export default Elo;
