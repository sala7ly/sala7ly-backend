// Load Routers
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');

/**
 * Version 1 (v1) API Routes Module
 *
 * @module routes/v1/index
 * @param {Object} dependencies - An object containing the required dependencies for setting up the routes.
 * @param {Object} dependencies.Router - The Express router object to define routes.
 * @param {Object} dependencies.controllers - An object containing the controllers for various API endpoints.
 * @param {Object} dependencies.middlewares - An object containing middleware functions.
 * @returns {Object} - An Express router object that defines the v1 API routes.
 *
 * @example
 * // Import the v1 API routes module
 * const v1Routes = require('./v1');
 *
 * // Use the v1Routes module to define version 1 (v1) API routes
 * app.use('/api/v1', v1Routes({ Router, controllers, middlewares }));
 */
module.exports = (dependencies) => {
    const { Router, controllers, middlewares } = dependencies;
    const routesV1 = Router();

    routesV1.use(
        '/users',
        userRoutes({
            Router,
            userController: controllers.userController,
            middlewares,
        })
    );

    routesV1.use(
        '/auth',
        authRoutes({
            Router,
            authController: controllers.authController,
            middlewares,
        })
    );

    return routesV1;
};
