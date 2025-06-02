const jwt = require('jsonwebtoken');
const UserModel = require('../../../models/userModel');

// Response helper
const sendError = (res, status, message) => {
    res.status(status).json({
        success: false,
        message
    });
};

exports.isAuthenticated = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return sendError(res, 401, 'No token provided');
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user
        const user = await UserModel.findById(decoded.id);
        if (!user) {
            return sendError(res, 401, 'User not found');
        }

        // Add user to request
        req.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return sendError(res, 401, 'Invalid token');
        }
        if (error.name === 'TokenExpiredError') {
            return sendError(res, 401, 'Token expired');
        }
        console.error('Auth middleware error:', error);
        sendError(res, 500, 'Authentication failed');
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return sendError(res, 403, 'Access denied. Admin only.');
    }
    next();
}; 