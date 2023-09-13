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

// Load auth controller
const authController = require('./authController')({
    service: services.authService,
    utils,
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

    /**
     * @type {Object}
     * @property {Function} register - A function to register a new user.
     * @property {Function} login - A function to log in a user.
     * @property {Function} forgetPassword - A function to initiate password reset.
     * @property {Function} resetPassword - A function to reset a user's password.
     * @property {Function} updatePassword - A function to update a user's password.
     * @property {Function} getMe - A function to retrieve authenticated user data.
     * @property {Function} updateMe - A function to update authenticated user data.
     * @property {Function} logout - A function to log out the authenticated user.
     */
    authController,

    errorController: {
        undefinedRoutesHandler,
        globalErrorHandler,
    },
};
