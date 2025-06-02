const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
        const { username, password, email } = req.body;

        // Validate input
        if (!username || !password || !email) {
            return sendResponse(res, 400, null, 'Missing required fields');
        }

        // Check if user exists
        const existingUser = await UserModel.findByUsername(username);
        if (existingUser) {
            return sendResponse(res, 400, null, 'Username already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await UserModel.create(username, hashedPassword, email);

        // Generate token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        sendResponse(res, 201, { token, user: { id: user.id, username, email, role: user.role } }, 'User registered successfully');
    } catch (error) {
        console.error('Registration error:', error);
        sendResponse(res, 500, null, 'Registration failed');
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

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

        // Generate token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Generate refresh token
        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        sendResponse(res, 200, {
            token,
            refreshToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        }, 'Login successful');
    } catch (error) {
        console.error('Login error:', error);
        sendResponse(res, 500, null, 'Login failed');
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