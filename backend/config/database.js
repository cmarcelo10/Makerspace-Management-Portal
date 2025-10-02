/**
 * Configures and exports the Sequelize instance used to connect to the PostgreSQL database.
 * The Sequelize instance is imported into other parts of the application that need to interact with the database.
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();
// Set up PostgreSQL database connection using environment variables
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: console.log,
    }
);

module.exports = sequelize;
