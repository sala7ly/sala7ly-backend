// Load Routers
const userRoutes = require('./userRoutes');

/**
 * Version 1 (v1) API Routes Module
 * @module routes/v1/index
 * @param {Object} dependencies - An object containing the required dependencies for setting up the routes.
 * @param {Object} dependencies.Router - The Express router object to define routes.
 * @param {Object} dependencies.controllers - An object containing the controllers for various API endpoints.
 * @returns {Object} - An Express router object that defines the v1 API routes.s.
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

    return routesV1;
};
