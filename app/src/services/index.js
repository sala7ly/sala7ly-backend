// Import dependencies
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const models = require('../models');
const service = require('./service');
const utils = require('../utils');

// Load Services
const userService = require('./userService')(models.User, service);
const authService = require('./authService')({
    model: models.User,
    utils,
    libraries: {
        jwt,
        bcrypt,
        crypto,
    },
});

/**
 * Service Modules Index
 * @module services
 * @description
 * This module acts as an index for all service modules within the application.
 * It initializes and exports service instances for various application components.
 *
 * @property {Object} userService - Service module for user-related operations.
 * @property {Object} authService - Service module for user authentication and authorization.
 *
 * @see {@link module:services/userService} for user service methods.
 * @see {@link module:services/authService} for authentication service methods.
 * @see {@link module:models} for Mongoose models used in the application.
 * @see {@link module:utils} for utility functions and classes.
 *
 * @example
 * // Import and use the service modules
 * const { userService, authService } = require('./services');
 * // Use userService methods
 * const users = await userService.getAllUsers();
 * // Use authService methods
 * const token = await authService.login({ email: 'user@example.com', password: 'password123' });
 */
module.exports = {
    userService,
    authService,
};
