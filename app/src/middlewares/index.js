// Import dependencies
const morgan = require('morgan');
const { json, urlencoded } = require('express');
const cookieParser = require('cookie-parser');
const { errorController } = require('../controllers');

const utils = require('../utils');

// Load middlewares
const preMiddlewares = require('./preMiddlewares');
const postMiddlewares = require('./postMiddlewares');
const customMiddlewares = require('./customMiddlewares')({ utils });

/**
 * Middleware Loader
 *
 * This module serves as a middleware loader for your Express application.
 * It loads and configures various middleware functions and exposes them as pre and post middleware chains.
 *
 * @module middlewares/index
 * @param {Express} app - The Express application instance.
 * @returns {Object} An object with methods to load pre and post middlewares.
 *
 * @example
 * const middlewareLoader = require('./middlewares');
 *
 * // Load pre-middlewares
 * middlewareLoader(app).pre();
 *
 * // Load post-middlewares with error controller
 * middlewareLoader(app).post();
 *
 * // Access custom middlewares
 * const { customMiddlewares } = middlewareLoader(app);
 * app.post('/custom', customMiddlewares.someMiddleware, (req, res) => {
 *   // Y;
 */
module.exports = (app) => ({
    /**
     * Load pre-middlewares.
     * @function
     * @name module:middlewares/index#pre
     */
    pre() {
        preMiddlewares(app, {
            morgan,
            json,
            urlencoded,
            cookieParser,
        });
    },

    /**
     * Load post-middlewares with an error controller.
     * @function
     * @name module:middlewares/index#post
     */
    post() {
        postMiddlewares(app, errorController);
    },

    /**
     * Custom middlewares for specific use cases.
     * @type {Object}
     * @name module:middlewares/index#customMiddlewares
     */
    customMiddlewares,
});
