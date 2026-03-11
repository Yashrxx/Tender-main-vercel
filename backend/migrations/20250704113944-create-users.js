'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Applications', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      tender_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Tenders',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      company_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Companies',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      message: {
        type: Sequelize.TEXT
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Applications');
  }
};