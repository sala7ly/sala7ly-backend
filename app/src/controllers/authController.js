/**
 * Authentication Controller Module
 * @module authController
 * @param {Object} dependencies - An object containing required dependencies.
 * @param {Object} dependencies.service - The authentication service object for handling authentication-related operations.
 * @param {Object} dependencies.utils - Utility functions and classes.
 *
 * @typedef {Object} AuthController
 * @property {Function} register - A function to register a new user.
 * @property {Function} login - A function to log in a user.
 * @property {Function} forgetPassword - A function to initiate the password reset process.
 * @property {Function} resetPassword - A function to reset the user's password.
 * @property {Function} updatePassword - A function to update the user's password.
 * @property {Function} getMe - A function to retrieve the authenticated user's data.
 * @property {Function} updateMe - A function to update the authenticated user's data.
 * @property {Function} logout - A function to log out the user.
 *
 * @returns {AuthController} An object containing authentication-related controller functions.
 */
module.exports = ({ service, utils }) => {
    const { catchAsync, AppError, StandardJsonResponse } = utils;

    /**
     * Registers a new user with the provided user data.
     *
     * @function register
     * @async
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @param {Function} next - Express next middleware function.
     * @returns {Promise<void>} A promise that resolves once the registration process is complete.
     * @uses {@link AuthService#register} - Uses the authentication service to register the user.
     */
    const register = catchAsync(async (req, res, next) => {
        // Get user data from request body
        const {
            name,
            email,
            password,
            passwordConfirm,
            role = 'client',
            phone,
        } = req.body;

        // Register using service
        const token = await service.register({
            name,
            email,
            password,
            passwordConfirm,
            role,
            phone,
        });

        // JWT Token expires in 90 days
        const expiresIn = new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        );

        // Send response to client
        return new StandardJsonResponse(res, 201)
            .attachTokenCookie(token, expiresIn, {})
            .setMainContent(true, 'User registered successfully')
            .setSuccessPayload({
                token,
            })
            .send();
    });

    /**
     * Logs in a user with the provided email and password.
     *
     * @function login
     * @async
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @param {Function} next - Express next middleware function.
     * @returns {Promise<void>} A promise that resolves once the login process is complete.
     * @uses {@link AuthService#login} - Uses the authentication service to log in the user.
     */
    const login = catchAsync(async (req, res, next) => {
        // Validate that [email, password] have been sent
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError('require email and password', 400));
        }

        // Login using service
        const token = await service.login({ email, password });

        // JWT Token expires in 90 days
        const expiresIn = new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        );

        // Send response to client
        return new StandardJsonResponse(res, 200)
            .attachTokenCookie(token, expiresIn, {})
            .setMainContent(true, 'Logged in successfully')
            .setSuccessPayload({
                token,
            })
            .send();
    });

    /**
     * Initiates the password reset process for a user based on their email.
     *
     * @function forgetPassword
     * @async
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @param {Function} next - Express next middleware function.
     * @returns {Promise<void>} A promise that resolves once the password reset process is initiated.
     * @uses {@link AuthService#forgetPassword} - Uses the authentication service to initiate password reset.
     */
    const forgetPassword = catchAsync(async (req, res, next) => {
        // Check if email already posted
        const { email } = req.body;

        if (!email) {
            return next(new AppError('Please provide an email', 400));
        }

        // Forget password using service
        const resetToken = await service.forgetPassword(email);

        // Send Email to user with reset token
        try {
            // TODO: call sendEmail function
            console.log(resetToken);

            // WARN: Remove resetToken from payload in production
            const payload =
                process.env.NODE_ENV === 'development' ? { resetToken } : null;
            // Send response to client
            return new StandardJsonResponse(res, 200)
                .setMainContent(true, 'Reset token sent to email')
                .setSuccessPayload(payload)
                .send();
        } catch (err) {
            // Rollback password reset using service
            service.rollbackPasswordReset(email);

            // throw error
            return next(
                new AppError(
                    'There was an error Sending the email. Try again later!',
                    500
                )
            );
        }
    });

    /**
     * Resets a user's password using a reset token and updates it with a new password.
     *
     * @function resetPassword
     * @async
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @param {Function} next - Express next middleware function.
     * @returns {Promise<void>} A promise that resolves once the password is successfully reset.
     * @uses {@link AuthService#resetPassword} - Uses the authentication service to reset the user's password.
     */
    const resetPassword = catchAsync(async (req, res, next) => {
        // Get reset token from params
        const { resetToken } = req.params;
        const { password, passwordConfirm } = req.body;

        if (!password || !passwordConfirm) {
            return next(
                new AppError(
                    'Please provide a password and passwordConfirm',
                    400
                )
            );
        }

        // Reset Password using service
        const token = await service.resetPassword(
            resetToken,
            password,
            passwordConfirm
        );

        // JWT Token expires in 90 days
        const expiresIn = new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        );

        // Send response to client
        return new StandardJsonResponse(res, 200)
            .attachTokenCookie(token, expiresIn, {})
            .setMainContent(true, 'Password reset successfully')
            .setSuccessPayload({
                token,
            })
            .send();
    });

    /**
     * Updates the authenticated user's password with a new one.
     *
     * @function updatePassword
     * @async
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @param {Function} next - Express next middleware function.
     * @returns {Promise<void>} A promise that resolves once the password is successfully updated.
     * @uses {@link AuthService#updatePassword} - Uses the authentication service to update the user's password.
     */
    const updatePassword = catchAsync(async (req, res, next) => {
        const { password, passwordConfirm } = req.body;

        if (!password || !passwordConfirm) {
            return next(
                new AppError(
                    'Please provide a password and passwordConfirm',
                    400
                )
            );
        }

        // JWT Token expires in 90 days
        const expiresIn = new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        );

        // Update Password using service
        const token = await service.updatePassword(
            req.user.id,
            password,
            passwordConfirm
        );

        // Send response to client
        return new StandardJsonResponse(res, 200)
            .attachTokenCookie(token, expiresIn, {})
            .setMainContent(true, 'Password updated successfully')
            .setSuccessPayload({
                token,
            })
            .send();
    });

    /**
     * Retrieves the data of the authenticated user.
     *
     * @function getMe
     * @async
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @param {Function} next - Express next middleware function.
     * @returns {Promise<void>} A promise that resolves with the authenticated user's data.
     * @uses {@link AuthService#getMe} - Uses the authentication service to retrieve the authenticated user's data.
     */
    const getMe = catchAsync(async (req, res, next) => {
        const user = await service.getMe(req.user.id);

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        return new StandardJsonResponse(res, 200)
            .setMainContent(true, 'User retrieved successfully')
            .setSuccessPayload({
                data: user,
            })
            .send();
    });

    /**
     * Updates the data of the authenticated user.
     *
     * @function updateMe
     * @async
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @param {Function} next - Express next middleware function.
     * @returns {Promise<void>} A promise that resolves with the updated user data.
     * @uses {@link AuthService#updateMe} - Uses the authentication service to update the authenticated user's data.
     */
    const updateMe = catchAsync(async (req, res, next) => {
        // Get user data from request body
        const { name, email, phone } = req.body;

        // Update user using service
        const user = await service.updateMe(req.user.id, {
            name,
            email,
            phone,
        });

        // Send response to client
        return new StandardJsonResponse(res, 200)
            .setMainContent(true, 'User updated successfully')
            .setSuccessPayload({
                user,
            })
            .send();
    });

    /**
     * Logs out the authenticated user.
     *
     * @function logout
     * @async
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @param {Function} next - Express next middleware function.
     * @returns {Promise<void>} A promise that resolves once the user is logged out.
     * @uses {@link AuthService#logout} - Uses the authentication service to log out the user.
     */
    const logout = catchAsync(async (req, res, next) => {
        const token = await service.logout();

        const expiresIn = new Date(Date.now() + 0);
        // Send response to client
        return new StandardJsonResponse(res, 200)
            .attachTokenCookie(token, expiresIn, {})
            .setMainContent(true, 'Logged out successfully')
            .setSuccessPayload({
                token,
            })
            .send();
    });

    return {
        register,
        login,
        forgetPassword,
        resetPassword,
        updatePassword,
        getMe,
        updateMe,
        logout,
    };
};
