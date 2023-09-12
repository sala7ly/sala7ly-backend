// Load Middlewares
const passwordUpdateProtectionLoader = require('./passwordUpdateProtection ');
const authMiddlewareLoader = require('./authMiddleware');

/**
 * Custom Middleware Collection
 *
 * This module exports a collection of custom middlewares designed for specific use cases in your application.
 * It includes middleware functions like `passwordUpdateProtection` that can be used to enhance request handling.
 *
 * @module middlewares/customMiddlewares/index
 * @param {Object} dependencies - Dependencies required for the middlewares.
 * @param {Object} dependencies.utils - Utility functions and classes.
 * @param {Object} dependencies.utils.AppError - The custom error class used to generate errors.
 * @returns {Object} An object containing custom middleware functions.
 *
 * @property {function} passwordUpdateProtection - Middleware for protecting routes from unintended password updates.
 *
 * @example
 * // Import the custom middleware collection
 * const customMiddlewares = require('./middleware/customMiddlewares');
 *
 * // Use a specific middleware in your Express route
 * const { passwordUpdateProtection } = customMiddlewares({ utils });
 * app.post('/update-profile', passwordUpdateProtection, (req, res) => {
 *   // Your route logic here
 * });
 */
module.exports = (dependencies) => {
    const { utils, services, libraries } = dependencies;

    // Create middlewares
    const passwordUpdateProtection = passwordUpdateProtectionLoader({
        AppError: utils.AppError,
    });

    const authMiddleware = authMiddlewareLoader({
        userService: services.userService,
        jwt: libraries.jwt,
        promisify: libraries.promisify,
        AppError: utils.AppError,
        catchAsync: utils.catchAsync,
    });

    return {
        passwordUpdateProtection,
        authMiddleware,
    };
};
