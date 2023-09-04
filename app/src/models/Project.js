/**
 * Project Schema Module
 * @module ProjectSchema
 * @param {object} mongoose - The Mongoose instance.
 * @returns {Model} - The Mongoose model for the Project schema.
 */

/**
 * Mongoose Project Schema
 * @typedef {object} ProjectSchema
 * @property {string} clientId - The client's user ID associated with the project.
 * @property {string} title - The title of the project (required).
 * @property {string} description - The description of the project (required).
 * @property {string[]} photos - An array of photo filenames associated with the project.
 */

/**
 * Mongoose Project Model
 * @typedef {Model<ProjectSchema>} Project
 */
module.exports = (mongoose) => {
    const projectSchema = mongoose.Schema({
        clientId: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },
        title: {
            type: String,
            require: [true, 'please provide title for project'],
        },
        description: {
            type: String,
            require: [true, 'please provide description for project'],
        },
        photos: [String],
    });

    const Project = mongoose.model('Project', projectSchema);

    return Project;
};
