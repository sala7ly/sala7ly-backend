// Import dependencies
const services = require('../services');
const utils = require('../utils');

// Load controllers
const controller = require('./controller');

// Load user controller
const userController = require('./userController')({
    userService: services.userService,
    utils,
    controller,
});

// Load undefined routes handler
const undefinedRoutesHandler = require('./undefinedRoutesHandler')({
    AppError: utils.AppError,
});

// Load global error handler
const globalErrorHandler = require('./globalErrorHandler')({
    AppError: utils.AppError,
    StandardJsonResponse: utils.StandardJsonResponse,
});

/**
 * Module that exports controller functions and error handlers.
 *
 * @module controllers/index
 * @property {Object} userController - Contains user-related controller functions.
 * @property {Object} errorController - Contains error handling controller functions.
 * @property {Function} errorController.undefinedRoutesHandler - Handles undefined routes.
 * @property {Function} errorController.globalErrorHandler - Handles global errors.
 */
module.exports = {
    /**
     * @type {Object}
     * @property {Function} getAllUsers - A function that retrieves all users.
     * @property {Function} getUserById - A function that retrieves a user by ID.
     * @property {Function} createUser - A function that creates a new user.
     * @property {Function} updateUser - A function that updates a user.
     * @property {Function} deleteUser - A function that deletes a user.
     */
    userController,
    errorController: {
        undefinedRoutesHandler,
        globalErrorHandler,
    },
};
