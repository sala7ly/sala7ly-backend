/**
 * Module representing Mongoose models for the application.
 * @module models
 * @typedef {import('mongoose').Model} User
 * @typedef {import('mongoose').Model} ClientProfile
 * @typedef {import('mongoose').Model} CraftsmanProfile
 * @typedef {import('mongoose').Model} Availability
 * @typedef {import('mongoose').Model} Booking
 * @typedef {import('mongoose').Model} Project
 * @typedef {import('mongoose').Model} Review
 * @typedef {import('mongoose').Model} Chat
 * @typedef {import('mongoose').Model} Message
 * @typedef {import('mongoose').Model} Notification
 */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

//Creates and exports the User model.
const User = require('./User')(mongoose, { validator, bcrypt });

//Creates and exports the ClientProfile model.
const ClientProfile = require('./ClientProfile')(mongoose);

//Creates and exports the CraftsmanProfile model.
const CraftsmanProfile = require('./CraftsmanProfile')(mongoose);

//Creates and exports the Availability model.
const Availability = require('./Availability')(mongoose);

//Creates and exports the Booking model.
const Booking = require('./Booking')(mongoose, validator);

//Creates and exports the Project model.
const Project = require('./Project')(mongoose);

//Creates and exports the Review model.
const Review = require('./Review')(mongoose);

//Creates and exports the Chat model.
const Chat = require('./Chat')(mongoose);

//Creates and exports the Message model.
const Message = require('./Message')(mongoose);

//Creates and exports the Notification model.
const Notification = require('./Notification')(mongoose);

module.exports = {
    User,
    ClientProfile,
    CraftsmanProfile,
    Availability,
    Booking,
    Project,
    Review,
    Chat,
    Message,
    Notification,
};
