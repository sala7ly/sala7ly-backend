// Import dependencies
const morgan = require('morgan');
const { json, urlencoded } = require('express');
const cookieParser = require('cookie-parser');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { errorController } = require('../controllers');
const services = require('../services');

const utils = require('../utils');

// Load middlewares
const preMiddlewares = require('./preMiddlewares');
const postMiddlewares = require('./postMiddlewares');
const customMiddlewares = require('./customMiddlewares')({
    utils,
    services,
    libraries: {
        promisify,
        jwt,
    },
});

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
            cors,
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
