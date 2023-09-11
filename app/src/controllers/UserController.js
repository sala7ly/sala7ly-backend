/**
 * User Controller Module
 * @module userController
 * @param {Object} dependencies - An object containing required dependencies.
 * @param {Object} dependencies.userService - The user service object for handling user-related operations.
 * @param {Object} dependencies.utils - Utility functions and classes.
 * @param {Object} dependencies.controller - The controller object containing common CRUD operations.
 *
 * @typedef {Object} UserController
 * @property {Function} getAllUsers - A function to retrieve all users.
 * @property {Function} getUserById - A function to retrieve a user by their unique identifier.
 * @property {Function} createUser - A function to create a new user.
 * @property {Function} updateUser - A function to update an existing user.
 * @property {Function} deleteUser - A function to delete a user.
 *
 * @returns {UserController} An object containing user-related controller functions.
 * @see {@link module:controller} For methods provided by the controller object.
 */
module.exports = (dependencies) => {
    const { userService, utils, controller } = dependencies;
    const controllerObj = controller(userService, utils, 'User');

    /**
     * @route GET /api/v1/users
     * @desc Get all users from the database and send a success response with the users data.
     * @access private
     * @auth ['admin']
     */
    const getAllUsers = controllerObj.getAll({});

    /**
     * @route GET /api/v1/users/:id
     * @desc Get a single user by id from the database and send a success response with the user data.
     * @access private
     * @auth ['admin']
     */
    const getUserById = controllerObj.getOneById({});

    /**
     * @route POST /api/v1/users
     * @desc Create a new User and insert it in database and send a success response with the user data.
     * @access private
     * @auth ['admin']
     */
    const createUser = controllerObj.createOne();

    /**
     * @route POST /api/v1/users/:id
     * @desc Update a User by Id in database and send a success response with the User data.
     * @access private
     * @auth ['admin']
     */
    const updateUser = controllerObj.updateOneById();

    /**
     * @route Delete /api/v1/users/:id
     * @desc Delete User from database and send a success response.
     * @access private
     * @auth ['admin']
     */
    const deleteUser = controllerObj.deleteOneById();

    return {
        getAllUsers,
        getUserById,
        createUser,
        updateUser,
        deleteUser,
    };
};
