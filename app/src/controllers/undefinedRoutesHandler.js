/**
 * Creates a middleware for handling undefined routes in an Express.js application.
 *
 * @param {Object} dependencies - The dependencies object containing utility modules.
 * @param {Object} dependencies.AppError - The AppError utility module for creating application-specific errors.
 * @returns {Function} A middleware function for handling undefined routes.
 */
module.exports = (dependencies) => {
    /**
     * Middleware for handling undefined routes by creating a 404 Not Found error.
     *
     * @function
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     */
    const undefinedRoutesHandler = (req, res, next) =>
        next(
            new dependencies.AppError(
                `Can't find ${req.originalUrl} on this server!`,
                404
            )
        );

    return undefinedRoutesHandler;
};
