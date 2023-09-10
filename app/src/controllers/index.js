// Import dependencies
const models = require('../models');
const services = require('../services');
const utils = require('../utils');

// Load controllers
const undefinedRoutesHandler = require('./undefinedRoutesHandler')({
    AppError: utils.AppError,
});

const globalErrorHandler = require('./globalErrorHandler')({
    AppError: utils.AppError,
    StandardJsonResponse: utils.StandardJsonResponse,
});

/**
 * Module that exports controller functions and handlers.
 *
 * @module controllers/index
 * @property {Object} errorController - Contains error handling controller functions.
 * @property {Function} errorController.undefinedRoutesHandler - Handles undefined routes.
 * @property {Function} errorController.globalErrorHandler - Handles global errors.
 */
module.exports = {
    errorController: {
        undefinedRoutesHandler,
        globalErrorHandler,
    },
};
