// src/models/materia.js
import database from '../db/database.js';
import { DataTypes } from 'sequelize';

const Materia = database.define('materias', {
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
  icone: {
    type: DataTypes.STRING,
    allowNull:false
}
}, {
  timestamps: true,
});

export default Materia;
