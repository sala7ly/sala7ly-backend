/**
 * Authentication Middleware
 *
 * This module exports middleware functions for user authentication and authorization.
 * It includes 'protect' middleware for verifying user authentication and 'authorize'
 * middleware for checking user roles and permissions.
 *
 * @module middlewares/authMiddleware
 * @param {Object} dependencies - An object containing the required dependencies.
 * @param {Object} dependencies.userService - The user service for interacting with user data.
 * @param {Object} dependencies.jwt - The JSON Web Token library for token operations.
 * @param {Function} dependencies.promisify - A utility function for promisifying asynchronous operations.
 * @param {Object} dependencies.AppError - The custom error class for handling application errors.
 * @param {Function} dependencies.catchAsync - A utility function for handling asynchronous errors.
 * @returns {Object} - An object with middleware functions for authentication and authorization.
 *
 * @property {function} protect - Middleware for protecting routes from unauthenticated access.
 * @property {function} authorize - Middleware for authorizing user roles and permissions.
 *
 * @throws {AppError} If authentication or authorization fails.
 *
 * @example
 * // Import the authMiddleware module
 * const authMiddleware = require('./middlewares/authMiddleware');
 *
 * // Use 'protect' middleware to protect a route
 * app.get('/protected-route', authMiddleware.protect, (req, res) => {
 *   // Your protected route logic here
 * });
 *
 * // Use 'authorize' middleware to check user roles
 * app.put('/admin-action', authMiddleware.authorize('admin'), (req, res) => {
 *   // Your admin-only action logic here
 * });
 */
module.exports = (dependencies) => {
    const { userService, jwt, promisify, AppError, catchAsync } = dependencies;

    /**
     * Middleware to protect routes from unauthenticated access.
     *
     * This middleware verifies user authentication by checking for a valid token
     * in the request header or cookies, and then decodes and verifies the token's
     * validity. It also ensures that the user still exists in the database.
     *
     * @function
     * @name protect
     * @param {Object} req - The Express request object.
     * @param {Object} res - The Express response object.
     * @param {function} next - The next middleware function in the chain.
     * @throws {AppError} If authentication fails.
     */
    const protect = catchAsync(async (req, res, next) => {
        // Check if there is a token in the request header or in the cookies
        if (
            (!req.headers.authorization ||
                !req.headers.authorization.startsWith('Bearer')) &&
            !req.cookies.jwt
        ) {
            return next(
                new AppError(
                    'You are not logged in. Please log in to get access.',
                    401
                )
            );
        }

        // Verify the token
        const token =
            req.cookies.jwt || req.headers.authorization.split(' ')[1];

        const { JWT_SECRET } = process.env;

        const decoded = await promisify(jwt.verify)(token, JWT_SECRET);

        // Check if user is still exists
        const isExist = await userService.isExist(decoded.id);

        if (!isExist) {
            return next(
                new AppError(
                    'The user belonging to this token does no longer exist.',
                    401
                )
            );
        }

        const user = await userService.getUserById(decoded.id);

        // Grant Access to protected route
        req.user = user;

        return next();
    });

    /**
     * Middleware to authorize user roles.
     *
     * This middleware checks if the authenticated user has the required roles
     * to access a specific route or perform an action.
     *
     * @function
     * @name authorize
     * @param {...string} roles - The roles allowed to access the route.
     * @param {Object} req - The Express request object.
     * @param {Object} res - The Express response object.
     * @param {function} next - The next middleware function in the chain.
     * @throws {AppError} If authorization fails.
     */
    const authorize =
        (...roles) =>
        (req, res, next) => {
            // Check if user has the required role
            if (!roles.includes(req.user.role)) {
                return next(
                    new AppError(
                        'You do not have permission to perform this action.',
                        403
                    )
                );
            }

            return next();
        };

    return {
        protect,
        authorize,
    };
};
