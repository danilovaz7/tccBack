// src/models/tipoUsuario.js
import database from '../db/database.js';
import { DataTypes } from 'sequelize';

const Escolas = database.define('escolas', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Cada tipo de usuário deve ser único
  },
}, {
  timestamps: true,
});

export default Escolas;
