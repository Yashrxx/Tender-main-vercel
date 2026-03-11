const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Application = sequelize.define('Application', {
  tender_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tenders', // ✅ lowercase table name
      key: 'id'
    }
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'companies',
      key: 'id'
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'applications',
  timestamps: true
});

module.exports = Application;