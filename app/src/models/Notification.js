/**
 * Notification Schema Module
 * @module NotificationSchema
 * @param {object} mongoose - The Mongoose instance.
 * @returns {Model} - The Mongoose model for the Notification schema.
 */

/**
 * Mongoose Notification Schema
 * @typedef {object} NotificationSchema
 * @property {string} userId - The ID of the user associated with this notification (references User).
 * @property {string} contentType - The type of content for this notification (enum: 'message', 'booking', required).
 * @property {string} content - The content of the notification (required).
 * @property {boolean} readStatus - Indicates if the notification has been read (default: false).
 * @property {Date} createdAt - The date when the notification was created (default: current date).
 */

/**
 * Mongoose Notification Model
 * @typedef {Model<NotificationSchema>} Notification
 */
module.exports = (mongoose) => {
    const notificationSchema = mongoose.Schema({
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },
        contentType: {
            type: String,
            enum: ['message', 'booking'],
            required: [true, 'please provide notification contentType'],
        },
        content: {
            type: String,
            required: [true, 'please provide notification content'],
        },
        readStatus: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
    });

    const Notification = mongoose.model('Notification', notificationSchema);
    return Notification;
};
