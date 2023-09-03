/**
 * User Schema Module
 * @module UserSchema
 * @param {object} mongoose - The Mongoose instance.
 * @param {object} validator - The validator library for data validation.
 * @returns {Model} - The Mongoose model for the User schema.
 */

/**
 * Mongoose User Schema
 * @typedef {object} UserSchema
 * @property {string} name - The user's name.
 * @property {string} email - The user's email address (must be unique and in valid email format).
 * @property {string} photo - The user's profile photo filename (default: 'default.jpg').
 * @property {string} phone - The user's phone number (must be in valid mobile phone format).
 * @property {string} role - The user's role (enum: 'client', 'craftsman', 'admin', default: 'client').
 * @property {string} password - The user's password (min length: 6 characters, not selected by default).
 * @property {string} passwordConfirm - The user's password confirmation (must match the password).
 * @property {Date} passwordChangedAt - The date when the user's password was last changed (not selected by default).
 * @property {string} passwordResetToken - The token used for password reset.
 * @property {Date} passwordResetExpires - The expiration date for the password reset token.
 * @property {Date} createdAt - The date when the user's account was created (default: current date, not selected by default).
 */

/**
 * Mongoose User Model
 * @typedef {Model<UserSchema>} User
 */

// Export the User model
module.exports = (mongoose, validator) => {
    const userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: [true, 'Please provide name'],
        },
        email: {
            type: String,
            validate: [validator.isEmail, 'Please provide a valid email'],
            lowercase: true,
            unique: true,
        },
        photo: {
            type: String,
            default: 'default.jpg',
        },
        phone: {
            type: String,
            validate: [
                validator.isMobilePhone,
                'Please provide a valid phone number',
            ],
        },
        role: {
            type: String,
            enum: ['client', 'craftsman', 'admin'],
            default: 'client',
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minLength: [6, 'Password should be 6 character or more'],
            select: false,
        },
        passwordConfirm: {
            type: String,
            required: [true, 'please confirm your password'],
            minLength: [6, 'Password should be 6 character or more'],
            validate: {
                // this only works on CREATE or SAVE
                validator: function (val) {
                    return this.password === val;
                },
                message: 'passwords are not the same',
            },
            select: false,
        },
        passwordChangedAt: {
            type: Date,
            select: false,
        },
        passwordResetToken: String,
        passwordResetExpires: Date,
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false,
        },
    });

    const User = mongoose.model('User', userSchema);

    return User;
};
