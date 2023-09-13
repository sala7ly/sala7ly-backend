/**
 * Booking Schema Module
 * @module BookingSchema
 * @param {object} mongoose - The Mongoose instance.
 * @param {object} validator - The validator library for data validation.
 * @returns {Model} - The Mongoose model for the Booking schema.
 */

/**
 * Mongoose Booking Schema
 * @typedef {object} BookingSchema
 * @property {string} craftsmanId - The craftsman's user ID associated with the booking.
 * @property {Date} createAt - The date and time when the booking was created (default: current date and time).
 * @property {Date} completionAt - The date and time when the booking was completed.
 * @property {string} projectId - The project's ID associated with the booking.
 * @property {string} clientPhone - The client's phone number (must be in valid mobile phone format).
 * @property {number} fees - The fees associated with the booking (default: 0).
 * @property {object} clientLocation - The client's location in GeoJSON format.
 * @property {string} timeSlotId - The ID of the availability time slot associated with the booking.
 * @property {string} status - The status of the booking (enum: 'Pending', 'Confirmed', 'In progress', 'Completed', 'Cancelled').
 */

/**
 * Mongoose Booking Model
 * @typedef {Model<BookingSchema>} Booking
 */
module.exports = (mongoose, validator) => {
    const bookingSchema = mongoose.Schema({
        craftsmanId: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },
        createAt: {
            type: Date,
            default: Date.now(),
        },
        completionAt: Date,
        projectId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Project',
        },
        clientPhone: {
            type: String,
            validate: [
                validator.isMobilePhone,
                'Please provide a valid phone number',
            ],
        },
        fees: {
            type: Number,
            default: 0,
        },
        clientLocation: {
            // GeoJson
            type: {
                type: String,
                default: 'Point',
                enum: ['Point'],
            },
            coordinates: [Number],
        },
        timeSlotId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Availability',
        },
        status: {
            type: String,
            enum: [
                'Pending',
                'Confirmed',
                'In progress',
                'Completed',
                'Cancelled',
            ],
        },
        paymentMethod: {
            type: String,
            enum: ['Cash', 'Card'],
        },
    });

    const Booking = mongoose.model('Booking', bookingSchema);

    return Booking;
};
