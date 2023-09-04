/**
 * Availability Schema Module
 * @module AvailabilitySchema
 * @param {object} mongoose - The Mongoose instance.
 * @returns {Model} - The Mongoose model for the Availability schema.
 */

/**
 * Mongoose Availability Schema
 * @typedef {object} AvailabilitySchema
 * @property {string} craftsmanid - The craftsman's user ID associated with the availability.
 * @property {Date} date - The date for the availability (required).
 * @property {boolean} isBooked - Indicates if the availability slot is booked (default: false).
 * @property {Date[]} timeSlots - An array of time slot ranges available on the specified date.
 */

/**
 * Mongoose Availability Model
 * @typedef {Model<AvailabilitySchema>} Availability
 */
module.exports = (mongoose) => {
    const availabilitySchema = mongoose.Schema({
        craftsmanid: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },
        date: {
            type: Date,
            required: [true, 'please provide date for Availability'],
        },
        isBooked: {
            type: Boolean,
            default: false,
        },
        timeSlots: [Date, Date],
    });

    const Availability = mongoose.model('Availability', availabilitySchema);

    return Availability;
};
