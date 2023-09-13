/**
 * Authentication Service Module
 * @module authService
 * @param {Object} dependencies - An object containing required dependencies.
 * @param {Object} dependencies.model - The user model for database operations.
 * @param {Object} dependencies.utils - Utility functions and classes for handling errors and asynchronous operations.
 * @param {Object} dependencies.libraries - External libraries like JWT, bcrypt, and crypto.
 *
 * @typedef {Object} AuthService
 * @property {Function} register - Registers a new user and generates a signed JWT token.
 * @property {Function} login - Authenticates a user and generates a signed JWT token upon successful login.
 * @property {Function} forgetPassword - Initiates the password reset process and returns a reset token.
 * @property {Function} rollbackPasswordReset - Rolls back the password reset process by clearing reset token and expiration.
 * @property {Function} updatePassword - Updates a user's password and returns a new JWT token.
 * @property {Function} resetPassword - Resets a user's password using a valid reset token and returns a new JWT token.
 * @property {Function} getMe - Retrieves user information by user ID.
 * @property {Function} updateMe - Updates user information by user ID.
 * @property {Function} logout - Logs out a user and returns a 'none' token.
 *
 * @returns {AuthService} An object containing authentication-related service methods.
 * @see {@link module:utils} For methods provided by the utils object.
 * @see {@link module:libraries} For external library dependencies.
 */
