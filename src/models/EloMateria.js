import database from '../db/database.js';
import { DataTypes } from 'sequelize';

const EloMateria = database.define('elo_materias', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
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
  materia_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'materias',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  elo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'elos', // Correção: Elo refere-se à tabela 'elos'
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  subelo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'subelos', // Correção: Subelo refere-se à tabela 'subelos'
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  respostas_corretas_elo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  respostas_corretas_total: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  timestamps: true,
});

export default EloMateria;
