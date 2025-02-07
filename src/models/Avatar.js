// src/models/materia.js
import database from '../db/database.js';
import { DataTypes } from 'sequelize';

const Avatar = database.define('avatares', {
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
  caminho: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: true,
});

export default Avatar;
