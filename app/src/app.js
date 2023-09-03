const express = require('express');

/**
 * Creates and configures an Express.js application.
 *
 * @param {Database} database - The Database object used for database connection.
 * @returns {Express} An instance of the configured Express application.
 * @throws {Error} If the database connection fails.
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

    return app;
}

module.exports = createApp;
