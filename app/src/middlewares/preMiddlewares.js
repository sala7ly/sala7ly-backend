// Access envienvironment mode (e.g., 'development', 'production', 'testing')
const { NODE_ENV: MODE } = process.env;

/**
 * Pre-Middlewares Configuration
 *
 * This module configures and applies pre-middlewares to an Express application based on the current environment.
 *
 * @module middlewares/preMiddlewares
 * @param {Express} app - The Express application instance.
 * @param {Object} dependencies - An object containing middleware dependencies.
 * @param {function} dependencies.morgan - The Morgan logger middleware function.
 * @param {function} dependencies.json - The JSON body parser middleware function.
 * @param {function} dependencies.cookieParser - The Cookie Parser middleware function.
 *
 * @example
 * const express = require('express');
 * const morgan = require('morgan');
 * const { json } = require('express');
 * const cookieParser = require('cookie-parser');
 * const preMiddlewares = require('./middlewares/preMiddlewares');
 *
 * const app = express();
 *
 * // Configure pre-middlewares
 * preMiddlewares(app, { morgan, json, cookieParser });
 */
module.exports = (app, dependencies) => {
    /**
     * Apply development-specific pre-middlewares.
     * @function
     * @name module:middlewares/preMiddlewares#applyDevelopmentMiddlewares
     * @param {Express} app - The Express application instance.
     * @param {function} morgan - The Morgan logger middleware function.
     */
    const applyDevelopmentMiddlewares = (app, morgan) => {
        // Log requested endpoints in development mode
        app.use(morgan('dev'));
    };

    // Apply pre-middlewares based on the environment
    if (MODE === 'development') {
        applyDevelopmentMiddlewares(app, dependencies.morgan);
    }

    // Parse JSON bodies
    app.use(dependencies.json({ limit: '10kb' }));
    app.use(dependencies.urlencoded({ extended: true, limit: '10kb' }));

    // Parse cookies
    app.use(dependencies.cookieParser());

    // enable CORS
    app.use(dependencies.cors());
};
