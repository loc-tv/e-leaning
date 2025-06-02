// Chuẩn hóa response
const sendResponse = (res, status, data, message) => {
    res.status(status).json({
        success: status < 400,
        message,
        data
    });
};

exports.getTheories = (req, res) => sendResponse(res, 501, null, 'Not implemented');
exports.getTheoryById = (req, res) => sendResponse(res, 501, null, 'Not implemented');
exports.getAllTheories = (req, res) => sendResponse(res, 501, null, 'Not implemented');
exports.createTheory = (req, res) => sendResponse(res, 501, null, 'Not implemented');
exports.updateTheory = (req, res) => sendResponse(res, 501, null, 'Not implemented');
exports.deleteTheory = (req, res) => sendResponse(res, 501, null, 'Not implemented'); 