module.exports = ({ model, utils, libraries }) => {
    const { AppError } = utils;
    const { jwt, bcrypt, crypto } = libraries;

    // Helpers functions
    /**
     * Generates a signed JWT token for a user with the given user ID.
     *
     * @function genSignedJwtToken
     * @param {string} userId - The unique identifier of the user.
     * @returns {string} A signed JWT token.
     * @throws {Error} If JWT token generation fails.
     * @example
     * const userId = 'user123';
     * const token = genSignedJwtToken(userId);
     */
    const genSignedJwtToken = (userId) => {
        const { JWT_SECRET: secret, JWT_EXPIRES_IN: expiresIn } = process.env;

        return jwt.sign({ id: userId }, secret, { expiresIn });
    };

    /**
     * Compares a candidate password with a user's stored password for authentication.
     *
     * @function matchPassword
     * @async
     * @param {string} candidatePassword - The candidate password to compare.
     * @param {string} userPassword - The user's stored password.
     * @returns {Promise<boolean>} A promise that resolves to `true` if the passwords match, `false` otherwise.
     * @throws {Error} If password comparison fails.
     * @example
     * const candidatePassword = 'password123';
     * const userPassword = 'hashedPassword123';
     * const isMatch = await matchPassword(candidatePassword, userPassword);
     */
    const matchPassword = async (candidatePassword, userPassword) =>
        await bcrypt.compare(candidatePassword, userPassword);

    /**
     * Generates a random password reset token.
     *
     * @function genPasswordResetToken
     * @returns {string} A random password reset token.
     * @throws {Error} If token generation fails.
     * @example
     * const resetToken = genPasswordResetToken();
     */
    const genPasswordResetToken = () => crypto.randomBytes(32).toString('hex');

    // Service functions
    /**
     * Registers a new user and generates a signed JWT token.
     *
     * @function register
     * @async
     * @param {Object} userData - The user data to register.
     * @returns {Promise<string>} A promise that resolves to a signed JWT token for the registered user.
     * @throws {AppError} If an error occurs during user registration or JWT token generation.
     * @example
     * const userData = {
     *   username: 'newuser',
     *   email: 'newuser@example.com',
     *   password: 'password123',
     * };
     * const token = await authService.register(userData);
     */
    const register = async (userData) => {
        const user = await model.create(userData);

        const token = genSignedJwtToken(user._id);

        return token;
    };

    /**
     * Authenticates a user and generates a signed JWT token upon successful login.
     *
     * @function login
     * @async
     * @param {Object} credentials - The user's login credentials.
     * @param {string} credentials.email - The user's email.
     * @param {string} credentials.password - The user's password.
     * @returns {Promise<string>} A promise that resolves to a signed JWT token upon successful login.
     * @throws {AppError} If the email or password is incorrect, or an error occurs during authentication or JWT token generation.
     * @example
     * const credentials = {
     *   email: 'user@example.com',
     *   password: 'password123',
     * };
     * const token = await authService.login(credentials);
     */
    const login = async ({ email, password }) => {
        // Validate there is an user with the given email
        const user = await model.findOne({ email }).select('+password');

        let correct = null;

        // Validate the password is correct
        if (user) {
            correct = await matchPassword(password, user.password);
        }

        // If email or password is incorrect, throw an error
        if (!user || !correct) {
            throw new AppError('Incorrect email or password', 401);
        }

        // If everything is correct, generate a signed JWT token
        const token = genSignedJwtToken(user._id);

        return token;
    };

    /**
     * Initiates the password reset process and returns a reset token.
     *
     * @function forgetPassword
     * @async
     * @param {string} email - The email of the user requesting a password reset.
     * @returns {Promise<string>} A promise that resolves to a password reset token.
     * @throws {AppError} If there is no user with the provided email or an error occurs during token generation or email sending.
     * @example
     * const email = 'user@example.com';
     * const resetToken = await authService.forgetPassword(email);
     */
    const forgetPassword = async (email) => {
        // Get user based on passed email
        const user = await model.findOne({ email });

        // If there is no user with the given email, throw an error
        if (!user) {
            throw new AppError('There is no user with this email', 404);
        }

        // Generate a random reset token
        const resetToken = genPasswordResetToken();

        user.passwordResetToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

        await user.save({ validateBeforeSave: false });

        return resetToken;
    };

    /**
     * Rolls back the password reset process by clearing reset token and expiration.
     *
     * @function rollbackPasswordReset
     * @async
     * @param {string} email - The email of the user requesting to roll back the password reset.
     * @returns {Promise<boolean>} A promise that resolves to `true` upon successful rollback.
     * @throws {AppError} If there is no user with the provided email or an error occurs during rollback.
     * @example
     * const email = 'user@example.com';
     * const result = await authService.rollbackPasswordReset(email);
     */
    const rollbackPasswordReset = async (email) => {
        // Get user based on passed email
        const user = await model.findOne({ email });

        // Remove the password reset token and expiration date
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        // Save the user
        await user.save({ validateBeforeSave: false });

        return true;
    };

    /**
     * Updates a user's password and returns a new JWT token.
     *
     * @function updatePassword
     * @async
     * @param {string} userId - The unique identifier of the user whose password is being updated.
     * @param {string} password - The new password.
     * @param {string} passwordConfirm - The confirmation of the new password.
     * @returns {Promise<string>} A promise that resolves to a signed JWT token with the updated password.
     * @throws {AppError} If an error occurs during password update or JWT token generation.
     * @example
     * const userId = 'user123';
     * const newPassword = 'newPassword123';
     * const token = await authService.updatePassword(userId, newPassword, newPassword);
     */
    const updatePassword = async (userId, password, passwordConfirm) => {
        // Get user from datbase and select the password field
        const user = await model.findById(userId).select('+password');

        // Update Password
        user.password = password;
        user.passwordConfirm = passwordConfirm;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        // Log the user in, send JWT token
        const token = genSignedJwtToken(user._id);

        return token;
    };

    /**
     * Resets a user's password using a valid reset token and returns a new JWT token.
     *
     * @function resetPassword
     * @async
     * @param {string} resetToken - The valid password reset token.
     * @param {string} password - The new password.
     * @param {string} passwordConfirm - The confirmation of the new password.
     * @returns {Promise<string>} A promise that resolves to a signed JWT token with the reset password.
     * @throws {AppError} If the reset token is invalid or has expired, or an error occurs during password reset or JWT token generation.
     * @example
     * const resetToken = 'resetToken123';
     * const newPassword = 'newPassword123';
     * const token = await authService.resetPassword(resetToken, newPassword, newPassword);
     */
    const resetPassword = async (resetToken, password, passwordConfirm) => {
        // Hash the reset token
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Get user based on hashed token and check if token has not expired
        const user = await model.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });

        // If no user, throw an error
        if (!user) {
            throw new AppError('Token is invalid or has expired', 400);
        }

        // Update password and generate a new JWT token
        const token = await updatePassword(user._id, password, passwordConfirm);

        return token;
    };

    /**
     * Retrieves user information by user ID.
     *
     * @function getMe
     * @async
     * @param {string} id - The unique identifier of the user to retrieve.
     * @returns {Promise<Object>} A promise that resolves to the user object with sensitive information removed.
     * @throws {AppError} If an error occurs during user retrieval.
     * @example
     * const userId = 'user123';
     * const user = await authService.getMe(userId);
     */
    const getMe = async (id) => {
        const user = await model.findById(id);
        user.__v = undefined;
        return user;
    };

    /**
     * Updates user information by user ID.
     *
     * @function updateMe
     * @async
     * @param {string} id - The unique identifier of the user to update.
     * @param {Object} userData - The updated user data.
     * @returns {Promise<Object>} A promise that resolves to the updated user object with sensitive information removed.
     * @throws {AppError} If an error occurs during user update or validation.
     * @example
     * const userId = 'user123';
     * const updatedUserData = {
     *   username: 'newusername',
     *   email: 'newemail@example.com',
     * };
     * const updatedUser = await authService.updateMe(userId, updatedUserData);
     */
    const updateMe = async (id, userData) => {
        const updatedDoc = await model.findOneAndUpdate({ _id: id }, userData, {
            new: true,
            runValidators: true,
        });

        if (updatedDoc) updatedDoc.__v = undefined;

        return updatedDoc;
    };

    /**
     * Logs out a user and returns a 'none' token.
     *
     * @function logout
     * @async
     * @returns {Promise<string>} A promise that resolves to the 'none' token.
     * @throws {AppError} If an error occurs during logout.
     * @example
     * const token = await authService.logout();
     */
    const logout = async () => {
        const token = 'none';

        return token;
    };

    return {
        register,
        login,
        forgetPassword,
        rollbackPasswordReset,
        resetPassword,
        updatePassword,
        getMe,
        updateMe,
        logout,
    };
};
