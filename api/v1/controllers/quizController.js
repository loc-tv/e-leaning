// Chuẩn hóa response
const sendResponse = (res, status, data, message) => {
    res.status(status).json({
        success: status < 400,
        message,
        data
    });
};

exports.getQuizzes = (req, res) => sendResponse(res, 501, null, 'Not implemented');
exports.getQuizById = (req, res) => sendResponse(res, 501, null, 'Not implemented');
exports.submitQuiz = (req, res) => sendResponse(res, 501, null, 'Not implemented');
exports.getQuizResults = (req, res) => sendResponse(res, 501, null, 'Not implemented');
exports.getAllQuizzes = (req, res) => sendResponse(res, 501, null, 'Not implemented');
exports.createQuiz = (req, res) => sendResponse(res, 501, null, 'Not implemented');
exports.updateQuiz = (req, res) => sendResponse(res, 501, null, 'Not implemented');
exports.deleteQuiz = (req, res) => sendResponse(res, 501, null, 'Not implemented'); 