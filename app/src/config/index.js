require('colors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const configENV = `${__dirname}/.env`;
dotenv.config({ path: configENV }); // Load environment variables

const Database = require('./Database');

/**
 * Represents the configuration module for the application.
 * @module config/index
 */

// Environment variables
const {
    NODE_ENV: MODE,
    DATABASE_URI,
    DATABASE,
    DATABASE_TEST,
    DATABASE_PASSWORD,
} = process.env;

/**
 * Create a new instance of the Database class for managing MongoDB connections.
 *
 * @type {Database}
 */
const database = new Database(mongoose, {
    databaseURI: DATABASE_URI,
    databaseName: MODE === 'testing' ? DATABASE_TEST : DATABASE,
    databasePassword: DATABASE_PASSWORD,
});

/**
 * Export the configured database instance.
 * @type {Database}
 */
module.exports = database;
