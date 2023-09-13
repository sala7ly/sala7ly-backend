/**
 * Middleware for Password Update Route Protection
 *
 * This middleware is used to protect routes that are not intended for password updates.
 * It checks if the request body contains `password` or `passwordConfirm` fields and generates an error
 * using the `AppError` class if either of these fields is present.
 *
 * @param {Object} dependencies - Dependencies required for the middleware.
 * @param {Object} dependencies.AppError - The custom error class used to generate errors.
 * @returns {function} Express middleware function.
 *
 * @throws {AppError} If the request body contains `password` or `passwordConfirm` fields.
 *
 * @example
 * // Import the middleware
 * const passwordUpdateProtection = require('./middleware/passwordUpdateProtection');
 *
 * // Use the middleware in your Express route
 * app.post('/update-profile', passwordUpdateProtection({ AppError }), (req, res) => {
 *   // Your route logic here
 * });
 */
module.exports = (dependencies) => {
    const { AppError } = dependencies;

    return (req, res, next) => {
        if (req.body.password || req.body.passwordConfirm) {
            return next(
                new AppError('This route is not for password updates', 400)
            );
        }
        return next();
    };
};
