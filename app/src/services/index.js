// Import dependencies
const models = require('../models');
const service = require('./service');

// Load Services
const userService = require('./userService')(models.User, service);

module.exports = {
    userService,
};
