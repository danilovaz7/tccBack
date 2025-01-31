// src/models/historicoPartida.js
import database from '../db/database.js';
import { DataTypes } from 'sequelize';

const HistoricoPartida = database.define('historico_partidas', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  usuario_id_1: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  usuario_id_2: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  materia_id_1: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'materias',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  materia_id_2: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'materias',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  materia_aleatoria_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'materias',
      key: 'id',
    },
    onDelete: 'CASCADE',
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
  data_partida: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
});

export default HistoricoPartida;
