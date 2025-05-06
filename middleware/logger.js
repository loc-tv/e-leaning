// Middleware này dùng để ghi lại log các request:

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next(); // Chuyển tiếp request đến middleware tiếp theo
};

module.exports = logger;

