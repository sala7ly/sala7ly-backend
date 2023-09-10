// Import dependencies
const express = require('express');
const middlewareLoader = require('./middlewares');

/**
 * Creates and configures an Express.js application.
 *
 * @param {Database} database - The Database object used for database connection.
 * @returns {Express} An instance of the configured Express application.
 * @throws {Error} If the database connection fails.
 *
 * @example
 * // Create and configure an Express app with a connected database.
 * const app = createApp(database);
 */
async function createApp(database) {
    // connect to database
    database
        .connect()
        .then(
            console.log(
                '('.cyan.underline.bold.italic +
                    database.databaseName.brightYellow.underline.bold.italic +
                    ') Database Connected🚀...'.cyan.underline.bold.italic
            )
        );

    // create express app
    const app = express();

    middlewareLoader(app).pre();

    middlewareLoader(app).post();

    return app;
}

module.exports = createApp;
