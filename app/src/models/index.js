/**
 * Module representing Mongoose models for the application.
 * @module models
 */

const mongoose = require('mongoose');
const validator = require('validator');

//Creates and exports the User model.
const User = require('./User')(mongoose, validator);

module.exports = {
    User,
};
