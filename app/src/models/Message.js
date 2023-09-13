/**
 * Availability Schema Module
 * @module AvailabilitySchema
 * @param {object} mongoose - The Mongoose instance.
 * @param {object} validator - The validator library for data validation.
 * @returns {Model} - The Mongoose model for the Availability schema.
 */

/**
 * Mongoose Availability Schema
 * @typedef {object} AvailabilitySchema
 * @property {string} craftsmanId - The ID of the craftsman associated with this availability (references User).
 * @property {Date} date - The date for this availability (required).
 * @property {boolean} isBooked - Indicates if this availability slot is booked (default: false).
 * @property {Date[]} timeSlots - An array of time slots for this availability.
 */

/**
 * Mongoose Availability Model
 * @typedef {Model<AvailabilitySchema>} Availability
 */
module.exports = (mongoose) => {
    const messageSchema = mongoose.Schema({
        chatId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Chat',
        },
        senderId: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },
        message: String,
        sendAt: {
            type: Date,
            default: Date.now(),
        },
    });

    const Message = mongoose.model('Message', messageSchema);
    return Message;
};
