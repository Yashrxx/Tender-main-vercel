const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Tender = sequelize.define('Tender', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  budget: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: 'General',
  },
  location: {
    type: DataTypes.STRING,
    defaultValue: 'Not Specified',
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Open',
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'companies',
      key: 'id'
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'tenders',
  timestamps: false
});

module.exports = Tender;
