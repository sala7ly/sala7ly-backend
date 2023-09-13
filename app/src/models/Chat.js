/**
 * Chat Schema Module
 * @module ChatSchema
 * @param {object} mongoose - The Mongoose instance.
 * @returns {Model} - The Mongoose model for the Chat schema.
 */

/**
 * Mongoose Chat Schema
 * @typedef {object} ChatSchema
 * @property {string[]} participants - An array of user IDs participating in the chat (references User).
 * @property {Date} createdAt - The date when the chat was created (default: current date).
 */

/**
 * Mongoose Chat Model
 * @typedef {Model<ChatSchema>} Chat
 */
module.exports = (mongoose) => {
    const chatSchema = mongoose.Schema({
        participants: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
            },
        ],
        createdAt: {
            type: Date,
            default: Date.now(),
        },
    });

    const Chat = mongoose.model('Chat', chatSchema);
    return Chat;
};
