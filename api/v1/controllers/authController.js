const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const UserModel = require('../../../models/userModel');

// Response helper
const sendResponse = (res, status, data, message) => {
    res.status(status).json({
        success: status < 400,
        message,
        data
    });
};

exports.register = async (req, res) => {
    try {
        console.log('Register body:', req.body);
        const { username, password, email, fullName, phone } = req.body;

        // Validate input
        if (!username || !password || !email || !fullName || !phone) {
            return sendResponse(res, 400, null, 'Missing required fields');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return sendResponse(res, 400, null, 'Invalid email format');
        }

        // Validate phone format
        const phoneRegex = /^[0-9]{9,12}$/;
        if (!phoneRegex.test(phone)) {
            return sendResponse(res, 400, null, 'Invalid phone number');
        }

        // Validate password strength
        if (password.length < 6) {
            return sendResponse(res, 400, null, 'Password must be at least 6 characters');
        }

        // Check if username exists
        const existingUsername = await UserModel.findByUsername(username);
        if (existingUsername) {
            return sendResponse(res, 400, null, 'Username already exists');
        }

        // Check if email exists
        const existingEmail = await UserModel.findByEmail(email);
        if (existingEmail) {
            return sendResponse(res, 400, null, 'Email already registered');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await UserModel.create(username, hashedPassword, email, fullName, phone);

        // Generate token
        const token = jwt.sign(
            { id: user.id, username: username, role: 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        sendResponse(res, 201, {
            token,
            user: {
                id: user.id,
                username,
                email,
                fullName,
                phone,
                role: 'user'
            }
        }, 'User registered successfully.');
    } catch (error) {
        console.error('Registration error:', error);
        sendResponse(res, 500, null, 'Registration failed');
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password, rememberMe } = req.body;

        // Validate input
        if (!username || !password) {
            return sendResponse(res, 400, null, 'Missing username or password');
        }

        // Find user
        const user = await UserModel.findByUsername(username);
        if (!user) {
            return sendResponse(res, 401, null, 'Invalid credentials');
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return sendResponse(res, 401, null, 'Invalid credentials');
        }

        // Generate token with appropriate expiration
        const tokenExpiration = rememberMe ? '7d' : '24h';
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: tokenExpiration }
        );

        // Generate refresh token
        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '30d' }
        );

        sendResponse(res, 200, {
            token,
            refreshToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.full_name,
                role: user.role
            }
        }, 'Login successful');
    } catch (error) {
        console.error('Login error:', error);
        sendResponse(res, 500, null, 'Login failed');
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return sendResponse(res, 400, null, 'Email is required');
        }

        const user = await UserModel.findByEmail(email);
        if (!user) {
            // Don't reveal that the email doesn't exist
            return sendResponse(res, 200, null, 'If your email is registered, you will receive a password reset link');
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

        // Save reset token
        await UserModel.updateResetToken(user.id, resetToken, resetExpires);

        // Send reset email
        const resetUrl = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;
        await sendEmail({
            to: email,
            subject: 'Reset your password',
            html: `
                <h1>Password Reset Request</h1>
                <p>Click the link below to reset your password:</p>
                <a href="${resetUrl}">${resetUrl}</a>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
            `
        });

        sendResponse(res, 200, null, 'If your email is registered, you will receive a password reset link');
    } catch (error) {
        console.error('Forgot password error:', error);
        sendResponse(res, 500, null, 'Failed to process password reset request');
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return sendResponse(res, 400, null, 'Token and new password are required');
        }

        // Validate password strength
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return sendResponse(res, 400, null, 'Password must be at least 8 characters long and contain uppercase, lowercase and numbers');
        }

        // Find user by reset token
        const user = await UserModel.findByResetToken(token);
        if (!user) {
            return sendResponse(res, 400, null, 'Invalid or expired reset token');
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear reset token
        await UserModel.updatePassword(user.id, hashedPassword);
        await UserModel.clearResetToken(user.id);

        sendResponse(res, 200, null, 'Password has been reset successfully');
    } catch (error) {
        console.error('Reset password error:', error);
        sendResponse(res, 500, null, 'Failed to reset password');
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return sendResponse(res, 400, null, 'Verification token is required');
        }

        // Find user by verification token
        const user = await UserModel.findByVerificationToken(token);
        if (!user) {
            return sendResponse(res, 400, null, 'Invalid or expired verification token');
        }

        // Update email verification status
        await UserModel.updateEmailVerification(user.id, true);

        sendResponse(res, 200, null, 'Email verified successfully');
    } catch (error) {
        console.error('Email verification error:', error);
        sendResponse(res, 500, null, 'Failed to verify email');
    }
};

exports.logout = async (req, res) => {
    try {
        // In a real application, you might want to blacklist the token
        sendResponse(res, 200, null, 'Logged out successfully');
    } catch (error) {
        console.error('Logout error:', error);
        sendResponse(res, 500, null, 'Logout failed');
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return sendResponse(res, 400, null, 'Refresh token is required');
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        
        // Get user
        const user = await UserModel.findById(decoded.id);
        if (!user) {
            return sendResponse(res, 401, null, 'Invalid refresh token');
        }

        // Generate new access token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        sendResponse(res, 200, { token }, 'Token refreshed successfully');
    } catch (error) {
        console.error('Token refresh error:', error);
        sendResponse(res, 401, null, 'Invalid refresh token');
    }
}; 