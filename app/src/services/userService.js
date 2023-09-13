/**
 * User Service Module
 * @module userService
 * @param {Model} User - The Mongoose User model for database operations.
 * @param {Object} service - The service object containing methods for user-related operations.
 *
 * @typedef {Object} UserService
 * @property {Function} getAll - Retrieves multiple documents from the model based on filter criteria.
 * @property {Function} getOneById - Retrieves a single document by its unique identifier.
 * @property {Function} createOne - Creates a new document with the provided data.
 * @property {Function} updateOneById - Updates an existing document by its unique identifier.
 * @property {Function} deleteOneById - Deletes a document by its unique identifier.
 * @property {Function} count - Counts the number of documents that match the given filter criteria.
 * @property {Function} isExist - Checks if a document with the specified unique identifier exists.
 *
 * @returns {UserService} An object containing user-related service methods.
 * @see {@link module:service} For methods provided by the service object.
 */
module.exports = (User, service) => service(User);
