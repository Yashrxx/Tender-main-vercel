const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DATABASE,
  "tender_client_user",
  process.env.PASSWORD,
  {
    host: process.env.HOSTNAME,
    dialect: 'postgres',
    port: process.env.PORT_DB || 5432, // use PORT_DB for database
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false,
  }
);

module.exports = sequelize;