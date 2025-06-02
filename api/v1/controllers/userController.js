const UserModel = require('../../../models/userModel');

// Chuẩn hóa response
const sendResponse = (res, status, data, message) => {
    res.status(status).json({
        success: status < 400,
        message,
        data
    });
};

exports.getProfile = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);
        if (!user) return sendResponse(res, 404, null, 'User not found');
        sendResponse(res, 200, { user }, 'Get profile success');
    } catch (error) {
        sendResponse(res, 500, null, 'Server error');
    }
};

exports.updateProfile = async (req, res) => {
    // Tùy vào logic update, bạn có thể bổ sung hàm updateProfile trong model
    sendResponse(res, 501, null, 'Not implemented');
};

exports.getUserById = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) return sendResponse(res, 404, null, 'User not found');
        sendResponse(res, 200, { user }, 'Get user by id success');
    } catch (error) {
        sendResponse(res, 500, null, 'Server error');
    }
};

exports.changePassword = async (req, res) => {
    sendResponse(res, 501, null, 'Not implemented');
};

exports.changeEmail = async (req, res) => {
    sendResponse(res, 501, null, 'Not implemented');
};

exports.updateUserRole = async (req, res) => {
    sendResponse(res, 501, null, 'Not implemented');
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.getAllUsers();
        sendResponse(res, 200, { users }, 'Get all users success');
    } catch (error) {
        sendResponse(res, 500, null, 'Server error');
    }
}; 