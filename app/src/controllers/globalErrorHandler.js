// Access envienvironment mode (e.g., 'development', 'production', 'testing')
const { NODE_ENV: MODE } = process.env;

/**
 * Creates a global error handling middleware for an Express.js application.
 *
 * @param {Object} dependencies - The dependencies object containing utility modules.
 * @param {Object} dependencies.AppError - The AppError utility module for creating application-specific errors.
 * @param {Object} dependencies.StandardJsonResponse - The StandardJsonResponse utility module for generating standardized JSON responses.
 * @returns {Function} A middleware function for handling global errors.
 */
module.exports = (dependencies) => {
    const { AppError, StandardJsonResponse } = dependencies;

    /**
     * Handles cast errors that occur in the database.
     *
     * @function
     * @param {Error} err - The cast error object.
     * @returns {AppError} - An instance of AppError with a message describing the error.
     */
    const handleCastErrorDB = function (err) {
        const message = `Invalid ${err.path}: ${err.value}`;
        return new AppError(message, 400);
    };

    /**
     * Handles duplicate fields errors that occur in the database.
     * @function handleDuplicateFieldsDB
     * @param {Error} err - The duplicate fields error object.
     * @returns {AppError} - An instance of AppError with a message describing the error.
     */
    const handleDuplicateFieldsDB = function (err) {
        const value = err.message.match(/(["'])(\\?.)*?\1/)[0].slice(1, -1);
        const message = `Duplicate field value: ${value}, Please use another value!`;
        return new AppError(message, 400);
    };

    /**
     * Handles validation errors that occur in the database.
     * @function handleValidationErrorDB
     * @param {Error} err - The validation error object.
     * @returns {AppError} - An instance of AppError with a message describing the error.
     */
    const handleValidationErrorDB = function (err) {
        const errors = Object.values(err.errors).map((el) => el.message);
        const message = `Invalid input data. ${errors.join('. ')}`;

        return new AppError(message, 400);
    };

    /**
     * Sends error response in development environment.
     * @function sendErrorDev
     * @param {Error} err - The error object.
     * @param {object} req - The request object.
     * @param {object} res - The response object.
     */
    const sendErrorDev = (err, req, res) => {
        console.log(err.message.brightRed);

        return new StandardJsonResponse(res, err.statusCode)
            .setMainContent(false, 'something went wrong')
            .setFailedPayload({
                status: err.status,
                error: err,
                message: err.message,
                stack: err.stack,
            })
            .send();
    };

    /**
     * Sends error response in production environment.
     * @function sendErrorProd
     * @param {Error} err - The error object.
     * @param {object} req - The request object.
     * @param {object} res - The response object.
     */
    const sendErrorProd = (err, req, res) => {
        if (err.isOperational) {
            return new StandardJsonResponse(res, err.statusCode)
                .setMainContent(false, 'something went wrong')
                .setFailedPayload({
                    status: err.status,
                    message: err.message,
                })
                .send();
        }

        console.error('ERROR 💥', err);

        return new StandardJsonResponse(res, 500)
            .setMainContent(false, 'something went wrong')
            .setFailedPayload({
                status: 'error',
                message: 'Something went very wrong!',
            })
            .send();
    };

    /**
     * Global error handler middleware.
     * @function globalErrorHandeler
     * @param {Error} err - The error object.
     * @param {object} req - The request object.
     * @param {object} res - The response object.
     * @param {function} next - The next middleware function.
     */
    const globalErrorHandeler = (err, req, res, next) => {
        err.statusCode = err.statusCode || 500;
        err.status = err.status || 'Error';

        if (MODE === 'development') {
            sendErrorDev(err, req, res);
        } else {
            let error = { ...err, name: err.name, message: err.message };

            // mongooses errors
            if (error.name === 'CastError') {
                error = handleCastErrorDB(error);
            } else if (error.code === 11000) {
                error = handleDuplicateFieldsDB(error);
            } else if (err.name === 'ValidationError') {
                error = handleValidationErrorDB(error);
            }

            sendErrorProd(error, req, res);
        }
    };

    return globalErrorHandeler;
};
