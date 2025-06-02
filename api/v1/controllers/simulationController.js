// Chuẩn hóa response
const sendResponse = (res, status, data, message) => {
    res.status(status).json({
        success: status < 400,
        message,
        data
    });
};

exports.getSimulations = (req, res) => sendResponse(res, 501, null, 'Not implemented');
exports.calculateModulation = (req, res) => sendResponse(res, 501, null, 'Not implemented'); 