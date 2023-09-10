// Import dependencies
const morgan = require('morgan');
const { json } = require('express');
const cookieParser = require('cookie-parser');
const { errorController } = require('../controllers');

// Load middlewares
const preMiddlewares = require('./preMiddlewares');
const postMiddlewares = require('./postMiddlewares');

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
});
