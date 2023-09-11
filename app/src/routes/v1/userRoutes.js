/**
 * User Routes Module
 * @module routes/v1/userRoutes
 * @param {Object} dependencies - A set of dependencies required for route handling.
 * @param {Object} dependencies.userController - The controller object with user-related methods.
 * @param {Object} dependencies.Router - The router object for defining API routes.
 * @returns {Object} - An Express router object with user-related routes.
 */
module.exports = (dependencies) => {
    const { userController, Router, middlewares } = dependencies;
    const router = Router();

    // Define routes for user operations
    router
        .route('/')
        .get(userController.getAllUsers)
        .post(userController.createUser);

    router
        .route('/:id')
        .get(userController.getUserById)
        .patch(middlewares.passwordUpdateProtection, userController.updateUser)
        .delete(userController.deleteUser);

    return router;
};
