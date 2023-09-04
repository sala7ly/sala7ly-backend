/**
 * Module representing Mongoose models for the application.
 * @module models
 */

const mongoose = require('mongoose');
const validator = require('validator');

//Creates and exports the User model.
const User = require('./User')(mongoose, validator);

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

module.exports = {
    User,
    ClientProfile,
    CraftsmanProfile,
    Availability,
    Booking,
    Project,
    Review,
    Chat,
};
