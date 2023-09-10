/**
 * Post-middlewares for setting up error handling in the Express application.
 *
 * @param {Express} app - The Express application.
 * @param {Object} errorHandlers - Error handling middleware functions.
 * @param {Function} errorHandlers.undefinedRoutesHandler - Middleware for handling undefined routes (404).
 * @param {Function} errorHandlers.globalErrorHandler - Global error handling middleware.
 *
 * @example
 * const express = require('express');
 * const app = express();
 * const errorHandlers = require('../controllers/errorController');
 *
 * // Attach post middlewares to the Express application
 * require('./postMiddlewares')(app, errorHandlers);
 */
module.exports = (app, errorHandlers) => {
    // error handling for undefined routes
    app.all('*', errorHandlers.undefinedRoutesHandler);

    // global error handling
    app.use(errorHandlers.globalErrorHandler);
};
