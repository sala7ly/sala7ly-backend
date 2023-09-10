/**
 * Database class for managing MongoDB connections using Mongoose.
 *
 * @class Database
 */
class Database {
    /**
     * The single instance of the Database class.
     *
     * @private
     * @type {Database}
     */
    static #instance;

    /**
     * The database URI with the password.
     *
     * @private
     * @type {string}
     */
    #DB;

    /**
     * The Mongoose instance.
     *
     * @private
     * @type {object}
     */
    #mongoose;

    /**
     * Creates an instance of Database.
     *
     * @param {object} mongoose - The Mongoose instance.
     * @param {object} [options] - The database connection options.
     * @param {string} options.databaseURI - The URI for the MongoDB database.
     * @param {string} options.databaseName - The name of the database.
     * @param {string} options.databasePassword - The password for the database, if required.
     * @memberof Database
     */
    constructor(
        mongoose,
        options = {
            databaseURI: String,
            databaseName: String,
            databasePassword: String,
        }
    ) {
        // If no instance exists, create and store it
        if (!this.constructor.#instance) {
            const { databaseURI, databaseName, databasePassword } = options;

            // set password on uri
            const DB = databaseURI
                .replace('<DB>', databaseName)
                .replace('<password>', databasePassword);

            this.#DB = DB;
            this.#mongoose = mongoose;
            this.databaseName = databaseName;
            this.constructor.#instance = this;

            mongoose.set('strictQuery', false);
        }

        // Return the singleton instance
        return this.constructor.#instance;
    }

    /**
     * Connects to the MongoDB database.
     *
     * @returns {Promise} A promise representing the Mongoose connection.
     */
    async connect() {
        // Return a promise for the Mongoose connection
        return this.#mongoose.connect(this.#DB);
    }
}

module.exports = Database;
