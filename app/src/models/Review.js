/**
 * Review Schema Module
 * @module ReviewSchema
 * @param {object} mongoose - The Mongoose instance.
 * @returns {Model} - The Mongoose model for the Review schema.
 */

/**
 * Mongoose Review Schema
 * @typedef {object} ReviewSchema
 * @property {string} review - The review text (required).
 * @property {number} rating - The rating for the review (required, must be between 0.0 and 5.0).
 * @property {Date} createdAt - The date when the review was created (default: current date).
 * @property {string} clientId - The ID of the client who wrote the review (must be provided and reference a User).
 * @property {string} craftsmanId - The ID of the craftsman who the review is assigned to (must be provided and reference a User).
 * @property {string} projectId - The ID of the project related to the review (must be provided and reference a Project).
 */

/**
 * Mongoose Review Model
 * @typedef {Model<ReviewSchema>} Review
 */
module.exports = (mongoose) => {
    const reviewSchema = mongoose.Schema({
        review: {
            type: String,
            required: [true, 'please provide your review'],
        },
        rating: {
            type: Number,
            required: [true, 'review must have a rating.'],
            min: [0, 'Rating must be above 0.0'],
            max: [5, 'Rating must be blew 5.0'],
            set: (val) => Math.round(val * 10) / 10,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        clientId: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to client'],
        },
        craftsmanId: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review must to be assigned to craftsman'],
        },
        projectId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Project',
            required: [true, 'Review must be related to project'],
        },
    });

    const Review = mongoose.model('Review', reviewSchema);
    return Review;
};
