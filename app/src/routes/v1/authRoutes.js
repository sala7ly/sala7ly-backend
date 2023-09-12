/**
 * Authentication Routes Module (Version 1)
 *
 * @module routes/v1/authRoutes
 * @param {Object} dependencies - A set of dependencies required for route handling.
 * @param {Object} dependencies.Router - The Express router object for defining API routes.
 * @param {Object} dependencies.authController - The controller object with authentication-related methods.
 * @param {Object} dependencies.middlewares - An object containing middleware functions.
 * @returns {Object} - An Express router object with authentication-related routes.
 *
 * @example
 * const authRoutes = require('./authRoutes');
 *
 * // Use the authRoutes module to define authentication-related routes
 * app.use('/api/v1/auth', authRoutes({ Router, authController, middlewares }));
 */
module.exports = (dependencies) => {
    const { Router, authController, middlewares } = dependencies;
    const router = Router();

    // Define routes for authentication operations
    router.route('/register').post(authController.register);
    router.route('/login').post(authController.login);
    router.route('/forgot_password').post(authController.forgetPassword);
    router
        .route('/reset_password/:resetToken')
        .put(authController.resetPassword);

    // Protect routes with authentication middleware
    router.use(middlewares.authMiddleware.protect);

    router.route('/update_me').patch(authController.updateMe);
    router.route('/update_password').patch(authController.updatePassword);
    router.route('/me').get(authController.getMe);
    router.route('/logout').get(authController.logout);

    return router;
};
