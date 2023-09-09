const catchAsync = require('./catchAsync');
const StandardJsonResponse = require('./StandardJsonResponse');
const AppError = require('./AppError');

/**
 * A module that exports utility functions and classes for handling errors and asynchronous operations.
 * @module
 */
module.exports = {
    /**
     * A utility function for catching and handling asynchronous errors in Express route handlers.
     * @type {Function}
     */
    catchAsync,

    /**
     * A class for creating standard JSON responses in Express route handlers.
     * @type {Class}
     */
    StandardJsonResponse,

    /**
     * A class for representing custom application errors in Express route handlers.
     * @type {Class}
     */
    AppError,
};
