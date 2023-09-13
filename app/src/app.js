// Import dependencies
const express = require('express');
const middlewareLoader = require('./middlewares');
const routes = require('./routes');

/**
 * Creates and configures an Express.js application.
 *
 * @function createApp
 * @param {Database} database - The Database object used for database connection.
 * @returns {Express} An instance of the configured Express application.
 * @throws {Error} If the database connection fails.
 * @example
 * const database = new Database(config);
 * const app = createApp(database);
 */
async function createApp(database) {
    // Connect to database
    database
        .connect()
        .then(
            console.log(
                '('.cyan.underline.bold.italic +
                    database.databaseName.brightYellow.underline.bold.italic +
                    ') Database Connected🚀...'.cyan.underline.bold.italic
            )
        );

    // Create express app
    const app = express();

    middlewareLoader(app).pre();

    // Mount routes
    routes(app, middlewareLoader(app).customMiddlewares);

    middlewareLoader(app).post();

    return app;
}

module.exports = createApp;
