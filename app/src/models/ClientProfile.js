/**
 * Client Profile Schema Module
 * @module ClientProfileSchema
 * @param {object} mongoose - The Mongoose instance.
 * @returns {Model} - The Mongoose model for the Client Profile schema.
 */

/**
 * Mongoose Client Profile Schema
 * @typedef {object} ClientProfileSchema
 * @property {mongoose.Schema.ObjectId} userid - The user ID associated with the client profile.
 * @property {mongoose.Schema.ObjectId[]} favoriteCraftsmen - An array of user IDs for favorite craftsmen.
 */

/**
 * Mongoose Client Profile Model
 * @typedef {Model<ClientProfileSchema>} ClientProfile
 */

/**
 * Exports the Mongoose Client Profile model.
 *
 * @type {ClientProfile}
 */
module.exports = (mongoose) => {
    const clientProfileSchema = mongoose.Schema({
        userid: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },
        favoriteCraftsmen: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
            },
        ],
    });

    const ClientProfile = mongoose.model('Client', clientProfileSchema);

    return ClientProfile;
};
