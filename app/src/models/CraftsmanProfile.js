/**
 * Craftsman Profile Schema Module
 * @module CraftsmanProfileSchema
 * @param {object} mongoose - The Mongoose instance.
 * @returns {Model} - The Mongoose model for the Craftsman Profile schema.
 */

/**
 * Mongoose Craftsman Profile Schema
 * @typedef {object} CraftsmanProfileSchema
 * @property {string} userId - The user ID associated with the craftsman profile.
 * @property {string} nationalId - The craftsman's national ID filename (default: 'default.jpg').
 * @property {string} governrate - The governrate in which the craftsman operates.
 * @property {object} location - The geographic location of the craftsman using GeoJSON format.
 * @property {string} location.type - The type of GeoJSON location (default: 'Point').
 * @property {number[]} location.coordinates - The coordinates [longitude, latitude] of the craftsman's location.
 * @property {boolean} verified - Indicates if the craftsman profile is verified.
 * @property {string} about - A brief description about the craftsman.
 * @property {ObjectId[]} reviews - An array of review IDs associated with the craftsman.
 * @property {number} ratingsAverage - The average rating for the craftsman (min: 0.0, max: 5.0).
 * @property {number} ratingsQuantity - The number of ratings received by the craftsman.
 */

/**
 * Mongoose Craftsman Profile Model
 * @typedef {Model<CraftsmanProfileSchema>} CraftsmanProfile
 */
module.exports = (mongoose) => {
    const craftsmanProfileSchema = mongoose.Schema({
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },
        nationalId: {
            type: String,
            default: 'default.jpg',
        },
        governrate: String,
        location: {
            // GeoJson
            type: {
                type: String,
                default: 'Point',
                enum: ['Point'],
            },
            coordinates: [Number],
        },
        verified: Boolean,
        about: String,
        reviews: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'Review',
            },
        ],
        ratingsAverage: {
            type: Number,
            default: 0,
            min: [0, 'Rating must be above 0.0'],
            max: [5, 'Rating must be above 5.0'],
            set: (val) => Math.round(val * 10) / 10,
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
    });

    const CraftsmanProfile = mongoose.model(
        'CraftsmanProfile',
        craftsmanProfileSchema
    );

    return CraftsmanProfile;
};
